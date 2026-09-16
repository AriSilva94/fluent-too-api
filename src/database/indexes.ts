import type { Core } from '@strapi/strapi';

export type IndexDefinition = {
  name: string;
  table: string;
  columns: string[];
  unique?: boolean;
};

export const APP_INDEXES: IndexDefinition[] = [
  {
    name: 'teacher_applications_review_status_created_at_idx',
    table: 'teacher_applications',
    columns: ['review_status', 'created_at'],
  },
  {
    name: 'quiz_attempts_completed_at_idx',
    table: 'quiz_attempts',
    columns: ['completed_at'],
  },
  {
    name: 'quiz_attempts_attempt_key_unique',
    table: 'quiz_attempts',
    columns: ['attempt_key'],
    unique: true,
  },
];

export type ObsoleteIndex = { name: string; table: string };

export const OBSOLETE_INDEXES: ObsoleteIndex[] = [
  { name: 'teacher_applications_status_created_at_idx', table: 'teacher_applications' },
];

export const INDEX_OUTCOME = {
  created: 'created',
  present: 'present',
  missingTable: 'missing-table',
  duplicateValues: 'duplicate-values',
} as const;

export type IndexOutcome = (typeof INDEX_OUTCOME)[keyof typeof INDEX_OUTCOME];

export type IndexExistsQuery = { sql: string; bindings: string[] };

export function buildIndexExistsQuery(client: string, name: string): IndexExistsQuery {
  if (client.startsWith('sqlite')) {
    return { sql: "select name from sqlite_master where type = 'index' and name = ?", bindings: [name] };
  }
  if (client.startsWith('mysql') || client.startsWith('maria')) {
    return {
      sql: 'select index_name from information_schema.statistics where table_schema = database() and index_name = ?',
      bindings: [name],
    };
  }
  return { sql: 'select indexname from pg_indexes where indexname = ?', bindings: [name] };
}

export function buildDropIndexStatement(client: string, name: string, table: string): string {
  if (client.startsWith('mysql') || client.startsWith('maria')) return `DROP INDEX \`${name}\` ON \`${table}\``;
  return `DROP INDEX IF EXISTS "${name}"`;
}

function rowsOf(result: unknown): unknown[] {
  if (Array.isArray(result)) return Array.isArray(result[0]) ? (result[0] as unknown[]) : result;
  const rows = (result as { rows?: unknown[] } | null)?.rows;
  return Array.isArray(rows) ? rows : [];
}

async function indexExists(knex: any, client: string, name: string): Promise<boolean> {
  const { sql, bindings } = buildIndexExistsQuery(client, name);
  return rowsOf(await knex.raw(sql, bindings)).length > 0;
}

export async function countDuplicateValues(knex: any, table: string, column: string): Promise<number> {
  const duplicates = await knex(table).select(column).whereNotNull(column).groupBy(column).havingRaw('COUNT(*) > 1');
  return duplicates.length;
}

export async function ensureIndex(knex: any, client: string, definition: IndexDefinition): Promise<IndexOutcome> {
  if (!(await knex.schema.hasTable(definition.table))) return INDEX_OUTCOME.missingTable;
  if (await indexExists(knex, client, definition.name)) return INDEX_OUTCOME.present;

  if (definition.unique && definition.columns.length === 1) {
    const duplicates = await countDuplicateValues(knex, definition.table, definition.columns[0]);
    if (duplicates > 0) return INDEX_OUTCOME.duplicateValues;
  }

  await knex.schema.alterTable(definition.table, (table: any) => {
    if (definition.unique) {
      table.unique(definition.columns, { indexName: definition.name });
      return;
    }
    table.index(definition.columns, definition.name);
  });

  return INDEX_OUTCOME.created;
}

export async function ensureAppIndexes(strapi: Core.Strapi, definitions: IndexDefinition[] = APP_INDEXES) {
  const knex = (strapi.db as any).connection;
  const client = String(knex.client?.config?.client ?? knex.client?.dialect ?? 'postgres');
  const outcomes: Record<string, IndexOutcome> = {};

  for (const definition of definitions) {
    outcomes[definition.name] = await ensureIndex(knex, client, definition);

    if (outcomes[definition.name] === INDEX_OUTCOME.duplicateValues) {
      strapi.log.warn(
        `Indice ${definition.name} nao criado: ${definition.table}.${definition.columns[0]} tem valores duplicados. Resolva os duplicados e reinicie.`
      );
    }
    if (outcomes[definition.name] === INDEX_OUTCOME.missingTable) {
      strapi.log.warn(`Indice ${definition.name} nao criado: tabela ${definition.table} nao existe.`);
    }
  }

  const criados = Object.entries(outcomes)
    .filter(([, outcome]) => outcome === INDEX_OUTCOME.created)
    .map(([name]) => name);
  if (criados.length > 0) strapi.log.info(`Indices criados: ${criados.join(', ')}.`);

  return outcomes;
}

export async function dropObsoleteIndexes(strapi: Core.Strapi, indexes: ObsoleteIndex[] = OBSOLETE_INDEXES) {
  const knex = (strapi.db as any).connection;
  const client = String(knex.client?.config?.client ?? knex.client?.dialect ?? 'postgres');
  const removidos: string[] = [];

  for (const { name, table } of indexes) {
    if (!(await indexExists(knex, client, name))) continue;
    await knex.raw(buildDropIndexStatement(client, name, table));
    removidos.push(name);
  }

  if (removidos.length > 0) strapi.log.info(`Indices obsoletos removidos: ${removidos.join(', ')}.`);
  return removidos;
}
