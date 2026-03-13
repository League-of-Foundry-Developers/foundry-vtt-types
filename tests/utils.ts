import ClientDocument = foundry.documents.abstract.ClientDocumentMixin;
// import Document = foundry.abstract.Document;

export * as database from "./database.ts";

/** Real value `false` */
export const falseOrUndefined: false | undefined = false;

/** Real value `true` */
export const trueOrUndefined: true | undefined = true;

/** Real value `true` */
export const booleanOrUndefined: boolean | undefined = true;

export const currentUser = game.user!;

export const testID = "FVTTTypesTestDoc";

export async function cleanupDocuments(docs: Iterable<ClientDocument.AnyMixed | undefined>) {
  for (const doc of docs) {
    if (!doc) continue;
    try {
      await doc.delete();
    } catch (e) {
      // We shouldn't be accidentally trying to delete temporary documents, but if we do somehow, log and move on
      console.error(e);
    }
  }
}

// export function isStored<Doc extends ClientDocument.AnyMixed>(
//   doc: Doc,
// ): doc is Document.StoredForName<Document.NameFor<Doc>> {
//   return doc.collection.has(doc.id ?? "");
// }
