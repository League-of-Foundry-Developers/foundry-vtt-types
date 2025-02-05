import type { DeepPartial, MaybeEmpty } from "fvtt-types/utils";
import type { fields } from "../foundry/common/data/module.d.mts";
import type Document from "../foundry/common/abstract/document.d.mts";

/**
 * Some global variables (such as {@link game}) are only initialized after certain events have happened during the
 * initialization of Foundry VTT. For that reason, the correct types for these variables include the types for the
 * uninitialized state.
 *
 * While this is correct from a type checking perspective, it can be inconvenient to have to type guard these global
 * variables everywhere. Some users might prefer the convenience over the 100% correctness in type checking.
 *
 * For this reason, this interface provides a way for users to configure certain global variables to be typed more
 * leniently, i.e., as the types of their initialized state. This is done via declaration merging. To do so merge in
 * a property with the name of the event that should be assumed to have been run.
 *
 * The currently supported hooks are:
 * - init
 * - i18nInit
 * - setup
 * - ready
 *
 * You can also set the special key "none" to make the default behavior set the variable to `undefined` instead of a union.
 *
 * @example
 * ```typescript
 * declare global {
 *   interface AssumeHookRan {
 *     setup: never; // the type doesn't matter
 *   }
 * }
 *
 * const referenceToGame: Game = game; // ok! :)
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AssumeHookRan {}

/**
 * This interface is used to configure the used document classes at a type
 * level. Module and system authors should use declaration merging to provide
 * the types of their configured document classes. It is extremely important
 * that this is kept in sync with the configuration that actually happens at
 * runtime.
 *
 * @example
 * ```typescript
 * // myActor.ts
 * class MyActor extends Actor {}
 *
 * // entryPoint.ts
 * import { MyActor } from "./myActor"
 *
 * hooks.once("init", () => {
 *   CONFIG.Actor.documentClass = typeof MyActor;
 * });
 *
 * declare global {
 *   interface DocumentClassConfig {
 *     Actor: typeof MyActor
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DocumentClassConfig {}

/**
 * This interface is used to configure the used object classes at a type
 * level. Module and system authors should use declaration merging to provide
 * the types of their configured object classes. It is extremely important
 * that this is kept in sync with the configuration that actually happens at
 * runtime.
 *
 * @example
 * ```typescript
 * // myToken.ts
 * class MyToken extends Token {}
 *
 * // entryPoint.ts
 * import { MyToken } from "./myToken"
 *
 * Hooks.once("init", () => {
 *   CONFIG.Token.objectClass = MyToken;
 * });
 *
 * declare global {
 *   interface PlaceableObjectClassConfig {
 *     Token: typeof MyToken;
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PlaceableObjectClassConfig {}

/**
 * This interface together with {@link SourceConfig} is used to configure the
 * types of the `data`  and `data._source` properties of the
 * {@link foundry.documents.BaseActor} and {@link foundry.documents.BaseItem}
 * classes. System authors should use declaration merging to provide the types
 * that match their `template.json` file. It is also very important for these
 * types to stay in sync with the `template.json` file, otherwise unexpected
 * runtime errors might appear.
 *
 * @example
 * ```typescript
 * interface ArmorDataSourceData {
 *   armorValue: number;
 * }
 *
 * interface ArmorDataSource {
 *   type: "armor";
 *   data: ArmorDataSourceData;
 * }
 *
 * interface WeaponDataSourceData {
 *   damagePerHit: number;
 *   attackSpeed: number;
 * }
 *
 * interface WeaponDataSource {
 *   type: "weapon";
 *   data: WeaponDataSourceData;
 * }
 *
 * interface ArmorDataPropertiesData extends ArmorDataSourceData {
 *   weight: number;
 * }
 *
 * interface ArmorDataProperties {
 *   type: "armor";
 *   data: ArmorDataPropertiesData;
 * }
 *
 * interface WeaponDataPropertiesData extends WeaponDataSourceData {
 *   damage: number;
 * }
 *
 * interface WeaponDataProperties {
 *   type: "weapon";
 *   data: WeaponDataPropertiesData;
 * }
 *
 * type MyItemDataSource = ArmorDataSource | WeaponDataSource;
 * type MyItemDataProperties = ArmorDataProperties | WeaponDataProperties;
 *
 * declare global {
 *   interface DataConfig {
 *     Item: MyItemDataProperties;
 *   }
 *
 *   interface SourceConfig {
 *     Item: MyItemDataSource;
 *   }
 * }
 * const item = await Item.create({
 *   name: "Axe",
 *   type: "weapon",
 *   attackSpeed: 1,
 *   damage: 5
 * });
 *
 * if(item.data.type === "weapon") {
 *   const damage: number = item.data.data.damage;
 * }
 *
 * if(item.data._source.type === "armor") {
 *   const armorValue = item.data._source.data.armorValue;
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DataConfig {}

/**
 * Configure the return type of the `getData` method for AppV1 Applications.
 *
 * mode - The mode of the return type.
 * - if mode is "partial", the return type is a partial of the data object, and will allow for any Record\<string,unknown\> to be returned, regardless of the actual data object.
 * - if mode is "exact", the return type is the exact data object, and will not allow for any additional properties to be returned.
 * - if mode is "object", the return type is a generic object, and will allow for any object to be returned, regardless of the actual data object.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetDataConfig {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DataModelConfig {}

/** @see {@link DataConfig} */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SourceConfig {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FlagConfig {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WebRTCConfig {}

/**
 * Injects extra data for modules from `game.modules.get("module-id")`.
 * @see {@link RequiredModules} for removing the `undefined` type for required modules.
 *  @example
 * ```typescript
 * interface ModuleConfig {
 *   "module-id": {
 *     api: APIObject;
 *   };
 * }
 * const moduleApi: APIObject | undefined = game.modules.get("module-id")?.api;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleConfig {}

/**
 * Removes `undefined` for modules listed as keys here from the return type of `game.modules.get`.
 * Useful if a module is a required dependency.
 * @see {@link ModuleConfig} for adding useful properties to the returned modules, like APIs.
 * @example
 * ```typescript
 * interface RequiredModules {
 *   "module-id": true;
 * }
 * const module: Game.ModuleData<foundry.packages.ModuleData> = game.modules.get("module-id");
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RequiredModules {}

export interface SettingConfig {
  "core.animateRollTable": boolean;
  "core.chatBubbles": fields.BooleanField<{ initial: true }>;
  "core.chatBubblesPan": fields.BooleanField<{ initial: true }>;
  "core.combatTrackerConfig": MaybeEmpty<{ resource: string; skipDefeated: boolean }>;
  "core.compendiumConfiguration": Partial<Record<string, CompendiumCollection.Configuration>>;
  "core.coneTemplateType": "round" | "flat";
  "core.colorSchema": fields.StringField<{
    required: true;
    blank: true;
    initial: "";
    choices: {
      "": "SETTINGS.ColorSchemeDefault";
      dark: "SETTINGS.ColorSchemeDark";
      light: "SETTINGS.ColorSchemeLight";
    };
  }>;
  "core.combatTheme": fields.StringField<{
    required: true;
    blank: false;
    initial: "none";
    choices: () => {
      [K in keyof CONFIG.Combat.Sounds]: string;
    };
  }>;
  "core.defaultDrawingConfig": MaybeEmpty<foundry.documents.BaseDrawing["_source"]>;
  "core.defaultToken": DeepPartial<foundry.documents.BaseToken>;
  "core.diceConfiguration": Record<CONFIG.Dice.DTermDiceStrings, string>;
  "core.disableResolutionScaling": boolean;
  "core.fontSize": number;
  "core.fpsMeter": boolean;
  "core.globalAmbientVolume": number;
  "core.globalInterfaceVolume": number;
  "core.globalPlaylistVolume": number;
  "core.keybindings": Record<string, ClientKeybindings.KeybindingActionBinding[]>;
  "core.language": fields.StringField<{
    required: true;
    blank: false;
    initial: NonNullable<typeof game.i18n>["lang"];
    choices: typeof CONFIG.supportedLanguages;
  }>;
  "core.leftClickRelease": fields.BooleanField<{ initial: true }>;
  "core.lightAnimation": boolean;
  "core.maxFPS": number;
  "core.mipmap": boolean;
  "core.moduleConfiguration": Record<string, boolean>;
  "core.noCanvas": fields.BooleanField<{ initial: false }>;
  "core.notesDisplayToggle": boolean;
  "core.nue.shownTips": boolean;
  "core.performanceMode": fields.NumberField<{
    required: true;
    nullable: true;
    initial: null;
    choices: {
      [_ in typeof CONST.CANVAS_PERFORMANCE_MODES.LOW]: "SETTINGS.PerformanceModeLow";
    } & {
      [_ in typeof CONST.CANVAS_PERFORMANCE_MODES.MED]: "SETTINGS.PerformanceModeMed";
    } & {
      [_ in typeof CONST.CANVAS_PERFORMANCE_MODES.HIGH]: "SETTINGS.PerformanceModeHigh";
    } & {
      [_ in typeof CONST.CANVAS_PERFORMANCE_MODES.MAX]: "SETTINGS.PerformanceModeMax";
    };
  }>;
  "core.permissions": Game.Permissions;
  "core.pixelRatioResolutionScaling": fields.BooleanField<{ initial: true }>;
  "core.playlist.playingLocation": "top" | "bottom";
  "core.rollMode": fields.StringField<{
    required: true;
    blank: false;
    initial: typeof CONST.DICE_ROLL_MODES.PUBLIC;
    choices: typeof CONFIG.Dice.rollModes;
  }>;
  "core.rtcClientSettings": typeof AVSettings.DEFAULT_CLIENT_SETTINGS;
  "core.rtcWorldSettings": typeof AVSettings.DEFAULT_WORLD_SETTINGS;
  "core.scrollingStatusText": fields.BooleanField<{ initial: true }>;
  "core.sheetClasses": {
    [Key in Document.Type as Document.SubTypesOf<Key> extends string ? Key : never]?: Record<
      Document.SubTypesOf<Key> & string,
      string
    >;
  };
  "core.time": fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
  "core.tokenDragPreview": boolean;
  "core.visionAnimation": boolean;
}
