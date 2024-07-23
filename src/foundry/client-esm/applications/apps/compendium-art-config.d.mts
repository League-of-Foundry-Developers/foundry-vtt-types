import type { ApplicationConfiguration, ApplicationRenderContext, ApplicationRenderOptions } from "../_types.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.mjs";

/**
 * An application for configuring compendium art priorities.
 */
declare class CompendiumArtConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  // placeholder private member to help subclassing
  #compendiumArtConfig: true;

  static override DEFAULT_OPTIONS: Partial<ApplicationConfiguration>;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  override _prepareContext(_options: ApplicationRenderOptions): Promise<ApplicationRenderContext>;
}

export default CompendiumArtConfig;
