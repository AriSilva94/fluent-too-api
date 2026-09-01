import { describe, expect, it, vi } from 'vitest';
import {
  APP_INDEXES,
  INDEX_OUTCOME,
  buildDropIndexStatement,
  buildIndexExistsQuery,
  ensureAppIndexes,
  ensureIndex,
} from './indexes';

type FakeOptions = {
  tables?: string[];
  indexes?: string[];
  duplicates?: number;
};

function createKnex({ tables = [], indexes = [], duplicates = 0 }: FakeOptions) {
  const created: { table: string; name: string; columns: string[]; unique: boolean }[] = [];
  const dropped: string[] = [];

  const builder = (table: string) => ({
    select: () => builder(table),
    whereNotNull: () => builder(table),
    groupBy: () => builder(table),
    havingRaw: async () => Array.from({ length: duplicates }, (_, index) => ({ id: index })),
  });

  const knex: any = (table: string) => builder(table);

  knex.client = { config: { client: 'postgres' } };

  knex.raw = vi.fn(async (sql: string, bindings?: string[]) => {
    if (sql.startsWith('DROP INDEX')) {
      dropped.push(sql);
      return { rows: [] };
    }
    const name = bindings?.[0];
    return { rows: indexes.includes(String(name)) ? [{ indexname: name }] : [] };
  });

  knex.schema = {
    hasTable: async (table: string) => tables.includes(table),
    alterTable: async (table: string, callback: (builder: any) => void) => {
      callback({
        index: (columns: string[], name: string) => created.push({ table, name, columns, unique: false }),
        unique: (columns: string[], options: { indexName: string }) =>
          created.push({ table, name: options.indexName, columns, unique: true }),
      });
    },
  };

  return { knex, created, dropped };
}

const strapiLog = () => ({ log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } });

describe('consulta de existência de índice', () => {
  it('usa o catálogo certo por dialeto', () => {
    expect(buildIndexExistsQuery('postgres', 'idx').sql).toContain('pg_indexes');
    expect(buildIndexExistsQuery('sqlite3', 'idx').sql).toContain('sqlite_master');
    expect(buildIndexExistsQuery('mysql2', 'idx').sql).toContain('information_schema.statistics');
    expect(buildIndexExistsQuery('postgres', 'idx').bindings).toEqual(['idx']);
  });

  it('monta o drop conforme o dialeto', () => {
    expect(buildDropIndexStatement('postgres', 'idx', 'tabela')).toBe('DROP INDEX IF EXISTS "idx"');
    expect(buildDropIndexStatement('mysql2', 'idx', 'tabela')).toBe('DROP INDEX `idx` ON `tabela`');
  });
});

describe('garantia de índice', () => {
  const definition = APP_INDEXES[0];

  it('cria o índice quando a tabela existe e o índice não', async () => {
    const { knex, created } = createKnex({ tables: [definition.table] });

    await expect(ensureIndex(knex, 'postgres', definition)).resolves.toBe(INDEX_OUTCOME.created);
    expect(created).toEqual([
      { table: definition.table, name: definition.name, columns: definition.columns, unique: false },
    ]);
  });

  it('não recria índice já existente', async () => {
    const { knex, created } = createKnex({ tables: [definition.table], indexes: [definition.name] });

    await expect(ensureIndex(knex, 'postgres', definition)).resolves.toBe(INDEX_OUTCOME.present);
    expect(created).toEqual([]);
  });

  it('avisa quando a tabela ainda não existe', async () => {
    const { knex, created } = createKnex({ tables: [] });

    await expect(ensureIndex(knex, 'postgres', definition)).resolves.toBe(INDEX_OUTCOME.missingTable);
    expect(created).toEqual([]);
  });

  it('recusa índice único com valores duplicados', async () => {
    const unico = APP_INDEXES.find((index) => index.unique)!;
    const { knex, created } = createKnex({ tables: [unico.table], duplicates: 3 });

    await expect(ensureIndex(knex, 'postgres', unico)).resolves.toBe(INDEX_OUTCOME.duplicateValues);
    expect(created).toEqual([]);
  });

  it('cria índice único quando não há duplicados', async () => {
    const unico = APP_INDEXES.find((index) => index.unique)!;
    const { knex, created } = createKnex({ tables: [unico.table] });

    await expect(ensureIndex(knex, 'postgres', unico)).resolves.toBe(INDEX_OUTCOME.created);
    expect(created).toEqual([{ table: unico.table, name: unico.name, columns: unico.columns, unique: true }]);
  });
});

describe('bootstrap de índices', () => {
  it('cria todos os índices de uma base nova', async () => {
    const tables = [...new Set(APP_INDEXES.map((index) => index.table))];
    const { knex, created } = createKnex({ tables });
    const strapi = { db: { connection: knex }, ...strapiLog() } as any;

    const outcomes = await ensureAppIndexes(strapi);

    expect(Object.values(outcomes).every((outcome) => outcome === INDEX_OUTCOME.created)).toBe(true);
    expect(created.map((index) => index.name).sort()).toEqual(APP_INDEXES.map((index) => index.name).sort());
  });

  it('é idempotente numa base que já tem tudo', async () => {
    const tables = [...new Set(APP_INDEXES.map((index) => index.table))];
    const { knex, created } = createKnex({ tables, indexes: APP_INDEXES.map((index) => index.name) });
    const strapi = { db: { connection: knex }, ...strapiLog() } as any;

    const outcomes = await ensureAppIndexes(strapi);

    expect(Object.values(outcomes).every((outcome) => outcome === INDEX_OUTCOME.present)).toBe(true);
    expect(created).toEqual([]);
  });
});
