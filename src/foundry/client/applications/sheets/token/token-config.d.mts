import type { Identity } from "#utils";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type TokenApplicationMixin from "./mixin.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TokenConfig: TokenConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single token document within a parent Scene
 * @remarks TODO: Stub
 */
declare class TokenConfig<
  RenderContext extends TokenConfig.RenderContext = TokenConfig.RenderContext,
  Configuration extends TokenConfig.Configuration = TokenConfig.Configuration,
  RenderOptions extends TokenConfig.RenderOptions = TokenConfig.RenderOptions,
> extends TokenApplicationMixin(DocumentSheetV2)<
  TokenDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace TokenConfig {
  interface Any extends AnyTokenConfig {}
  interface AnyConstructor extends Identity<typeof AnyTokenConfig> {}

  interface RenderContext
    extends
      TokenApplicationMixin.RenderContext<TokenDocument.Implementation>,
      DocumentSheetV2.RenderContext<TokenDocument.Implementation> {}

  interface Configuration
    extends TokenApplicationMixin.Configuration, DocumentSheetV2.Configuration<TokenDocument.Implementation> {}

  interface RenderOptions extends TokenApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyTokenConfig extends TokenConfig<
  TokenConfig.RenderContext,
  TokenConfig.Configuration,
  TokenConfig.RenderOptions
> {
  constructor(...args: never);
}

export default TokenConfig;
