import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RollTableConfig: RollTableConfig.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing a single RollTable document.
 * @remarks TODO: Stub
 */
declare class RollTableConfig<
  RenderContext extends RollTableConfig.RenderContext = RollTableConfig.RenderContext,
  Configuration extends RollTableConfig.Configuration = RollTableConfig.Configuration,
  RenderOptions extends RollTableConfig.RenderOptions = RollTableConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RollTable.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace RollTableConfig {
  interface Any extends AnyRollTableConfig {}
  interface AnyConstructor extends Identity<typeof AnyRollTableConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<RollTable.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<RollTable.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyRollTableConfig extends RollTableConfig<
  RollTableConfig.RenderContext,
  RollTableConfig.Configuration,
  RollTableConfig.RenderOptions
> {
  constructor(...args: never);
}

export default RollTableConfig;
