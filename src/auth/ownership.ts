import { isAdminRole } from './roles';

type OwnerUser = { id: number | string; role?: { type?: string } | null };

/**
 * Remove qualquer `owner` enviado pelo cliente no corpo da requisição de create.
 * O atributo `owner` é `private` no schema (para não vazar e-mail de professor via
 * `?populate=owner` em endpoints públicos), então o content API rejeita a chave `owner`
 * no body. O dono real é atribuído depois, fora do body, via query engine, a partir do
 * usuário autenticado (`ctx.state.user`) — nunca a partir do que o cliente enviou.
 */
export function stripOwner(input: Record<string, unknown>) {
  const { owner: _ignoredOwner, ...rest } = input ?? {};
  return rest;
}

export function canMutateEntry(entry: { owner?: { id: number | string } | null }, user: OwnerUser) {
  if (isAdminRole(user.role?.type)) return true;
  return Boolean(entry.owner) && String(entry.owner?.id) === String(user.id);
}

/**
 * Com `draftAndPublish` um documento é mais de uma linha (rascunho e publicada) com o
 * mesmo `documentId`. O documento é do usuário quando QUALQUER uma das linhas aponta
 * para ele — assim uma divergência entre as linhas nunca vira 403 no próprio conteúdo.
 */
export function canMutateDocument(entries: { owner?: { id: number | string } | null }[], user: OwnerUser) {
  if (isAdminRole(user.role?.type)) return true;
  return entries.some((entry) => canMutateEntry(entry, user));
}

/**
 * Grava o dono em TODAS as linhas do documento. `updateMany` da query engine ignora
 * relações (só processa atributos escalares), então cada linha é atualizada por id.
 */
export async function assignOwnerToDocument(
  strapi: any,
  uid: string,
  where: Record<string, unknown>,
  userId: number | string
) {
  const rows: { id: number | string }[] = await strapi.db.query(uid).findMany({ where, select: ['id'] });
  if (!rows || rows.length === 0) throw new Error('Registro criado não encontrado para vincular owner.');

  for (const row of rows) {
    await strapi.db.query(uid).update({ where: { id: row.id }, data: { owner: userId } });
  }

  return rows.length;
}
