import ClientDocument = foundry.documents.abstract.ClientDocumentMixin;

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
