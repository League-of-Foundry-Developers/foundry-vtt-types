import type { DeepPartial } from "../../../../types/utils.d.mts";
import type { CompendiumArtDescriptor } from "../../helpers/_types.d.mts";
import type { ApplicationConfiguration, ApplicationRenderOptions, FormFooterButton } from "../_types.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.mjs";

/**
 * An application for configuring compendium art priorities.
 */
declare class CompendiumArtConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  // placeholder private member to help subclassing
  #compendiumArtConfig: true;

  static override DEFAULT_OPTIONS: Partial<ApplicationConfiguration>;
  static override PARTS: CompendiumArtConfig.Parts;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  override _prepareContext(_options: DeepPartial<ApplicationRenderOptions>): Promise<CompendiumArtConfig.RenderContext>;
}

declare namespace CompendiumArtConfig {
  interface RenderContext {
    config: CompendiumArtDescriptor[];
    buttons: FormFooterButton[];
  }

  interface Parts extends Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart> {
    priorities: HandlebarsApplicationMixin.HandlebarsTemplatePart;
    footer: HandlebarsApplicationMixin.HandlebarsTemplatePart;
  }
}

export default CompendiumArtConfig;
