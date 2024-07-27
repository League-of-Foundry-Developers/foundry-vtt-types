import type { InterfaceToObject } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial } from "../../../../types/utils.d.mts";
import type { CompendiumArtDescriptor } from "../../helpers/_types.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

type CompendiumArtConfigRenderContext = InterfaceToObject<CompendiumArtConfig.RenderContext>;

/**
 * An application for configuring compendium art priorities.
 */
declare class CompendiumArtConfig<
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
  RenderContext extends CompendiumArtConfigRenderContext = CompendiumArtConfigRenderContext,
> extends HandlebarsApplicationMixin(ApplicationV2)<Configuration, RenderOptions, RenderContext> {
  // placeholder private member to help subclassing
  #compendiumArtConfig: true;

  static override DEFAULT_OPTIONS: Partial<ApplicationV2.Configuration>;
  static override PARTS: CompendiumArtConfig.Parts;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  override _prepareContext(_options: DeepPartial<ApplicationV2.RenderOptions>): Promise<RenderContext>;
}

declare namespace CompendiumArtConfig {
  interface RenderContext {
    config: CompendiumArtDescriptor[];
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Parts extends Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart> {
    priorities: HandlebarsApplicationMixin.HandlebarsTemplatePart;
    footer: HandlebarsApplicationMixin.HandlebarsTemplatePart;
  }
}

export default CompendiumArtConfig;
