import type BasePlaceableHUD from "./placeable-hud.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { AnyObject, DeepPartial, Identity } from "#utils";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TokenHUD: TokenHUD.Any;
    }
  }
}

/**
 * An implementation of the BasePlaceableHUD base class which renders a heads-up-display interface for Token objects.
 * This interface provides controls for visibility, attribute bars, elevation, status effects, and more.
 * The TokenHUD implementation can be configured and replaced via {@link CONFIG.Token.hudClass}.
 */
declare class TokenHUD<
  RenderContext extends TokenHUD.RenderContext = TokenHUD.RenderContext,
  Configuration extends TokenHUD.Configuration = TokenHUD.Configuration,
  RenderOptions extends TokenHUD.RenderOptions = TokenHUD.RenderOptions,
> extends HandlebarsApplicationMixin(BasePlaceableHUD)<
  Token.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "token-hud",
   *   actions: {
   *     combat: TokenHUD.#onToggleCombat,
   *     target: TokenHUD.#onToggleTarget,
   *     effect: {handler: TokenHUD.#onToggleEffect, buttons: [0, 2]},
   *     movementAction: TokenHUD.#onSelectMovementAction,
   *     level: TokenHUD.#onChangeLevel
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: BasePlaceableHUD.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   hud: {
   *     root: true,
   *     template: "templates/hud/token-hud.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Convenience reference to the Actor modified by this TokenHUD.
   * @remarks `undefined` when the HUD is not bound to a Token.
   */
  get actor(): Actor.Implementation | null | undefined;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  /**
   * Get the valid status effect choices.
   */
  protected _getStatusEffectChoices(): Record<string, TokenHUD.StatusEffectChoice>;

  /**
   * Get the valid movement action choices.
   */
  protected _getMovementActionChoices(): Record<string, TokenHUD.MovementActionChoice>;

  /**
   * Get the level choices for this Token.
   */
  protected _getLevelChoices(): Record<string, TokenHUD.LevelChoice>;

  protected override _onPosition(position: ApplicationV2.Position): void;

  protected override _parseAttributeInput(
    name: string,
    attr: AnyObject | number,
    input: string,
  ): BasePlaceableHUD.ParsedAttributeInput;

  protected override _onSubmit(
    event: SubmitEvent | Event,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void>;

  protected override _onSubmitElevation(
    event: SubmitEvent | Event,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void>;

  /**
   * @deprecated "`TokenHUD#toggleStatusTray` has been deprecated in favor of
   * {@linkcode TokenHUD.togglePalette | TokenHUD#togglePalette}`("effects", active?)`" (since v13, until v15)
   */
  toggleStatusTray(active?: boolean): void;

  #TokenHUD: true;
}

declare namespace TokenHUD {
  interface Any extends AnyTokenHUD {}
  interface AnyConstructor extends Identity<typeof AnyTokenHUD> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, BasePlaceableHUD.RenderContext {
    canConfigure: boolean;
    canToggleCombat: boolean;
    displayBar1: boolean;
    bar1Data: TokenDocument.GetBarAttributeReturn;
    displayBar2: boolean;
    bar2Data: TokenDocument.GetBarAttributeReturn;
    combatClass: string;
    targetClass: string;
    statusEffects: Record<string, StatusEffectChoice>;
    movementActions: Record<string, MovementActionChoice>;
    movementActionsConfig: CONFIG.Token.Movement.ActionConfig;
    levels: Record<string, LevelChoice>;
    canChangeLevel: boolean;
  }

  /** A single valid status effect choice */
  interface StatusEffectChoice {
    id: string;

    _id: string | undefined;

    title: string;

    src: string;

    order: number;

    isActive: boolean;

    isOverlay: boolean;

    cssClass: string;
  }

  /** A single valid movement action choice */
  interface MovementActionChoice {
    id: string;

    label: string;

    icon?: string | undefined;

    img?: string | undefined;

    isActive: boolean;

    cssClass: string;
  }

  /** A single level choice for this Token */
  interface LevelChoice {
    id: string;

    name: string;

    cssClass: string;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, BasePlaceableHUD.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, BasePlaceableHUD.RenderOptions {}
}

declare abstract class AnyTokenHUD extends TokenHUD<
  TokenHUD.RenderContext,
  TokenHUD.Configuration,
  TokenHUD.RenderOptions
> {
  constructor(...args: never);
}

export default TokenHUD;
