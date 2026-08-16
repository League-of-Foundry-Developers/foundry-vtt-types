import { expectTypeOf } from "vitest";

import AdventureExporter = foundry.applications.sheets.AdventureExporter;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;

declare const doc: Adventure.Implementation;
const exporter = new AdventureExporter({ document: doc });

expectTypeOf(exporter.document).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(exporter.contentTree).toEqualTypeOf<Record<string, AdventureExporter.ContentTreeRoot>>();

declare const someDocument: Actor.Implementation;
expectTypeOf(exporter.addContent(someDocument)).toEqualTypeOf<void>();
expectTypeOf(exporter.removeContent(someDocument)).toEqualTypeOf<void>();

expectTypeOf(AdventureExporter.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(AdventureExporter.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

declare const context: AdventureExporter.RenderContext;
expectTypeOf(context.adventure).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(context.contentTree).toEqualTypeOf<Record<string, AdventureExporter.ContentTreeRoot>>();
expectTypeOf(context.tabClasses).toBeString();

declare const root: AdventureExporter.ContentTreeRoot;
expectTypeOf(root.id).toEqualTypeOf<null>();
expectTypeOf(root.documentCount).toBeNumber();
expectTypeOf(root.children).toEqualTypeOf<AdventureExporter.ContentTreeNode[]>();
expectTypeOf(root.documents).toEqualTypeOf<AdventureExporter.ContentTreeDocument[]>();
expectTypeOf(root.state).toEqualTypeOf<AdventureExporter.DocumentState>();
