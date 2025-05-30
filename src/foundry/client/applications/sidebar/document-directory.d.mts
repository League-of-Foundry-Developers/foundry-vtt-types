import type { Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "./sidebar-tab.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DocumentDirectory: DocumentDirectory.Any;
    }
  }
}

/**
 * An abstract class for rendering a foldered directory of Documents.
 * @remarks TODO: Stub
 */
declare class DocumentDirectory<
  DocumentClass extends Document.AnyConstructor = Document.AnyConstructor,
  RenderContext extends DocumentDirectory.RenderContext = DocumentDirectory.RenderContext,
  Configuration extends DocumentDirectory.Configuration = DocumentDirectory.Configuration,
  RenderOptions extends DocumentDirectory.RenderOptions = DocumentDirectory.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  get documentClass(): DocumentClass;
}

declare namespace DocumentDirectory {
  interface Any extends AnyDocumentDirectory {}
  interface AnyConstructor extends Identity<typeof AnyDocumentDirectory> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {}

  interface Configuration extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.Configuration {
    /** The Document collection that this directory represents. */
    collection: DirectoryApplicationMixin.AnyMixed;

    /** Updating one of these properties of a displayed Document will trigger a re-render of the tab. */
    renderUpdateKeys: string[];
  }

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyDocumentDirectory extends DocumentDirectory<
  Document.AnyConstructor,
  DocumentDirectory.RenderContext,
  DocumentDirectory.Configuration,
  DocumentDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default DocumentDirectory;
