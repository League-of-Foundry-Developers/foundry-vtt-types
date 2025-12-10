import type { DeepPartial, InterfaceToObject, MaybeEmpty } from "#utils";
import type { fields } from "../foundry/common/data/_module.d.mts";
import type Document from "../foundry/common/abstract/document.d.mts";
import type * as documents from "./documents.d.mts";

import AVSettings = foundry.av.AVSettings;
import Game = foundry.Game;

/**
 * Some global variables (such as {@linkcode game}) are only initialized after certain events have happened during the
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
 * declare module "fvtt-types/configuration" {
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
 * // index.ts
 * import { MyActor } from "./myActor"
 *
 * Hooks.once("init", () => {
 *   CONFIG.Actor.documentClass = typeof MyActor;
 * });
 *
 * declare module "fvtt-types/configuration" {
 *   interface DocumentClassConfig {
 *     Actor: typeof MyActor
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DocumentClassConfig {}

/**
 * Experimental: This config exists to stymy circularities.
 */
export interface DocumentInstanceConfig extends GetConfigured<_DocumentInstanceConfig> {}

interface _DocumentInstanceConfig {
  ActiveEffect: documents.ConfiguredActiveEffect<ActiveEffect.SubType>;
  ActorDelta: documents.ConfiguredActorDelta<ActorDelta.SubType>;
  Actor: documents.ConfiguredActor<Actor.SubType>;
  Card: documents.ConfiguredCard<Card.SubType>;
  Cards: documents.ConfiguredCards<Cards.SubType>;
  ChatMessage: documents.ConfiguredChatMessage<ChatMessage.SubType>;
  Combat: documents.ConfiguredCombat<Combat.SubType>;
  Combatant: documents.ConfiguredCombatant<Combatant.SubType>;
  CombatantGroup: documents.ConfiguredCombatantGroup<CombatantGroup.SubType>;
  Folder: documents.ConfiguredFolder<Folder.SubType>;
  Item: documents.ConfiguredItem<Item.SubType>;
  JournalEntryPage: documents.ConfiguredJournalEntryPage<JournalEntryPage.SubType>;
  Macro: documents.ConfiguredMacro<Macro.SubType>;
  RegionBehavior: documents.ConfiguredRegionBehavior<RegionBehavior.SubType>;
  TableResult: documents.ConfiguredTableResult<TableResult.SubType>;
}

type GetConfigured<T> = {
  [K in keyof T as T[K] extends { document: unknown } ? K : never]: T[K] extends { document: infer Document }
    ? Document
    : never;
};

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
 * // index.ts
 * import { MyToken } from "./myToken"
 *
 * Hooks.once("init", () => {
 *   CONFIG.Token.objectClass = MyToken;
 * });
 *
 * declare module "fvtt-types/configuration" {
 *   interface PlaceableObjectClassConfig {
 *     Token: typeof MyToken;
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PlaceableObjectClassConfig {}

/**
 * This interface together with {@linkcode SourceConfig} is used to configure the
 * types of the `data`  and `data._source` properties of the
 * {@linkcode foundry.documents.BaseActor} and {@linkcode foundry.documents.BaseItem}
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
 * declare module "fvtt-types/configuration" {
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
 * if (item.data.type === "weapon") {
 *   const damage: number = item.data.data.damage;
 * }
 *
 * if (item.data._source.type === "armor") {
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

/** @see {@linkcode DataConfig} */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SourceConfig {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FlagConfig {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WebRTCConfig {}

/**
 * Injects extra data for modules from `game.modules.get("module-id")`.
 * @see {@linkcode RequiredModules} for removing the `undefined` type for required modules.
 * @example
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
 * @see {@linkcode ModuleConfig} for adding useful properties to the returned modules, like APIs.
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
  "core.animateRollTable": fields.BooleanField<{ initial: true }>;
  "core.chatBubbles": fields.BooleanField<{ initial: true }>;
  "core.chatBubblesPan": fields.BooleanField<{ initial: true }>;

  /** Registered with `type: Object`. */
  "core.collectionSortingModes": Record<string, foundry.documents.abstract.DirectoryCollectionMixin.SortingMode>;

  /** Registered with `type: Object`. */
  "core.collectionSearchModes": Record<string, CONST.DIRECTORY_SEARCH_MODES>;
  "core.combatTrackerConfig": fields.SchemaField<foundry.data.CombatConfiguration.ConfigSettingSchema>;
  "core.compendiumConfiguration": foundry.documents.collections.CompendiumCollection.SettingField;
  "core.gridTemplates": fields.BooleanField<{ initial: false }>;
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
  "core.diceConfiguration": {
    [K in CONFIG.Dice.DTermDiceStrings]?: string | undefined;
  };
  "core.disableResolutionScaling": boolean;
  "core.fontSize": number;
  "core.fpsMeter": boolean;
  "core.globalAmbientVolume": fields.AlphaField<{ required: true; initial: 0.5 }>;
  "core.globalInterfaceVolume": fields.AlphaField<{ required: true; initial: 0.5 }>;
  "core.globalPlaylistVolume": fields.AlphaField<{ required: true; initial: 0.5 }>;
  "core.keybindings": Record<string, foundry.helpers.interaction.ClientKeybindings.KeybindingActionBinding[]>;
  "core.language": fields.StringField<{
    required: true;
    blank: false;
    initial: NonNullable<typeof game.i18n>["lang"];
    choices: typeof CONFIG.supportedLanguages;
  }>;
  "core.leftClickRelease": fields.BooleanField<{ initial: true }>;
  "core.lightAnimation": boolean;
  "core.maxFPS": fields.NumberField<{ required: true; min: 10; max: 60; step: 10; initial: 60 }>;
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
      // Note: these keys correspond to values of `CANVAS_PERFORMANCE_MODES`. They are not used
      // directly because the values are branded.
      0: "SETTINGS.PerformanceModeLow";
      1: "SETTINGS.PerformanceModeMed";
      2: "SETTINGS.PerformanceModeHigh";
      3: "SETTINGS.PerformanceModeMax";
    };
  }>;
  "core.permissions": Game.Permissions;
  "core.pixelRatioResolutionScaling": fields.BooleanField<{ initial: true }>;
  "core.playlist.playingLocation": "top" | "bottom";

  /**
   * @remarks `choices` is a type with the index signature of {@linkcode CONFIG.Dice.rollModes} removed.
   * If you want to use a custom `rollMode`, you must register it in `CONFIG`.
   */
  "core.rollMode": fields.StringField<
    {
      required: true;
      blank: false;
      initial: typeof CONST.DICE_ROLL_MODES.PUBLIC;
      choices: InterfaceToObject<typeof CONFIG.Dice.rollModes>;
    },
    // Note(LukeAbby): This override is necessary because the `initial` wasn't removing `null`.
    foundry.dice.Roll.Mode | null | undefined,
    foundry.dice.Roll.Mode,
    foundry.dice.Roll.Mode
  >;
  "core.rtcClientSettings": typeof AVSettings.schemaFields.client;
  "core.rtcWorldSettings": typeof AVSettings.schemaFields.world;
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

/**
 * Allows you to control the name of your system. Useful for typing things like `game.system.id`
 * @example
 * ```typescript
 * declare module "fvtt-types/configuration" {
 *   interface SystemNameConfig {
 *     name: "lancer";
 *   }
 * }
 *
 * const systemName = game.system.id;
 * //    ^? "lancer"
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SystemNameConfig {}

/**
 * Controls various behaviors of `system`. By default fvtt-types forces you to account for all
 * possible subtypes of a document. This helps make your code more robust for things like the
 * arbitrary module subtypes that may exist. This is why if you try writing `item.system.someProp`
 * you are going to get an error like:
 * ```text
 * Property 'someProp' does not exist on type 'SystemOfType<...>'.
 *   Property 'someProp' does not exist on type 'UnknownTypeDataModel'.
 * ```
 *
 * While inconvenient this is necessary for soundness. As a module subtype is designed to be
 * completely arbitrary they could have a conflicting property with any shape. Therefore it's
 * recommended to work around this with helpers that make it easier to actually account for module
 * subtypes like an `isKnown` helper etc. but if you want to tweak the behavior for certain classes
 * you can add `discriminate: "all"` which will make `item.system.someProp` be typed as
 * `T | undefined`.
 *
 * Even more unsoundly, you can entirely ignore the existence of module subtypes and `"base"`
 * entirely with `moduleSubtype: "ignore"` and `base: "ignore"`.
 *
 * @example
 * ```typescript
 * declare module "fvtt-types/configuration" {
 *   interface SystemConfig {
 *     Item: {
 *       discriminate: "all";
 *     };
 *     Actor: {
 *        moduleSubtype: "ignore";
 *        base: "ignore";
 *     };
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SystemConfig {}
