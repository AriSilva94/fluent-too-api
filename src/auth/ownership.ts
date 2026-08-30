import { isAdminRole } from './roles';

type OwnerUser = { id: number | string; role?: { type?: string } | null };

export function stripOwner(input: Record<string, unknown>) {
  const { owner: _ignoredOwner, ...rest } = input ?? {};
  return rest;
}

export function canMutateEntry(entry: { owner?: { id: number | string } | null }, user: OwnerUser) {
  if (isAdminRole(user.role?.type)) return true;
  return Boolean(entry.owner) && String(entry.owner?.id) === String(user.id);
}

export function canMutateDocument(entries: { owner?: { id: number | string } | null }[], user: OwnerUser) {
  if (isAdminRole(user.role?.type)) return true;
  return entries.some((entry) => canMutateEntry(entry, user));
}

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
