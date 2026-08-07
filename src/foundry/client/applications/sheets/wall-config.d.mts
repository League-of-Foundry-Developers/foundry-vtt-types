import type { AnyObject, DeepPartial, Identity, InterfaceToObject, RemoveIndexSignatures } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      WallConfig: WallConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Wall document within a parent Scene.
 */
declare class WallConfig<
  RenderContext extends WallConfig.RenderContext = WallConfig.RenderContext,
  Configuration extends WallConfig.Configuration = WallConfig.Configuration,
  RenderOptions extends WallConfig.RenderOptions = WallConfig.RenderOptions,
> extends PlaceableConfig<WallDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: DocumentSheetV2.SubmitData<WallDocument.Implementation>,
  ): DocumentSheetV2.SubmitData<WallDocument.Implementation>;

  #WallConfig: true;
}

declare namespace WallConfig {
  interface Any extends AnyWallConfig {}
  interface AnyConstructor extends Identity<typeof AnyWallConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<WallDocument.Implementation> {
    /**
     * @remarks The localization of `"WALL.CoordinateRange"` filled in with the Wall's endpoints. It is absent for a
     * {@linkcode foundry.applications.sheets.palette.WallPalette}, which has no single pair of endpoints.
     */
    coordinates?: string | undefined;

    thresholdFields: ThresholdField[];

    /**
     * @remarks The Wall's door animation source data, falling back to the cleaned default of the `animation` field.
     */
    // FIXME: `foundry.documents.BaseWall.Source["animation"]` once the Wall schema is migrated to V14, which
    // added the `animation` field.
    animation: AnyObject;

    animationDirections: AnimationDirectionChoice[];

    animationTypes: InterfaceToObject<RemoveIndexSignatures<CONFIG.Wall.DoorAnimations>>;

    /** @remarks `""` when the door animation fieldset should be shown, `"hidden"` otherwise. */
    animationFieldsetClass: string;

    doorSounds: InterfaceToObject<RemoveIndexSignatures<CONFIG.Wall.DoorSounds>>;

    buttons: ApplicationV2.FormFooterButton[];
  }

  /** One of the `light` / `sight` / `sound` restriction fields, with its proximity-threshold state. */
  interface ThresholdField {
    name: SenseType;

    label: string;

    choices: foundry.data.fields.NumberField.Choices | undefined;

    /** @remarks `true` unless the current value is a proximity or distance sense type. */
    disabled: boolean;
  }

  type SenseType = "light" | "sight" | "sound";

  interface AnimationDirectionChoice {
    value: -1 | 1;

    label: string;
  }

  interface Configuration extends PlaceableConfig.Configuration<WallDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyWallConfig extends WallConfig<
  WallConfig.RenderContext,
  WallConfig.Configuration,
  WallConfig.RenderOptions
> {
  constructor(...args: never);
}

export default WallConfig;
