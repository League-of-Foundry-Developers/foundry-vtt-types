import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RollTableSheet: RollTableSheet.Any;
    }
  }
}

/**
 * The Application responsible for editing, displaying, and using a single RollTable document.
 * @remarks TODO: Stub
 */
declare class RollTableSheet<
  RenderContext extends RollTableSheet.RenderContext = RollTableSheet.RenderContext,
  Configuration extends RollTableSheet.Configuration = RollTableSheet.Configuration,
  RenderOptions extends RollTableSheet.RenderOptions = RollTableSheet.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RollTable.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace RollTableSheet {
  interface Any extends AnyRollTableSheet {}
  interface AnyConstructor extends Identity<typeof AnyRollTableSheet> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<RollTable.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<RollTable.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyRollTableSheet extends RollTableSheet<
  RollTableSheet.RenderContext,
  RollTableSheet.Configuration,
  RollTableSheet.RenderOptions
> {
  constructor(...args: never);
}

export default RollTableSheet;
