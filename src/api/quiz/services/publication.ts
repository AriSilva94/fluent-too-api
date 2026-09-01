export type PublishableEntry = { documentId?: unknown; publishedAt?: unknown };

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

function readDocumentId(entry: PublishableEntry): string | null {
  return typeof entry.documentId === 'string' && entry.documentId ? entry.documentId : null;
}
