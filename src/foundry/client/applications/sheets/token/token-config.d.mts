import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type PlaceableConfig from "../placeable-config.d.mts";
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
 */
declare class TokenConfig<
  RenderContext extends TokenConfig.RenderContext = TokenConfig.RenderContext,
  Configuration extends TokenConfig.Configuration = TokenConfig.Configuration,
  RenderOptions extends TokenConfig.RenderOptions = TokenConfig.RenderOptions,
> extends TokenApplicationMixin(PlaceableConfig)<
  TokenDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /** @override */
  override isPrototype: false;

  override get token(): TokenDocument.Implementation;

  override get actor(): Actor.Implementation | null;

  protected override get _fields(): TokenDocument.Schema;

  override get isVisible(): boolean;

  protected override _prepareAppearanceTab(): Promise<TokenApplicationMixin.AppearanceTabContext>;

  protected override _previewChanges(changes: foundry.documents.BaseToken.UpdateData): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Handle changing the attribute bar in the drop-down selector to update the default current and max value
   * @param event - The select input change event
   */
  protected _onChangeBar(event: Event): void;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: object,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<TokenDocument.Implementation>>;

  #TokenConfig: true;
}

declare namespace TokenConfig {
  interface Any extends AnyTokenConfig {}
  interface AnyConstructor extends Identity<typeof AnyTokenConfig> {}

  interface RenderContext
    extends
      TokenApplicationMixin.RenderContext<TokenDocument.Implementation>,
      PlaceableConfig.RenderContext<TokenDocument.Implementation> {}

  interface Configuration
    extends TokenApplicationMixin.Configuration, PlaceableConfig.Configuration<TokenDocument.Implementation> {}

  interface RenderOptions extends TokenApplicationMixin.RenderOptions, PlaceableConfig.RenderOptions {}
}

declare abstract class AnyTokenConfig extends TokenConfig<
  TokenConfig.RenderContext,
  TokenConfig.Configuration,
  TokenConfig.RenderOptions
> {
  constructor(...args: never);
}

export default TokenConfig;
