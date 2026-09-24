import { expectTypeOf, test } from "vitest";

import FolderConfig = foundry.applications.sheets.FolderConfig;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

declare const folder: Folder.Implementation;

declare const context: FolderConfig.RenderContext;

test("foundry/client/applications/sheets/folder-config", () => {
  const folderConfig = new FolderConfig({ document: folder });

  expectTypeOf(folderConfig.document).toEqualTypeOf<Folder.Implementation>();
  expectTypeOf(FolderConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();

  // `resolve` is only called if it was provided
  expectTypeOf(folderConfig.options.resolve).toEqualTypeOf<FolderConfig.ResolveFunction | undefined>();
  new FolderConfig({
    document: folder,
    resolve: (doc) => expectTypeOf(doc).toEqualTypeOf<foundry.documents.abstract.ClientDocumentMixin.AnyMixed | null>(),
  });

  expectTypeOf(context.name).toEqualTypeOf<string>();
  expectTypeOf(context.namePlaceholder).toEqualTypeOf<string>();
});
