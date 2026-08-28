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
