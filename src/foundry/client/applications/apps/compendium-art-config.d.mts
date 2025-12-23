import type { InterfaceToObject, ConformRecord, MustConform, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type CompendiumArt from "../../helpers/media/compendium-art.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CompendiumArtConfig: CompendiumArtConfig.Any;
    }
  }
}

type CompendiumArtConfigParts = ConformRecord<
  CompendiumArtConfig.Parts,
  HandlebarsApplicationMixin.HandlebarsTemplatePart
>;

/**
 * An application for configuring compendium art priorities.
 */
declare class CompendiumArtConfig<
  RenderContext extends CompendiumArtConfig.RenderContext = CompendiumArtConfig.RenderContext,
  Configuration extends CompendiumArtConfig.Configuration = CompendiumArtConfig.Configuration,
  RenderOptions extends CompendiumArtConfig.RenderOptions = CompendiumArtConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // placeholder private member to help subclassing
  #compendiumArtConfig: true;

  static override DEFAULT_OPTIONS: CompendiumArtConfig.DefaultOptions;
  static override PARTS: CompendiumArtConfigParts;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  override _prepareContext(_options: DeepPartial<CompendiumArtConfig.RenderOptions>): Promise<RenderContext>;
}

declare namespace CompendiumArtConfig {
  interface Any extends AnyCompendiumArtConfig {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumArtConfig> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    config: CompendiumArt.Descriptor[];
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<CompendiumArtConfig extends CompendiumArtConfig.Any = CompendiumArtConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CompendiumArtConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CompendiumArtConfig extends CompendiumArtConfig.Any = CompendiumArtConfig.Any> = DeepPartial<
    Configuration<CompendiumArtConfig>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface Parts {
    priorities: HandlebarsApplicationMixin.HandlebarsTemplatePart;
    footer: HandlebarsApplicationMixin.HandlebarsTemplatePart;
  }
}

declare abstract class AnyCompendiumArtConfig extends CompendiumArtConfig<
  CompendiumArtConfig.RenderContext,
  CompendiumArtConfig.Configuration,
  CompendiumArtConfig.RenderOptions
> {}

type _PartsMustBeValid = MustConform<
  InterfaceToObject<CompendiumArtConfig.Parts>,
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>;

export default CompendiumArtConfig;
