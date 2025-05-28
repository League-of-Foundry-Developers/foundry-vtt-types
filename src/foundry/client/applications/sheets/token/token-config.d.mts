import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type TokenApplicationMixin from "./mixin.d.mts";

/**
 * The Application responsible for configuring a single token document within a parent Scene
 * @remarks TODO: Stub
 */
declare class TokenConfig<
  RenderContext extends TokenConfig.RenderContext = TokenConfig.RenderContext,
  Configuration extends TokenConfig.Configuration = TokenConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends TokenApplicationMixin(DocumentSheetV2)<
  TokenDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace TokenConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<TokenDocument.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<TokenDocument.Implementation> {}
}

export default TokenConfig;
