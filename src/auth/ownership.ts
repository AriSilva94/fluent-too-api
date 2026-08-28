import { isAdminRole } from './roles';

type OwnerUser = { id: number | string; role?: { type?: string } | null };

export function buildOwnedCreateData(input: Record<string, unknown>, user: OwnerUser) {
  const { owner: _ignoredOwner, ...rest } = input ?? {};
  return { ...rest, owner: user.id };
}

export function canMutateEntry(entry: { owner?: { id: number | string } | null }, user: OwnerUser) {
  if (isAdminRole(user.role?.type)) return true;
  return Boolean(entry.owner) && String(entry.owner?.id) === String(user.id);
}
