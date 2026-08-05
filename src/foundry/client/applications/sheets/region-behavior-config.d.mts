import type { DeepPartial, Identity } from "#utils";
import type { FormFooterButton, FormNode } from "../_types.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RegionBehaviorConfig: RegionBehaviorConfig.Any;
    }
  }
}

/**
 * The Scene Region configuration application.
 */
declare class RegionBehaviorConfig<
  RenderContext extends RegionBehaviorConfig.RenderContext = RegionBehaviorConfig.RenderContext,
  Configuration extends RegionBehaviorConfig.Configuration = RegionBehaviorConfig.Configuration,
  RenderOptions extends RegionBehaviorConfig.RenderOptions = RegionBehaviorConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RegionBehavior.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  constructor(options: DocumentSheetV2.InputOptions<Configuration>);

  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Prepare form field structure for rendering.
   */
  protected _getFields(): FormNode[];

  /**
   * Get footer buttons for this behavior config sheet.
   */
  protected _getButtons(): FormFooterButton[];

  #RegionBehaviorConfig: true;
}

declare namespace RegionBehaviorConfig {
  interface Any extends AnyRegionBehaviorConfig {}
  interface AnyConstructor extends Identity<typeof AnyRegionBehaviorConfig> {}

  /**
   * @remarks `fields` is omitted and redeclared because
   * {@linkcode RegionBehaviorConfig._prepareContext | #_prepareContext} replaces the schema fields from
   * {@linkcode DocumentSheetV2._prepareContext | DocumentSheetV2#_prepareContext} with the form structure
   * built by {@linkcode RegionBehaviorConfig._getFields | #_getFields}.
   */
  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      Omit<DocumentSheetV2.RenderContext<RegionBehavior.Implementation>, "fields"> {
    /** @remarks The same value as {@linkcode DocumentSheetV2.RenderContext.document | context.document}. */
    region: RegionBehavior.Implementation;

    fields: FormNode[];

    /** @remarks The behavior type's configured hint, or `undefined` when its type has none. */
    hint: string | undefined;

    buttons: FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<RegionBehavior.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyRegionBehaviorConfig extends RegionBehaviorConfig<
  RegionBehaviorConfig.RenderContext,
  RegionBehaviorConfig.Configuration,
  RegionBehaviorConfig.RenderOptions
> {
  constructor(...args: never);
}

export default RegionBehaviorConfig;
