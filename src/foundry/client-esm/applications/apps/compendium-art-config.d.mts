import type { ConformRecord, InterfaceToObject, MustConform, DeepPartial } from "fvtt-types/utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type CompendiumArt from "../../helpers/compendium-art.d.mts";

type CompendiumArtConfigParts = ConformRecord<
  CompendiumArtConfig.Parts,
  HandlebarsApplicationMixin.HandlebarsTemplatePart
>;

/**
 * An application for configuring compendium art priorities.
 */
declare class CompendiumArtConfig<
  RenderContext extends
    InterfaceToObject<CompendiumArtConfig.RenderContext> = InterfaceToObject<CompendiumArtConfig.RenderContext>,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // placeholder private member to help subclassing
  #compendiumArtConfig: true;

  static override DEFAULT_OPTIONS: Partial<ApplicationV2.Configuration>;
  static override PARTS: CompendiumArtConfigParts;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  override _prepareContext(
    _options: DeepPartial<HandlebarsApplicationMixin.ApplicationV2RenderOptions>,
  ): Promise<RenderContext>;
}

declare namespace CompendiumArtConfig {
  interface RenderContext {
    config: CompendiumArt.Descriptor[];
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Parts {
    priorities: HandlebarsApplicationMixin.HandlebarsTemplatePart;
    footer: HandlebarsApplicationMixin.HandlebarsTemplatePart;
  }
}

type _PartsMustBeValid = MustConform<
  InterfaceToObject<CompendiumArtConfig.Parts>,
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>;

export default CompendiumArtConfig;
