import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type TokenApplicationMixin from "./mixin.d.mts";

/**
 * The Application responsible for configuring an actor's PrototypeToken
 * @remarks TODO: Stub
 */
declare class PrototypeTokenConfig<
  RenderContext extends PrototypeTokenConfig.RenderContext = PrototypeTokenConfig.RenderContext,
  Configuration extends PrototypeTokenConfig.Configuration = PrototypeTokenConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends TokenApplicationMixin(DocumentSheetV2)<
  TokenDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace PrototypeTokenConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<TokenDocument.ConfiguredInstance> {}

  interface Configuration extends DocumentSheetV2.Configuration<TokenDocument.ConfiguredInstance> {}
}

export default PrototypeTokenConfig;
