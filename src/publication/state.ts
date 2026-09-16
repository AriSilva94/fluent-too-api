export type PublishableEntry = { documentId?: unknown; publishedAt?: unknown };

export const DRAFT_STATUS = 'draft';

export function mergePublicationState<T extends PublishableEntry>(
  entries: T[],
  publishedAtByDocumentId: Map<string, string>
): T[] {
  return entries.map((entry) => {
    const documentId = readDocumentId(entry);
    return { ...entry, publishedAt: (documentId && publishedAtByDocumentId.get(documentId)) || null };
  });
}

export function documentIdsOf(entries: PublishableEntry[]): string[] {
  const ids = entries.map(readDocumentId).filter((id): id is string => Boolean(id));
  return Array.from(new Set(ids));
}

export async function withPublicationState<T extends PublishableEntry>(
  strapi: any,
  uid: string,
  entries: T[]
): Promise<T[]> {
  const documentIds = documentIdsOf(entries);
  if (documentIds.length === 0) return entries;

  const published = await strapi.db.query(uid).findMany({
    where: { documentId: { $in: documentIds }, publishedAt: { $notNull: true } },
    select: ['documentId', 'publishedAt'],
  });

  const publishedAtByDocumentId = new Map<string, string>(
    (published ?? []).map((entry: any) => [entry.documentId, new Date(entry.publishedAt).toISOString()])
  );

  return mergePublicationState(entries, publishedAtByDocumentId);
}

function readDocumentId(entry: PublishableEntry): string | null {
  return typeof entry.documentId === 'string' && entry.documentId ? entry.documentId : null;
}
