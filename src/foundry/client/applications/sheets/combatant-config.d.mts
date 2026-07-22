import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CombatantConfig: CombatantConfig.Any;
    }
  }
}

/**
 * The Combatant configuration application.
 */
declare class CombatantConfig<
  RenderContext extends CombatantConfig.RenderContext = CombatantConfig.RenderContext,
  Configuration extends CombatantConfig.Configuration = CombatantConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Combatant.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["combatant-config"],
   *   canCreate: true,
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-sword"
   *   },
   *   position: { width: 420 },
   *   form: {
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get title(): string;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;
}

declare namespace CombatantConfig {
  interface Any extends AnyCombatantConfig {}
  interface AnyConstructor extends Identity<typeof AnyCombatantConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Combatant.Implementation> {
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Combatant.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyCombatantConfig extends CombatantConfig<
  CombatantConfig.RenderContext,
  CombatantConfig.Configuration,
  CombatantConfig.RenderOptions
> {
  constructor(...args: never);
}

export default CombatantConfig;
