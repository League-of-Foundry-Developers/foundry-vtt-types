import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "./sidebar-tab.d.mts";

/**
 * An abstract class for rendering a foldered directory of Documents.
 * @remarks TODO: Stub
 */
declare class DocumentDirectory<
  DocumentClass extends foundry.abstract.Document.AnyConstructor = foundry.abstract.Document.AnyConstructor,
  RenderContext extends DocumentDirectory.RenderContext = DocumentDirectory.RenderContext,
  Configuration extends DocumentDirectory.Configuration = DocumentDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  get documentClass(): DocumentClass;
}

declare namespace DocumentDirectory {
  interface RenderContext extends AbstractSidebarTab.RenderContext {}

  interface Configuration extends ApplicationV2.Configuration {
    /** The Document collection that this directory represents. */
    collection: DirectoryApplicationMixin.AnyMixed;

    /** Updating one of these properties of a displayed Document will trigger a re-render of the tab. */
    renderUpdateKeys: string[];
  }
}

export default DocumentDirectory;
