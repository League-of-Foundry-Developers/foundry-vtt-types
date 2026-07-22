import type {
  Brand,
  ConcreteKeys,
  GetKey,
  HandleEmptyObject,
  InexactPartial,
  InitializedOn,
  IntentionalPartial,
  InterfaceToObject,
  MaybeArray,
  MaybePromise,
  PartialUntilInitialized,
  RemoveIndexSignatures,
  ToMethod,
} from "#utils";
import type { Document } from "#common/abstract/_module.d.mts";
import type { BaseLightSource, RenderedEffectSource } from "#client/canvas/sources/_module.d.mts";
import type { geometry, perception, layers, groups } from "#client/canvas/_module.d.mts";
import type { DoorMesh } from "#client/canvas/containers/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { DocumentSheetConfig } from "#client/applications/apps/_module.d.mts";
import type { collections } from "#client/documents/_module.d.mts";
import type {
  AdaptiveColorationShader,
  AdaptiveDarknessShader,
  AdaptiveIlluminationShader,
} from "#client/canvas/rendering/shaders/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type Localization from "#client/helpers/localization.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type * as configuration from "#configuration";

/** Configure debugging flags to display additional information */
export declare const debug: CONFIG.Debug;

/**
 * Configure the verbosity of compatibility warnings generated throughout the software.
 * The compatibility mode defines the logging level of any displayed warnings.
 * The includePatterns and excludePatterns arrays provide a set of regular expressions which can either only
 * include or specifically exclude certain file paths or warning messages.
 * Exclusion rules take precedence over inclusion rules.
 *
 * @see {@linkcode CONST.COMPATIBILITY_MODES}
 *
 * @example
 * Include Specific Errors
 * ```js
 * const includeRgx = new RegExp("/systems/dnd5e/module/documents/active-effect.mjs");
 * CONFIG.compatibility.includePatterns.push(includeRgx);
 * ```
 *
 * @example
 * Exclude Specific Errors
 * ```js
 * const excludeRgx = new RegExp("/systems/dnd5e/");
 * CONFIG.compatibility.excludePatterns.push(excludeRgx);
 * ```
 *
 * @example
 * Both Include and Exclude
 * ```js
 * const includeRgx = new RegExp("/systems/dnd5e/module/actor/");
 * const excludeRgx = new RegExp("/systems/dnd5e/module/actor/sheets/base.js");
 * CONFIG.compatibility.includePatterns.push(includeRgx);
 * CONFIG.compatibility.excludePatterns.push(excludeRgx);
 * ```
 *
 * @example
 * Targeting more than filenames
 * ```js
 * const includeRgx = new RegExp("applyActiveEffects");
 * CONFIG.compatibility.includePatterns.push(includeRgx);
 * ```
 */
export declare const compatibility: CONFIG.Compatibility;

export declare const compendium: CONFIG.Compendium;

/**
 * Configure the DatabaseBackend used to perform Document operations
 * @defaultValue `new `{@linkcode foundry.data.ClientDatabaseBackend}`()`
 */
export declare let DatabaseBackend: foundry.data.ClientDatabaseBackend;

/**
 * Configuration for the {@linkcode foundry.documents.Actor | Actor} document
 */
export declare const Actor: CONFIG.Actor;

/**
 * Configuration for the {@linkcode foundry.documents.Adventure | Adventure} document
 */
export declare const Adventure: CONFIG.Adventure;

/**
 * Configuration for the {@linkcode foundry.documents.Cards | Cards} document
 */
export declare const Cards: CONFIG.Cards;

/**
 * Configuration for the {@linkcode foundry.documents.ChatMessage | ChatMessage} document
 */
export declare const ChatMessage: CONFIG.ChatMessage;

/**
 * Configuration for the {@linkcode foundry.documents.Combat | Combat} document
 */
export declare const Combat: CONFIG.Combat;

/**
 * Configuration for dice rolling behaviors in the Foundry Virtual Tabletop client
 */
export declare const Dice: CONFIG.Dice;

/**
 * Configuration for the {@linkcode foundry.documents.FogExploration | FogExploration} document
 */
export declare const FogExploration: CONFIG.FogExploration;

/**
 * Configuration for the {@linkcode foundry.documents.FogExploration | FogExploration} document
 */
export declare const Folder: CONFIG.Folder;

/**
 * Configuration for the {@linkcode foundry.documents.Item | Item} document
 */
export declare const Item: CONFIG.Item;

/**
 * Configuration for the {@linkcode foundry.documents.JournalEntry | JournalEntry} document
 */
export declare const JournalEntry: CONFIG.JournalEntry;

/**
 * Configuration for the {@linkcode foundry.documents.Macro | Macro} document
 */
export declare const Macro: CONFIG.Macro;

/**
 * Configuration for the {@linkcode foundry.documents.Playlist | Playlist} document
 */
export declare const Playlist: CONFIG.Playlist;

/**
 * Configuration for the {@linkcode foundry.documents.RollTable | RollTable} document
 */
export declare const RollTable: CONFIG.RollTable;

/**
 * Configuration for the {@linkcode foundry.documents.Scene | Scene} document
 */
export declare const Scene: CONFIG.Scene;

/**
 * Configuration for the {@linkcode foundry.documents.Setting | Setting} document
 */
export declare const Setting: CONFIG.Setting;

/**
 * Configuration for the {@linkcode foundry.documents.User | User} document
 */
export declare const User: CONFIG.User;

/**
 * Configuration settings for the Canvas and its contained layers and objects
 */
export declare const Canvas: CONFIG.Canvas;

/**
 * Configure the default Token text style so that it may be reused and overridden by modules
 * @defaultValue
 * ```ts
 * new PIXI.TextStyle({
 *   fontFamily: "Signika",
 *   fontSize: 36,
 *   fill: "#FFFFFF",
 *   stroke: "#111111",
 *   strokeThickness: 1,
 *   dropShadow: true,
 *   dropShadowColor: "#000000",
 *   dropShadowBlur: 2,
 *   dropShadowAngle: 0,
 *   dropShadowDistance: 0,
 *   align: "center",
 *   wordWrap: false,
 *   padding: 1
 * })
 * ```
 */
export declare let canvasTextStyle: PIXI.TextStyle;

/**
 * Available Weather Effects implementations
 */
export declare const weatherEffects: RemoveIndexSignatures<CONFIG.WeatherEffects>;

/**
 * The control icons used for rendering common HUD operations
 */
export declare const controlIcons: RemoveIndexSignatures<CONFIG.ControlIcons>;

/**
 * A collection of fonts to load either from the user's local system, or remotely.
 */
export declare const fontDefinitions: RemoveIndexSignatures<CONFIG.FontDefinitions>;

/**
 * The default font family used for text labels on the PIXI Canvas
 * @defaultValue `"Signika"`
 */
export declare let defaultFontFamily: ConcreteKeys<typeof CONFIG.fontDefinitions>;

/**
 * The array of status effects which can be applied to an Actor.
 * @defaultValue
 * ```js
 * [
 *   {
 *     id: "dead",
 *     name: "EFFECT.StatusDead",
 *     img: "icons/svg/skull.svg"
 *   },
 *   {
 *     id: "unconscious",
 *     name: "EFFECT.StatusUnconscious",
 *     img: "icons/svg/unconscious.svg"
 *   },
 *   {
 *     id: "sleep",
 *     name: "EFFECT.StatusAsleep",
 *     img: "icons/svg/sleep.svg"
 *   },
 *   {
 *     id: "stun",
 *     name: "EFFECT.StatusStunned",
 *     img: "icons/svg/daze.svg"
 *   },
 *   {
 *     id: "prone",
 *     name: "EFFECT.StatusProne",
 *     img: "icons/svg/falling.svg"
 *   },
 *   {
 *     id: "restrain",
 *     name: "EFFECT.StatusRestrained",
 *     img: "icons/svg/net.svg"
 *   },
 *   {
 *     id: "paralysis",
 *     name: "EFFECT.StatusParalysis",
 *     img: "icons/svg/paralysis.svg"
 *   },
 *   {
 *     id: "fly",
 *     name: "EFFECT.StatusFlying",
 *     img: "icons/svg/wing.svg"
 *   },
 *   {
 *     id: "blind",
 *     name: "EFFECT.StatusBlind",
 *     img: "icons/svg/blind.svg"
 *   },
 *   {
 *     id: "deaf",
 *     name: "EFFECT.StatusDeaf",
 *     img: "icons/svg/deaf.svg"
 *   },
 *   {
 *     id: "silence",
 *     name: "EFFECT.StatusSilenced",
 *     img: "icons/svg/silenced.svg"
 *   },
 *   {
 *     id: "fear",
 *     name: "EFFECT.StatusFear",
 *     img: "icons/svg/terror.svg"
 *   },
 *   {
 *     id: "burning",
 *     name: "EFFECT.StatusBurning",
 *     img: "icons/svg/fire.svg"
 *   },
 *   {
 *     id: "frozen",
 *     name: "EFFECT.StatusFrozen",
 *     img: "icons/svg/frozen.svg"
 *   },
 *   {
 *     id: "shock",
 *     name: "EFFECT.StatusShocked",
 *     img: "icons/svg/lightning.svg"
 *   },
 *   {
 *     id: "corrode",
 *     name: "EFFECT.StatusCorrode",
 *     img: "icons/svg/acid.svg"
 *   },
 *   {
 *     id: "bleeding",
 *     name: "EFFECT.StatusBleeding",
 *     img: "icons/svg/blood.svg"
 *   },
 *   {
 *     id: "disease",
 *     name: "EFFECT.StatusDisease",
 *     img: "icons/svg/biohazard.svg"
 *   },
 *   {
 *     id: "poison",
 *     name: "EFFECT.StatusPoison",
 *     img: "icons/svg/poison.svg"
 *   },
 *   {
 *     id: "curse",
 *     name: "EFFECT.StatusCursed",
 *     img: "icons/svg/sun.svg"
 *   },
 *   {
 *     id: "regen",
 *     name: "EFFECT.StatusRegen",
 *     img: "icons/svg/regen.svg"
 *   },
 *   {
 *     id: "degen",
 *     name: "EFFECT.StatusDegen",
 *     img: "icons/svg/degen.svg"
 *   },
 *   {
 *     id: "hover",
 *     name: "EFFECT.StatusHover",
 *     img: "icons/svg/wingfoot.svg"
 *   },
 *   {
 *     id: "burrow",
 *     name: "EFFECT.StatusBurrow",
 *     img: "icons/svg/mole.svg"
 *   },
 *   {
 *     id: "upgrade",
 *     name: "EFFECT.StatusUpgrade",
 *     img: "icons/svg/upgrade.svg"
 *   },
 *   {
 *     id: "downgrade",
 *     name: "EFFECT.StatusDowngrade",
 *     img: "icons/svg/downgrade.svg"
 *   },
 *   {
 *     id: "invisible",
 *     name: "EFFECT.StatusInvisible",
 *     img: "icons/svg/invisible.svg"
 *   },
 *   {
 *     id: "target",
 *     name: "EFFECT.StatusTarget",
 *     img: "icons/svg/target.svg"
 *   },
 *   {
 *     id: "eye",
 *     name: "EFFECT.StatusMarked",
 *     img: "icons/svg/eye.svg"
 *   },
 *   {
 *     id: "bless",
 *     name: "EFFECT.StatusBlessed",
 *     img: "icons/svg/angel.svg"
 *   },
 *   {
 *     id: "fireShield",
 *     name: "EFFECT.StatusFireShield",
 *     img: "icons/svg/fire-shield.svg"
 *   },
 *   {
 *     id: "coldShield",
 *     name: "EFFECT.StatusIceShield",
 *     img: "icons/svg/ice-shield.svg"
 *   },
 *   {
 *     id: "magicShield",
 *     name: "EFFECT.StatusMagicShield",
 *     img: "icons/svg/mage-shield.svg"
 *   },
 *   {
 *     id: "holyShield",
 *     name: "EFFECT.StatusHolyShield",
 *     img: "icons/svg/holy-shield.svg"
 *   }
 * ]
 * ```
 */
export declare const statusEffects: CONFIG.StatusEffect[];

/**
 * A mapping of status effect IDs which provide some additional mechanical integration.
 * @remarks See {@linkcode CONFIG.DefaultSpecialStatusEffects} for defaults.
 */
export declare const specialStatusEffects: HandleEmptyObject<
  RemoveIndexSignatures<CONFIG.SpecialStatusEffects>,
  RemoveIndexSignatures<CONFIG.DefaultSpecialStatusEffects>
>;

/**
 * A mapping of core audio effects used which can be replaced by systems or mods
 */
export declare const sounds: RemoveIndexSignatures<CONFIG.Sounds>;

/**
 * Define the set of supported languages for localization
 */
export declare const supportedLanguages: RemoveIndexSignatures<CONFIG.SupportedLanguages>;

/**
 * Localization constants.
 */
export declare const i18n: CONFIG.Internationalization;

/**
 * Configuration for time tracking
 */
export declare const time: CONFIG.Time;

/**
 * Configuration for the {@linkcode foundry.documents.ActiveEffect | ActiveEffect} embedded document type
 */
export declare const ActiveEffect: CONFIG.ActiveEffect;

/**
 * Configuration for the {@linkcode foundry.documents.ActorDelta | ActorDelta} embedded document type.
 */
export declare const ActorDelta: CONFIG.ActorDelta;

/**
 * Configuration for the {@linkcode foundry.documents.Card | Card} embedded document type
 */
export declare const Card: CONFIG.Card;

/**
 * Configuration for the {@linkcode foundry.documents.TableResult | TableResult} embedded document type
 */
export declare const TableResult: CONFIG.TableResult;

/**
 * Configuration for the {@linkcode foundry.documents.JournalEntryPage | JournalEntryPage} embedded document type.
 */
export declare const JournalEntryPage: CONFIG.JournalEntryPage;

/**
 * Configuration for the {@linkcode foundry.documents.PlaylistSound | PlaylistSound} embedded document type
 */
export declare const PlaylistSound: CONFIG.PlaylistSound;

/**
 * Configuration for the {@linkcode foundry.documents.AmbientLight | AmbientLight} embedded document
 * type and its representation on the game Canvas
 */
export declare const AmbientLight: CONFIG.AmbientLight;

/**
 * Configuration for the {@linkcode foundry.documents.AmbientSound | AmbientSound} embedded document
 * type and its representation on the game Canvas
 */
export declare const AmbientSound: CONFIG.AmbientSound;

/**
 * Configuration for the {@linkcode foundry.documents.Combatant | Combatant} embedded document type
 * within a {@linkcode foundry.documents.Combat | Combat} document
 */
export declare const Combatant: CONFIG.Combatant;

/**
 * Configuration for the {@linkcode foundry.documents.CombatantGroup | CombatantGroup}
 * embedded document type within a {@linkcode foundry.documents.Combat | Combat} document.
 */
export declare const CombatantGroup: CONFIG.CombatantGroup;

/**
 * Configuration for the {@linkcode foundry.documents.Drawing | Drawing} embedded document type and its representation on the game Canvas
 */
export declare const Drawing: CONFIG.Drawing;

/**
 * Configuration for the {@linkcode foundry.documents.JournalEntryCategory | JournalEntryCategory} embedded document type.
 */
export declare const JournalEntryCategory: CONFIG.JournalEntryCategory;

/**
 * Configuration for the {@linkcode foundry.documents.MeasuredTemplate | MeasuredTemplate} embedded document type and its representation
 * on the game Canvas
 */
export declare const MeasuredTemplate: CONFIG.MeasuredTemplate;

/**
 * Configuration for the {@linkcode foundry.documents.Note | Note} embedded document type and its representation on the game Canvas
 */
export declare const Note: CONFIG.Note;

/**
 * Configuration for the {@linkcode foundry.documents.Region | Region} embedded document type and its representation on the game Canvas
 */
export declare const Region: CONFIG.Region;

/**
 * Configuration for the {@linkcode foundry.documents.RegionBehavior | RegionBehavior} embedded document type
 */
export declare const RegionBehavior: CONFIG.RegionBehavior;

/**
 * Configuration for the {@linkcode foundry.documents.Tile | Tile} embedded document type and its representation on the game Canvas
 */
export declare const Tile: CONFIG.Tile;

/**
 * Configuration for the {@linkcode foundry.documents.Token | Token} embedded document type and its representation on the game Canvas
 */
export declare const Token: CONFIG.Token;

/**
 * Configuration for the {@linkcode foundry.documents.Wall | Wall} embedded document type and its representation on the game Canvas
 */
export declare const Wall: CONFIG.Wall;

/**
 * An enumeration of sound effects which can be applied to Sound instances.
 */
export declare const soundEffects: RemoveIndexSignatures<CONFIG.SoundEffects>;

/**
 * Rich text editing configuration.
 */
export declare const TextEditor: CONFIG.TextEditor;

/**
 * Configuration for the WebRTC implementation class
 */
export declare const WebRTC: CONFIG.WebRTC;

/**
 * Configure the Application classes used to render various core UI elements in the application
 */
export declare const ui: RemoveIndexSignatures<CONFIG.UI>;

/**
 * Overrides for various core UI/UX helpers.
 */
export declare const ux: CONFIG.UX;

/**
 * System and modules must prefix the names of the queries they register (e.g. "my-module.aCustomQuery").
 * Non-prefixed query names are reserved by core.
 */
export declare const queries: RemoveIndexSignatures<CONFIG.Queries>;

/**
 * Configure custom cursor images to use when interacting with the application.
 *
 * @example
 * Configuring a cursor with a hotspot in the default top-left.
 * ```js
 * Object.assign(CONFIG.cursors, {
 *   default: "icons/cursors/default.avif",
 *   "default-down": "icons/cursors/default-down.avif"
 * });
 * ```
 *
 * @example
 * Configuring a cursor with a hotspot in the center.
 * ```js
 * Object.assign(CONFIG.cursors, {
 *   default: { url: "icons/cursors/target.avif", x: 16, y: 16 },
 *   "default-down": { url: "icons/cursors/target-down.avif", x: 16, y: 16 }
 * });
 * ```
 */
export declare const cursors: CONFIG.Cursors;

/**
 * Configuration for the {@linkcode foundry.applications.apps.FormulaEditor} application.
 */
export declare const formulaEditor: CONFIG.FormulaEditor;

declare global {
  namespace CONFIG {
    interface Debug {
      /** @defaultValue `false` */
      applications: boolean;

      /** @defaultValue `false` */
      audio: boolean;

      /** @defaultValue `false` */
      combat: boolean;

      /** @defaultValue `false` */
      dice: boolean;

      /** @defaultValue `false` */
      documents: boolean;

      fog: Debug.Fog;

      /** @defaultValue `false` */
      hooks: boolean;

      /** @defaultValue `false` */
      av: boolean;

      /** @defaultValue `false` */
      avclient: boolean;

      /** @defaultValue `false` */
      i18n: boolean;

      /** @defaultValue `false` */
      mouseInteraction: boolean;

      /** @defaultValue `false` */
      time: boolean;

      /** @defaultValue `false` */
      keybindings: boolean;

      /** @defaultValue `false` */
      polygons: boolean;

      /** @defaultValue `false` */
      gamepad: boolean;

      canvas: Debug.Canvas;

      /** @defaultValue `false` */
      queries: boolean;

      /** @defaultValue `false` */
      rollParsing: boolean;

      loader: Debug.Loader;
    }

    namespace Debug {
      interface Fog {
        /** @defaultValue `false` */
        extractor: boolean;

        /** @defaultValue `false` */
        manager: boolean;
      }

      interface Canvas {
        primary: Canvas.Primary;
      }

      namespace Canvas {
        interface Primary {
          /** @defaultValue `false` */
          bounds: boolean;
        }
      }

      interface Loader {
        /** @defaultValue `false` */
        load: boolean;

        /** @defaultValue `false` */
        cache: boolean;

        /** @defaultValue `false` */
        eviction: boolean;

        /** @defaultValue `false` */
        memory: boolean;
      }
    }

    interface Compatibility {
      /** @defaultValue {@linkcode CONST.COMPATIBILITY_MODES.WARNING} */
      mode: CONST.COMPATIBILITY_MODES;

      /** @defaultValue `[]` */
      includePatterns: RegExp[];

      /** @defaultValue `[]` */
      excludePatterns: RegExp[];
    }

    interface Compendium {
      /**
       * Configure a table of compendium UUID redirects. Must be configured before the game *ready* hook is fired.
       *
       * @example
       * Re-map individual UUIDs
       * ```js
       * const newUuid = "Compendium.system.villains.Actor.DKYLeIliXXzlAZ2G";
       * CONFIG.compendium.uuidRedirects["Compendium.system.heroes.Actor.Tf0JDPzHOrIxz6BH"] = newUuid;
       * ```
       *
       * @example
       * Redirect UUIDs from one compendium to another.
       * ```js
       * CONFIG.compendium.uuidRedirects["Compendium.system.heroes"] = "Compendium.system.villains";
       * ```
       */
      uuidRedirects: Record<string, string>;
    }

    type SheetClasses<Name extends Document.Type> = InitializedOn<
      _SheetClasses<Name>,
      "ready",
      IntentionalPartial<_SheetClasses<Name>>
    >;

    /** @internal */
    type _SheetClasses<Name extends Document.Type> = Record<
      Document.SubTypesOf<Name>,
      Record<string, DocumentSheetConfig.SheetRegistrationDescriptor<Document.ImplementationClassFor<Name>>>
    >;

    /**
     * Common properties of all document interfaces in `CONFIG`. Doesn't include `typeLabels`, because while all docs will have it defined,
     * the (TS) types are different for docs that don't really have (foundry) types, which requires different JSDoc.
     * @internal
     */
    interface _Document<Name extends Document.Type> {
      documentClass: Document.ImplementationClassFor<Name>;

      /**
       * @remarks Added by {@linkcode foundry.applications.sheets._registerDefaultSheets} in {@linkcode foundry.Game | Game#constructor} as
       * an empty object, filled in by {@linkcode DocumentSheetConfig.initializeSheets} between `setup` and `ready`.
       */
      sheetClasses: CONFIG.SheetClasses<Name>;
    }

    /**
     * Common properties for the 11 (as of 14.365) Documents with a {@linkcode foundry.data.TypeDataField}. In addition to having
     * `dataModels` and `typeIcons` fields, their `typeLabels` are defined in their `CONFIG` entry immediately,
     * rather than being added later.
     * @internal
     */
    interface _HasTypes<Name extends Document.WithSystem> {
      /**
       * @remarks In FVTT-Types, this just mirrors {@linkcode configuration.DataModelConfig | DataModelConfig}, which is where
       * you must currently define your subtypes, in addition to setting this property at runtime.
       */
      dataModels: Document.TypeModelsFor<Name>;

      /**
       * @defaultValue `{}`
       * @remarks Is empty prior to {@linkcode Localization.initialize | Localization#initialize} being called just before `i18nInit`,
       * after which at least one entry per document is guaranteed.
       */
      typeLabels: PartialUntilInitialized<Record<Document.SubTypesOf<Name>, string>, "i18nInit">;

      /**
       * @defaultValue `{}`
       * @remarks Used by {@linkcode foundry.documents.abstract.ClientDocumentMixin.AnyMixed.toAnchor | ClientDocument#toAnchor}
       * and the `RollTable`, `Region`, and `RegionBehavior` sheets in core. Unlike `typeLabels`, nothing comes along and fills this in for
       * all subtypes; only `Cards`, `JournalEntryPage`, and `RegionBehavior` have any pre-defined as of 13.351.
       */
      typeIcons: IntentionalPartial<Record<Document.SubTypesOf<Name>, string>>;
    }

    /**
     * A definition of `typeLabels` for the majority of Documents' `CONFIG` entries that do not have it defined prior to `i18nInit`
     * @internal
     */
    interface _HasNoTypes<Name extends Document.Type> {
      /**
       * @remarks Not defined in `config.mjs`, this is added by {@linkcode Localization.initialize | Localization#initialize} just before
       * the `i18nInit` hook.
       */
      typeLabels: InitializedOn<Record<Document.SubTypesOf<Name>, string>, "i18nInit">;
    }

    /**
     * Common properties for Canvas document `CONFIG` entries.
     * @internal
     */
    interface _CanvasDoc<Name extends Document.PlaceableType> {
      objectClass: foundry.canvas.placeables.PlaceableObject.ImplementationClassFor<Name>;

      /**
       * @deprecated This is vestigial in foundry, and is not used for anything since at least v11. The layer for a given Canvas Document
       * can be set at `CONFIG.Canvas.layers[canvas.getLayerByEmbeddedName(documentName).constructor.layerOptions.name].layerClass`. Formal
       * deprecation starts in v14:
       *
       * "`CONFIG.${documentName}.layerClass` has been deprecated. Use `CONFIG.Canvas.layers.${layerName}.layerClass` instead."
       * (since v14, until v16)
       *
       * @remarks Yes, that lookup above is the simplest way to find the correct `CONFIG.Canvas.layers` property for a given document type
       * without having to read the source for {@linkcode foundry.canvas.Canvas.getLayerByEmbeddedName | Canvas#getLayerByEmbeddedName}.
       */
      layerClass: foundry.canvas.layers.PlaceablesLayer.ImplementationClassFor<Name>;
    }

    interface Actor extends _Document<"Actor">, _HasTypes<"Actor"> {
      /**
       * @defaultValue {@linkcode collections.Actors}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.Actors;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/actor-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-user"` */
      sidebarIcon: string;

      /** @defaultValue `{}` */
      trackableAttributes: Actor.TrackableAttribute;
    }

    namespace Actor {
      interface TrackableAttribute {
        bar: string[];
        value: string[];
      }
    }

    /** @deprecated Use {@linkcode CONFIG.Actor.TrackableAttribute} instead. This warning will be removed in v14. */
    type TrackableAttribute = Actor.TrackableAttribute;

    interface Adventure extends _Document<"Adventure">, _HasNoTypes<"Adventure"> {
      /**
       * @defaultValue {@linkcode foundry.applications.sheets.AdventureExporter}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.applications.sidebar.apps.Compendium}.
       */
      exporterClass: typeof foundry.applications.sheets.AdventureExporter;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/adventure-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-treasure-chest"` */
      sidebarIcon: string;
    }

    interface Cards extends _Document<"Cards">, _HasTypes<"Cards"> {
      /**
       * @defaultValue {@linkcode collections.CardStacks}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.CardStacks;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/cards-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-cards"` */
      sidebarIcon: string;

      /**
       * @defaultValue
       * ```ts
       * {
       *    pokerDark: {
       *      type: "deck",
       *      label: "CARDS.DeckPresetPokerDark",
       *      src: "cards/poker-deck-dark.json"
       *    },
       *    pokerLight: {
       *      type: "deck",
       *      label: "CARDS.DeckPresetPokerLight",
       *      src: "cards/poker-deck-light.json"
       *    }
       * }
       * ```
       */
      presets: Record<string, Cards.Preset>;

      /**
       * @defaultValue
       * ```ts
       * {
       *   deck: "fa-solid fa-cards",
       *   hand: "fa-duotone fa-cards",
       *   pile: "fa-duotone fa-layer-group"
       * }
       * ```
       */
      typeIcons: _HasTypes<"Cards">["typeIcons"];
    }

    namespace Cards {
      interface Preset {
        type: string;
        label: string;
        src: string;
      }
    }

    interface ChatMessage extends _Document<"ChatMessage">, _HasTypes<"ChatMessage"> {
      /**
       * @defaultValue {@linkcode collections.ChatMessages}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.ChatMessages;

      /** @defaultValue `"templates/sidebar/chat-message.html"` */
      template: string;

      /** @defaultValue `"fa-solid fa-comments"` */
      sidebarIcon: string;

      /** @defaultValue `100` */
      batchSize: number;

      /**
       * Supported chat message visibility modes.
       * @defaultValue
       * ```js
       * {
       *   public: { label: "CHAT.MODES.public", icon: "fa-solid fa-globe" },
       *   gm: { label: "CHAT.MODES.gm", icon: "fa-solid fa-user-secret" },
       *   blind: { label: "CHAT.MODES.blind", icon: "fa-solid fa-eye-slash" },
       *   self: { label: "CHAT.MODES.self", icon: "fa-solid fa-user" },
       *   ic: { label: "CHAT.MODES.ic", icon: "fa-solid fa-hat-wizard" }
       * }
       * ```
       */
      modes: Record<string, ChatMessage.Mode>;
    }

    namespace ChatMessage {
      interface Mode {
        label: string;
        icon: string;
      }
    }

    interface Combat extends _Document<"Combat">, _HasTypes<"Combat"> {
      /**
       * @defaultValue {@linkcode collections.CombatEncounters}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.CombatEncounters;

      /**
       * @privateRemarks This gets `defineProperty`'d to `{ writable: false, configurable: false }` near the bottom of `config.mjs`
       */
      readonly settings: foundry.data.CombatConfiguration;

      sidebarIcon: string;

      initiativeIcon: Combat.InitiativeIcon;

      initiative: Combat.Initiative;

      /** @defaultValue "icons/vtt-512.png" */
      fallbackTurnMarker: string;

      /**
       * @defaultValue
       * ```ts
       * {
       *   epic: {
       *     label: "COMBAT.Sounds.Epic",
       *     startEncounter: ["sounds/combat/epic-start-3hit.ogg", "sounds/combat/epic-start-horn.ogg"],
       *     nextUp: ["sounds/combat/epic-next-horn.ogg"],
       *     yourTurn: ["sounds/combat/epic-turn-1hit.ogg", "sounds/combat/epic-turn-2hit.ogg"]
       *   },
       *   mc: {
       *     label: "COMBAT.Sounds.MC",
       *     startEncounter: [
       *       "sounds/combat/mc-start-battle.ogg",
       *       "sounds/combat/mc-start-begin.ogg",
       *       "sounds/combat/mc-start-fight.ogg",
       *       "sounds/combat/mc-start-fight2.ogg"
       *     ],
       *     nextUp: ["sounds/combat/mc-next-itwillbe.ogg", "sounds/combat/mc-next-makeready.ogg", "sounds/combat/mc-next-youare.ogg"],
       *     yourTurn: ["sounds/combat/mc-turn-itisyour.ogg", "sounds/combat/mc-turn-itsyour.ogg"]
       *   }
       * }
       * ```
       */
      sounds: RemoveIndexSignatures<Combat.Sounds>;
    }

    namespace Combat {
      interface InitiativeIcon {
        /** @defaultValue `../icons/svg/d20.svg` */
        icon: string;

        /** @defaultValue `../icons/svg/d20-highlight.svg` */
        hover: string;
      }

      interface Initiative {
        /** @defaultValue `null` */
        formula: string | null;

        /** @defaultValue `2` */
        decimals: number;
      }

      interface SoundPreset {
        label: string;
        startEncounter: string[];
        nextUp: string[];
        yourTurn: string[];
      }

      interface Sounds {
        [soundName: string]: SoundPreset;
        epic: SoundPreset;
        mc: SoundPreset;
      }
    }

    interface Dice {
      /** The Dice types which are supported. */
      types: (typeof foundry.dice.terms.DiceTerm)[];

      // Note(LukeAbby): `InterfaceToObject` is used to ensure that it's valid when used with `choices`.
      rollModes: InterfaceToObject<RemoveIndexSignatures<Dice.RollModes>>;

      /**
       * Configured Roll class definitions
       * @defaultValue `[`{@linkcode dice.Roll}`]`
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.dice.Roll.create | Roll.create}.
       */
      rolls: (typeof foundry.dice.Roll)[];

      /**
       * Configured DiceTerm class definitions
       */
      termTypes: RemoveIndexSignatures<Dice.TermTypes>;

      /** Configured roll terms and the classes they map to. */
      terms: Dice.Terms;

      /**
       * A function used to provide random uniform values.
       */
      randomUniform: () => number;

      /**
       * A parser implementation for parsing Roll expressions.
       * @defaultValue {@linkcode foundry.dice.RollParser}
       */
      parser: foundry.dice.RollParser.AnyConstructor;

      /** A collection of custom functions that can be included in roll expressions.*/
      functions: HandleEmptyObject<RemoveIndexSignatures<Dice.Functions>>;

      /**
       * Dice roll fulfillment configuration
       */
      fulfillment: Dice.Fulfillment;
    }

    namespace Dice {
      /** @deprecated Use {@linkcode foundry.dice.Roll.Mode} instead. This warning will be removed in v14. */
      type RollMode = foundry.dice.Roll.Mode;

      interface RollModes {
        [rollMode: Brand<string, "CONFIG.Dice.RollMode">]: RollModeConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "CHAT.RollPublic",
         *   icon: "fa-solid fa-globe"
         * }
         * ```
         */
        publicroll: RollModeConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "CHAT.RollPrivate",
         *   icon: "fa-solid fa-user-secret"
         * }
         * ```
         */
        gmroll: RollModeConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "CHAT.RollBlind",
         *   icon: "fa-solid fa-eye-slash"
         * }
         * ```
         */
        blindroll: RollModeConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "CHAT.RollSelf",
         *   icon: "fa-solid fa-user"
         * }
         * ```
         */
        selfroll: RollModeConfig;
      }

      interface RollModeConfig {
        /** @remarks A localization key */
        label: string;

        /** @remarks Just the class string, e.g `"fa-solid fa-globe"` */
        icon: string;
      }

      namespace RollModes {
        /**
         * @deprecated Roll mode descriptors no longer get their own interfaces, as all their keys only have primitive values.
         * This warning will be removed in v14.
         */
        type PublicRoll = never;

        /**
         * @deprecated Roll mode descriptors no longer get their own interfaces, as all their keys only have primitive values.
         * This warning will be removed in v14.
         */
        type GMRoll = never;

        /**
         * @deprecated Roll mode descriptors no longer get their own interfaces, as all their keys only have primitive values.
         * This warning will be removed in v14.
         */
        type BlindRoll = never;

        /**
         * @deprecated Roll mode descriptors no longer get their own interfaces, as all their keys only have primitive values.
         * This warning will be removed in v14.
         */
        type SelfRoll = never;
      }

      interface TermTypes {
        [termType: string]: foundry.dice.terms.RollTerm.AnyConstructor;
        DiceTerm: typeof foundry.dice.terms.DiceTerm;
        FunctionTerm: typeof foundry.dice.terms.FunctionTerm;
        NumericTerm: typeof foundry.dice.terms.NumericTerm;
        OperatorTerm: typeof foundry.dice.terms.OperatorTerm;
        ParentheticalTerm: typeof foundry.dice.terms.ParentheticalTerm;
        PoolTerm: typeof foundry.dice.terms.PoolTerm;
        StringTerm: typeof foundry.dice.terms.StringTerm;
      }

      interface Terms {
        [term: string]: typeof foundry.dice.terms.DiceTerm;
        c: typeof foundry.dice.terms.Coin;
        d: typeof foundry.dice.terms.Die;
        f: typeof foundry.dice.terms.FateDie;
      }

      type RollFunction = (...args: Array<string | number>) => MaybePromise<number | `${number}`>;

      interface Functions {
        [functionName: string]: RollFunction;
      }

      interface Fulfillment {
        /** The die denominations available for configuration. */
        dice: RemoveIndexSignatures<Fulfillment.Dice>;

        /** The methods available for fulfillment. */
        methods: RemoveIndexSignatures<Fulfillment.Methods>;

        /**
         * Designate one of the methods to be used by default for dice fulfillment, if the user hasn't specified otherwise.
         * Leave this blank to use the configured {@linkcode CONFIG.Dice.randomUniform} to generate die rolls.
         * @defaultValue `""`
         */
        defaultMethod: string;
      }

      namespace Fulfillment {
        interface Dice {
          [denomination: string]: DiceDenomination;

          /** @defaultValue `{ label: "d4", icon: '<i class="fa-solid fa-dice-d4"></i>' }` */
          d4: DiceDenomination;

          /** @defaultValue `{ label: "d6", icon: '<i class="fa-solid fa-dice-d6"></i>' }` */
          d6: DiceDenomination;

          /** @defaultValue `{ label: "d8", icon: '<i class="fa-solid fa-dice-d8"></i>' }` */
          d8: DiceDenomination;

          /** @defaultValue `{ label: "d10", icon: '<i class="fa-solid fa-dice-d10"></i>' }` */
          d10: DiceDenomination;

          /** @defaultValue `{ label: "d12", icon: '<i class="fa-solid fa-dice-d12"></i>' }` */
          d12: DiceDenomination;

          /** @defaultValue `{ label: "d20", icon: '<i class="fa-solid fa-dice-d20"></i>' }` */
          d20: DiceDenomination;

          /** @defaultValue `{ label: "d100", icon: '<i class="fa-solid fa-percent"></i>' }` */
          d100: DiceDenomination;
        }

        interface DiceDenomination {
          /** The human-readable label for the die. */
          label: string;

          /**
           * An icon to display on the configuration sheet.
           * @remarks Should be a full html string, e.g `'<i class="fa-solid fa-dice-d4"></i>'`.
           */
          icon: string;
        }

        interface Methods {
          [methodName: string]: Method;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "DICE.FULFILLMENT.Mersenne",
           *   interactive: false,
           *   handler: term => term.mapRandomFace(dice.MersenneTwister.random())
           * }
           * ```
           */
          mersenne: Method;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "DICE.FULFILLMENT.Manual",
           *   icon: '<i class="fa-solid fa-keyboard"></i>',
           *   interactive: true
           * }
           * ```
           */
          manual: Method;
        }

        /** @internal */
        interface _Method {
          /**
           * An icon to represent the fulfillment method.
           * @remarks Should be a full html string, e.g `'<i class="fa-solid fa-dice-d4"></i>'`.
           */
          icon: string;

          /**
           * Whether this method requires input from the user or if it is fulfilled entirely programmatically.
           * @defaultValue `false`
           */
          interactive: boolean;

          /** A function to invoke to programmatically fulfil a given term for non-interactive fulfillment methods. */
          handler: Handler;

          /**
           * A custom RollResolver implementation. If the only interactive methods the user has configured are this method and manual,
           * this resolver will be used to resolve interactive rolls, instead of the default resolver. This resolver must therefore be
           * capable of handling manual rolls.
           * @privateRemarks Instantiated by `new` in {@linkcode foundry.dice.Roll._evaluate | Roll#_evaluate}.
           */
          resolver: typeof foundry.applications.dice.RollResolver;
        }

        interface Method extends InexactPartial<_Method> {
          /** The human-readable label for the fulfillment method. */
          label: string;
        }

        /**
         * Only used for non-interactive fulfillment methods. If a die configured to use this fulfillment method is rolled,
         * this handler is called and awaited in order to produce the die roll result.
         * @param term    - The term being fulfilled.
         * @param options - Additional options to configure fulfillment.
         * @returns The fulfilled value, or undefined if it could not be fulfilled.
         * @remarks As of 13.351, the only place this gets called is in `DiceTerm##invokeFulfillmentHandler`, which gets called by
         * {@linkcode foundry.dice.terms.DiceTerm._roll | DiceTerm#_roll}, which will pass on the options from `DiceTerm#roll`, minus `maximize`
         * and `minimize`.
         */
        type Handler = (
          term: foundry.dice.terms.DiceTerm,
          // TODO: remove InexactPartial once DiceTerm is cleaned up in v14.
          options?: InexactPartial<foundry.dice.terms.DiceTerm.EvaluationOptions>,
        ) => MaybePromise<number | void>;
      }

      /** @deprecated Use {@linkcode CONFIG.Dice.Fulfillment} instead. This warning will be removed in v14. */
      type FulfillmentConfiguration = Fulfillment;

      /** @deprecated Use {@linkcode CONFIG.Dice.Fulfillment.DiceDenomination} instead. This warning will be removed in v14. */
      type FulfillmentDenomination = Fulfillment.DiceDenomination;

      /** @deprecated Use {@linkcode CONFIG.Dice.Fulfillment.Method} instead. This warning will be removed in v14. */
      type FulfillmentMethod = Fulfillment.Method;

      /** @deprecated Use {@linkcode CONFIG.Dice.Fulfillment.Handler} instead. This warning will be removed in v14. */
      type FulfillmentHandler = Fulfillment.Handler;

      /** @deprecated Use {@linkcode foundry.dice.Roll.CoreDenominations} instead. This warning will be removed in v14. */
      type DTermDiceStrings = foundry.dice.Roll.CoreDenominations;
    }

    interface FogExploration extends _Document<"FogExploration">, _HasNoTypes<"FogExploration"> {
      /**
       * @defaultValue {@linkcode collections.FogExplorations}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.FogExplorations;
    }

    interface Folder extends _Document<"Folder">, _HasNoTypes<"Folder"> {
      /**
       * @defaultValue {@linkcode collections.Folders}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.Folders;

      /** @defaultValue `"fa-solid fa-folder"` */
      sidebarIcon: string;
    }

    interface Item extends _Document<"Item">, _HasTypes<"Item"> {
      /**
       * @defaultValue {@linkcode collections.Items}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.Items;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/item-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-suitcase"` */
      sidebarIcon: string;
    }

    interface JournalEntry extends _Document<"JournalEntry">, _HasNoTypes<"JournalEntry"> {
      /**
       * @defaultValue {@linkcode collections.Journal}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.Journal;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/journalentry-banner.webp"` */
      compendiumBanner: string;

      noteIcons: RemoveIndexSignatures<JournalEntry.NoteIcons>;

      /** @defaultValue `"fa-solid fa-book-open"` */
      sidebarIcon: string;
    }

    namespace JournalEntry {
      interface NoteIcons {
        [iconName: string]: string;

        /** @defaultValue `"icons/svg/anchor.svg";` */
        Anchor: string;

        /** @defaultValue `"icons/svg/barrel.svg";` */
        Barrel: string;

        /** @defaultValue `"icons/svg/book.svg";` */
        Book: string;

        /** @defaultValue `"icons/svg/bridge.svg";` */
        Bridge: string;

        /** @defaultValue `"icons/svg/cave.svg";` */
        Cave: string;

        /** @defaultValue `"icons/svg/castle.svg";` */
        Castle: string;

        /** @defaultValue `"icons/svg/chest.svg";` */
        Chest: string;

        /** @defaultValue `"icons/svg/city.svg";` */
        City: string;

        /** @defaultValue `"icons/svg/coins.svg";` */
        Coins: string;

        /** @defaultValue `"icons/svg/fire.svg";` */
        Fire: string;

        /** @defaultValue `"icons/svg/hanging-sign.svg"` */
        "Hanging Sign": string;

        /** @defaultValue `"icons/svg/house.svg";` */
        House: string;

        /** @defaultValue `"icons/svg/mountain.svg";` */
        Mountain: string;

        /** @defaultValue `"icons/svg/oak.svg";` */
        "Oak Tree": string;

        /** @defaultValue `"icons/svg/obelisk.svg";` */
        Obelisk: string;

        /** @defaultValue `"icons/svg/pawprint.svg";` */
        Pawprint: string;

        /** @defaultValue `"icons/svg/ruins.svg";` */
        Ruins: string;

        /** @defaultValue `"icons/svg/skull.svg";` */
        Skull: string;

        /** @defaultValue `"icons/svg/statue.svg";` */
        Statue: string;

        /** @defaultValue `"icons/svg/sword.svg";` */
        Sword: string;

        /** @defaultValue `"icons/svg/tankard.svg";` */
        Tankard: string;

        /** @defaultValue `"icons/svg/temple.svg";` */
        Temple: string;

        /** @defaultValue `"icons/svg/tower.svg";` */
        Tower: string;

        /** @defaultValue `"icons/svg/trap.svg";` */
        Trap: string;

        /** @defaultValue `"icons/svg/village.svg";` */
        Village: string;

        /** @defaultValue `"icons/svg/waterfall.svg";` */
        Waterfall: string;

        /** @defaultValue `"icons/svg/windmill.svg";` */
        Windmill: string;
      }
    }

    interface Macro extends _Document<"Macro">, _HasNoTypes<"Macro"> {
      /**
       * @defaultValue {@linkcode collections.Macros}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.Macros;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/macro-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-code"` */
      sidebarIcon: string;
    }

    interface Playlist extends _Document<"Playlist">, _HasNoTypes<"Playlist"> {
      /**
       * @defaultValue {@linkcode collections.Playlists}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.Playlists;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/playlist-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-music"` */
      sidebarIcon: string;

      /** @remarks The number of seconds prior to the end of the current track to start preloading the next one. */
      autoPreloadSeconds: number;
    }

    interface RollTable extends _Document<"RollTable">, _HasNoTypes<"RollTable"> {
      /**
       * @defaultValue {@linkcode collections.RollTables}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.RollTables;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/rolltable-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-table-list"` */
      sidebarIcon: string;

      /** @defaultValue `"icons/svg/d20-black.svg"` */
      resultIcon: string;

      /** @defaultValue `"templates/dice/table-result.hbs"` */
      resultTemplate: string;
    }

    interface Scene extends _Document<"Scene">, _HasNoTypes<"Scene"> {
      /**
       * @defaultValue {@linkcode collections.Scenes}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.Scenes;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/scene-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-table-map"` */
      sidebarIcon: string;
    }

    interface Setting extends _Document<"Setting">, _HasNoTypes<"Setting"> {
      /**
       * @defaultValue {@linkcode collections.WorldSettings}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.WorldSettings;
    }

    interface User extends _Document<"User">, _HasNoTypes<"User"> {
      /**
       * @defaultValue {@linkcode collections.Users}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initializeDocuments | Game#initializeDocuments}.
       */
      collection: typeof collections.Users;
    }

    /**
     * Everything in this interface gets instantiated into {@linkcode globalThis.ui} via `new` in
     * {@linkcode foundry.Game.setupGame | Game#setupGame} between `setup` and `ready`.
     *
     * Most things provided here by core are AppV2 classes, with the exception of `notifications`,
     * but anything that can be `new`ed with no arguments can be put here.
     */
    interface UI {
      [appName: string]: new () => unknown;

      /** @defaultValue {@linkcode foundry.applications.ui.MainMenu} */
      menu: typeof foundry.applications.ui.MainMenu<foundry.applications.ui.MainMenu.RenderContext>;

      /** @defaultValue {@linkcode foundry.applications.sidebar.Sidebar} */
      sidebar: typeof foundry.applications.sidebar.Sidebar;

      /** @defaultValue {@linkcode foundry.applications.ui.GamePause} */
      pause: typeof foundry.applications.ui.GamePause;

      /** @defaultValue {@linkcode foundry.applications.ui.SceneNavigation} */
      nav: typeof foundry.applications.ui.SceneNavigation;

      /** @defaultValue {@linkcode foundry.applications.ui.Notifications} */
      notifications: typeof foundry.applications.ui.Notifications;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.ActorDirectory} */
      actors: typeof foundry.applications.sidebar.tabs.ActorDirectory;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.CardsDirectory} */
      cards: typeof foundry.applications.sidebar.tabs.CardsDirectory;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.ChatLog} */
      chat: typeof foundry.applications.sidebar.tabs.ChatLog;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.CombatTracker} */
      combat: typeof foundry.applications.sidebar.tabs.CombatTracker;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.CompendiumDirectory} */
      compendium: typeof foundry.applications.sidebar.tabs.CompendiumDirectory;

      /** @defaultValue {@linkcode foundry.applications.ui.SceneControls} */
      controls: typeof foundry.applications.ui.SceneControls;

      /** @defaultValue {@linkcode foundry.applications.ui.Hotbar} */
      hotbar: typeof foundry.applications.ui.Hotbar<foundry.applications.ui.Hotbar.RenderContext>;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.ItemDirectory} */
      items: typeof foundry.applications.sidebar.tabs.ItemDirectory;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.JournalDirectory} */
      journal: typeof foundry.applications.sidebar.tabs.JournalDirectory;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.MacroDirectory} */
      macros: typeof foundry.applications.sidebar.tabs.MacroDirectory;

      /** @defaultValue {@linkcode foundry.applications.ui.Players} */
      players: typeof foundry.applications.ui.Players;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.PlaceableDirectory} */
      placeables: typeof foundry.applications.sidebar.tabs.PlaceableDirectory;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.PlaylistDirectory} */
      playlists: typeof foundry.applications.sidebar.tabs.PlaylistDirectory;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.SceneDirectory} */
      scenes: typeof foundry.applications.sidebar.tabs.SceneDirectory;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.Settings} */
      settings: typeof foundry.applications.sidebar.tabs.Settings;

      /** @defaultValue {@linkcode foundry.applications.sidebar.tabs.RollTableDirectory} */
      tables: typeof foundry.applications.sidebar.tabs.RollTableDirectory;

      /** @defaultValue {@linkcode foundry.applications.apps.av.CameraView} */
      webrtc: typeof foundry.applications.apps.av.CameraViews;
    }

    interface UX {
      /**
       * @defaultValue {@linkcode foundry.applications.ux.Autocomplete}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.applications.apps.FormulaEditor | FormulaEditor}, among other places.
       */
      Autocomplete: typeof foundry.applications.ux.Autocomplete;

      /**
       * @defaultValue {@linkcode foundry.applications.ux.ContextMenu}
       * @privateRemarks Instantiated via `new` in {@linkcode ApplicationV2._createContextMenu | ApplicationV2#_createContextMenu},
       * among other places.
       */
      ContextMenu: typeof foundry.applications.ux.ContextMenu;

      /**
       * @defaultValue {@linkcode foundry.applications.ux.Draggable}
       * @privateRemarks Instantiated via `new` in
       * {@linkcode foundry.applications.apps.av.CameraPopout._onFirstRender | CameraPopout#_onFirstRender}, among other places.
       */
      Draggable: typeof foundry.applications.ux.Draggable;

      /**
       * @defaultValue {@linkcode foundry.applications.ux.DragDrop}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.canvas.Canvas.initialize | Canvas#initialize}, among other places.
       */
      DragDrop: typeof foundry.applications.ux.DragDrop;

      /**
       * @defaultValue {@linkcode foundry.applications.apps.FilePicker}
       * @privateRemarks Instantiated via `new` in `DocumentSheetV2##onEditImage`, among other places.
       */
      FilePicker: typeof foundry.applications.apps.FilePicker;

      /**
       * @defaultValue {@linkcode foundry.applications.ux.FilterMenu}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.applications.sidebar.tabs.PlaceableTab._attachFrameListeners | PlaceableTab#_attachFrameListeners}.
       */
      FilterMenu: typeof foundry.applications.ux.FilterMenu;

      /**
       * @defaultValue {@linkcode foundry.applications.ux.TextEditor}
       * @privateRemarks `TextEditor` is a collection of statics, and is never instantiated at all, but we've still done `typeof` because
       * the difference doesn't really matter and this way doesn't leak `Internal`.
       */
      TextEditor: typeof foundry.applications.ux.TextEditor;

      /**
       * @defaultValue {@linkcode foundry.helpers.interaction.TooltipManager}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.Game.initialize | Game#initialize}.
       */
      TooltipManager: typeof foundry.helpers.interaction.TooltipManager;
    }

    interface FormulaEditor {
      /**
       * A registry of named formula editing contexts, keyed by the context identifier passed as
       * {@linkcode foundry.applications.apps.FormulaEditor.Configuration.context | FormulaEditor.Configuration#context}.
       * @defaultValue `{}`
       */
      contexts: Record<string, FormulaEditor.Context>;
    }

    namespace FormulaEditor {
      interface Context {
        /**
         * A map of data paths to human-readable labels.
         * @remarks e.g. `{"system.abilities.str.mod": "strength modifier"}`
         */
        labels?: Record<string, string> | undefined;
      }
    }

    interface Queries {
      [query: string]: QueryHandler;
      dialog: typeof foundry.applications.api.DialogV2._handleQuery;
      confirmTeleportToken: typeof foundry.data.regionBehaviors.TeleportTokenRegionBehaviorType._confirmQuery;
    }

    type QueryHandler = ToMethod<(queryData: unknown, queryOptions?: { timeout?: number | undefined }) => unknown>;

    interface Canvas {
      /** @defaultValue `10` */
      elevationSnappingPrecision: number;

      /** @defaultValue `8` */
      blurStrength: number;

      /** @defaultValue `4` */
      blurQuality: number;

      /** @defaultValue `0x303030` */
      darknessColor: number;

      /** @defaultValue `0xeeeeee` */
      daylightColor: number;

      /** @defaultValue `0xffffff` */
      brightestColor: number;

      /**
       * @privateRemarks Instantiated via `new` during {@linkcode foundry.applications.hud.HeadsUpDisplayContainer} construction.
       */
      chatBubblesClass: typeof foundry.canvas.animation.ChatBubbles;

      /** @defaultValue `0.25` */
      darknessLightPenalty: number;

      dispositionColors: RemoveIndexSignatures<Canvas.DispositionColors>;

      /**
       * The class used to render door control icons
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.canvas.placeables.Wall.createDoorControl | Wall#createDoorControl}.
       */
      doorControlClass: typeof foundry.canvas.containers.DoorControl;

      /** @defaultValue `0x000000` */
      exploredColor: number;

      /** @defaultValue `0x000000` */
      unexploredColor: number;

      /** @defaultValue `10000` */
      darknessToDaylightAnimationMS: number;

      /** @defaultValue `10000` */
      daylightToDarknessAnimationMS: number;

      /**
       * @defaultValue {@linkcode foundry.canvas.sources.PointDarknessSource}
       * @privateRemarks Instantiated via `new` in `AmbientLight##createLightSource` and `Token##createLightSource`
       */
      darknessSourceClass: typeof foundry.canvas.sources.PointDarknessSource;

      /**
       * @defaultValue {@linkcode foundry.canvas.sources.PointLightSource}
       * @privateRemarks Instantiated via `new` in `AmbientLight##createLightSource` and `Token##createLightSource`
       */
      lightSourceClass: typeof foundry.canvas.sources.PointLightSource;

      /**
       * @defaultValue {@linkcode foundry.canvas.sources.GlobalLightSource}
       * @privateRemarks Instantiated via `new` during {@linkcode groups.EnvironmentCanvasGroup} construction.
       */
      globalLightSourceClass: typeof foundry.canvas.sources.GlobalLightSource;

      /**
       * @defaultValue {@linkcode foundry.canvas.sources.PointVisionSource}
       * @privateRemarks Instantiated via `new` in `Token##createVisionSource`
       */
      visionSourceClass: typeof foundry.canvas.sources.PointVisionSource;

      /**
       * @defaultValue {@linkcode foundry.canvas.sources.PointSoundSource}
       * @privateRemarks Instantiated via `new` in `AmbientSound##createSoundSource` and
       * {@linkcode foundry.audio.Sound.playAtPosition | Sound#PlayAtPosition}.
       */
      soundSourceClass: typeof foundry.canvas.sources.PointSoundSource;

      groups: RemoveIndexSignatures<Canvas.Groups>;

      layers: RemoveIndexSignatures<Canvas.Layers>;

      lightLevels: Canvas.LightLevels;

      /**
       * @defaultValue `FogManager`
       * @privateRemarks  Instantiated via `new` in `Canvas##initializeFogManager`.
       */
      fogManager: typeof perception.FogManager;

      polygonBackends: Canvas.PolygonBackends;

      /** @defaultValue `0.5` */
      darknessSourcePaddingMultiplier: number;

      visibilityFilter: foundry.canvas.rendering.filters.VisibilityFilter.Internal.AnyConstructor;

      visualEffectsMaskingFilter: foundry.canvas.rendering.filters.VisualEffectsMaskingFilter.Internal.AnyConstructor;

      /**
       * @defaultValue {@linkcode foundry.canvas.interaction.Ruler}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.canvas.Canvas.drawRuler | Canvas#drawRuler}
       */
      rulerClass: typeof foundry.canvas.interaction.Ruler;

      /** @defaultValue `0.8` */
      dragSpeedModifier: number;

      /**
       * @defaultValue `undefined`
       * @remarks This comes `undefined` by default, and nothing in core ever sets it. This is only used in two places:
       * - In `foundry.canvas.containers.Cursor##animate`), the `NaN` created by doing math on this gets swallowed by a conditional,
       * so no errors result.
       * - In `Canvas##getDimensions`, it's checked for `=== undefined`, and if so runs an algorithm based on the current Scene's grid and
       * the current window's `innerWidth` and `innerHeight`.
       */
      maxZoom: number | undefined;

      /**
       * @defaultValue `undefined`
       * @remarks This comes `undefined` by default, and nothing in core ever sets it. This is only used in `Canvas##getDimensions`, where
       * it's checked for `=== undefined`, and if so runs an algorithm based on the current Scene's grid and  the current window's
       * `innerWidth` and `innerHeight`.
       */
      minZoom: number | undefined;

      /** @defaultValue `4` */
      objectBorderThickness: number;

      gridStyles: RemoveIndexSignatures<Canvas.GridStyles>;

      lightAnimations: RemoveIndexSignatures<Canvas.LightAnimations>;

      darknessAnimations: RemoveIndexSignatures<Canvas.DarknessAnimations>;

      /**
       * A registry of Scenes which are managed by a specific SceneManager class.
       * @remarks Keys are Scene IDs
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.canvas.Canvas.getSceneManager}
       */
      managedScenes: Record<string, typeof foundry.canvas.SceneManager>;

      pings: Canvas.Pings;

      targeting: Canvas.Targeting;

      /**
       * The hover-fading configuration.
       */
      hoverFade: Canvas.HoverFade;

      /**
       * The set of VisionMode definitions which are available to be used for Token vision.
       */
      visionModes: RemoveIndexSignatures<Canvas.VisionModes>;

      /**
       * The set of DetectionMode definitions which are available to be used for visibility detection.
       */
      detectionModes: RemoveIndexSignatures<Canvas.DetectionModes>;

      /**
       * @deprecated "`CONFIG.Canvas.transcoders` has been deprecated without replacement. KTX2/Basis support is always enabled
       * and this property has no effect anymore." (since v13, until v15)
       */
      get transcoders(): { basis: true };
    }

    namespace Canvas {
      interface Groups {
        [groupName: string]: GroupDefinition;

        /**
         * @defaultValue
         * ```ts
         * {
         *   groupClass: foundry.canvas.groups.HiddenCanvasGroup,
         *   parent: "stage"
         * }
         * ```
         */
        hidden: GroupDefinition<typeof groups.HiddenCanvasGroup>;

        /**
         * @defaultValue
         * ```ts
         * {
         *   groupClass: foundry.canvas.groups.RenderedCanvasGroup,
         *   parent: "stage"
         * }
         * ```
         */
        rendered: GroupDefinition<typeof groups.RenderedCanvasGroup>;

        /**
         * @defaultValue
         * ```ts
         * {
         *   groupClass: foundry.canvas.groups.EnvironmentCanvasGroup,
         *   parent: "rendered"
         * }
         * ```
         */
        environment: GroupDefinition<typeof groups.EnvironmentCanvasGroup>;

        /**
         * @defaultValue
         * ```ts
         * {
         *   groupClass: foundry.canvas.groups.PrimaryCanvasGroup,
         *   parent: "environment"
         * }
         * ```
         */
        primary: GroupDefinition<typeof groups.PrimaryCanvasGroup>;

        /**
         * @defaultValue
         * ```ts
         * {
         *   groupClass: foundry.canvas.groups.EffectsCanvasGroup,
         *   parent: "environment"
         * }
         * ```
         */
        effects: GroupDefinition<typeof groups.EffectsCanvasGroup>;

        /**
         * @defaultValue
         * ```ts
         * {
         *   groupClass: foundry.canvas.groups.CanvasVisibility,
         *   parent: "rendered"
         * }
         * ```
         */
        visibility: GroupDefinition<typeof groups.CanvasVisibility>;

        /**
         * @defaultValue
         * ```ts
         * {
         *   groupClass: foundry.canvas.groups.InterfaceCanvasGroup,
         *   parent: "rendered",
         *   zIndexDrawings: 500,
         *   zIndexScrollingText: 1100
         * }
         * ```
         */
        interface: GroupDefinition<typeof groups.InterfaceCanvasGroup>;

        /**
         * @defaultValue
         * ```ts
         * {
         *   groupClass: foundry.canvas.groups.OverlayCanvasGroup,
         *   parent: "stage"
         * }
         * ```
         */
        overlay: GroupDefinition<typeof groups.OverlayCanvasGroup>;
      }

      /**
       * @privateRemarks `typeof MixedCanvasGroup` is used instead of {@linkcode CanvasGroupMixin.AnyMixedConstructor} because groups are
       * instantiated via `new` in `Canvas##createGroups`
       */
      interface GroupDefinition<GroupClass extends typeof MixedCanvasGroup = typeof MixedCanvasGroup> {
        /**
         * @remarks The class that gets instantiated for this group. Must not take any arguments as Foundry doesn't pass any.
         */
        groupClass: GroupClass;

        /**
         * @remarks Valid parents are {@linkcode foundry.canvas.Canvas.stage | "stage"} or any other defined Group
         */
        parent: "stage" | keyof typeof CONFIG.Canvas.groups;

        /**
         * @remarks Only used in `InterfaceCanvasGroup##createInterfaceDrawingsContainer`.
         *
         * Can't be `undefined` as it is directly assigned to {@linkcode PIXI.Container.zIndex | PIXI.Container#zIndex}
         */
        zIndexDrawings?: number;

        /**
         * @remarks Only used in `InterfaceCanvasGroup##drawScrollingText`.
         *
         * Can't be `undefined` as it is directly assigned to {@linkcode PIXI.Container.zIndex | PIXI.Container#zIndex}
         */
        zIndexScrollingText?: number;
      }

      interface Layers {
        [layerName: string]: LayerDefinition<typeof layers.CanvasLayer, groups.CanvasGroupMixin.Group>;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: WeatherLayer,
         *   group: "primary"
         * }
         * ```
         */
        weather: LayerDefinition<typeof layers.WeatherEffects, "primary">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: GridLayer,
         *   group: "interface"
         * }
         * ```
         */
        grid: LayerDefinition<typeof layers.GridLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: RegionLayer,
         *   group: "interface"
         * }
         * ```
         */
        regions: LayerDefinition<typeof layers.RegionLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: DrawingsLayer,
         *   group: "interface"
         * }
         * ```
         */
        drawings: LayerDefinition<typeof layers.DrawingsLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: TemplateLayer,
         *   group: "interface"
         * }
         * ```
         */
        templates: LayerDefinition<typeof layers.TemplateLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: TokenLayer,
         *   group: "interface"
         * }
         * ```
         */
        tiles: LayerDefinition<typeof layers.TilesLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: WallsLayer,
         *   group: "interface"
         * }
         * ```
         */
        walls: LayerDefinition<typeof layers.WallsLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: TokenLayer,
         *   group: "interface"
         * }
         * ```
         */
        tokens: LayerDefinition<typeof layers.TokenLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: SoundsLayer,
         *   group: "interface"
         * }
         * ```
         */
        sounds: LayerDefinition<typeof layers.SoundsLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: LightingLayer,
         *   group: "interface"
         * }
         * ```
         */
        lighting: LayerDefinition<typeof layers.LightingLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: NotesLayer,
         *   group: "interface"
         * }
         * ```
         */
        notes: LayerDefinition<typeof layers.NotesLayer, "interface">;

        /**
         * @defaultValue
         * ```ts
         * {
         *   layerClass: ControlsLayer,
         *   group: "interface"
         * }
         * ```
         */
        controls: LayerDefinition<typeof layers.ControlsLayer, "interface">;
      }

      // This requires `typeof CanvasLayer` because `CanvasGroupMixin#_createLayers` assumes there's no parameters.
      interface LayerDefinition<
        LayerClass extends typeof layers.CanvasLayer,
        Group extends groups.CanvasGroupMixin.Group,
      > {
        layerClass: LayerClass;
        group: Group;
      }

      interface LightLevels {
        /** @defaultValue `0` */
        dark: number;

        /** @defaultValue `0.5` */
        halfdark: number;

        /** @defaultValue `0.25` */
        dim: number;

        /** @defaultValue `1.0` */
        bright: number;
      }

      /**
       * @privateRemarks Foundry types this as `@enum `{@linkcode geometry.PointSourcePolygon | PointSourcePolygon}, but all the runtime
       * defaults are {@linkcode geometry.ClockwiseSweepPolygon | ClockwiseSweepPolygon}, and CSP types and methods are assumed in other
       * canvas classes, so entries have been constrained to it instead of `PointSourcePolygon`.
       *
       * It is not impossible to add a new type of source, so the index signature is included, but this is unlikely to come up in real
       * world code.
       *
       * `AnyConstructor` is used here because the expectation is that polygons are instantiated via
       * {@linkcode geometry.ClockwiseSweepPolygon.create | .create}, and the constructor has been made protected to enforce this.
       */
      interface PolygonBackends {
        [polygonType: Brand<string, "CONFIG.Canvas.polygonBackends">]: geometry.ClockwiseSweepPolygon.AnyConstructor;
        sight: geometry.ClockwiseSweepPolygon.AnyConstructor;
        light: geometry.ClockwiseSweepPolygon.AnyConstructor;
        darkness: geometry.ClockwiseSweepPolygon.AnyConstructor;
        sound: geometry.ClockwiseSweepPolygon.AnyConstructor;
        move: geometry.ClockwiseSweepPolygon.AnyConstructor;
      }

      interface GridStyles {
        [gridStyle: Brand<string, "CONFIG.Canvas.gridStyles">]: layers.GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.SolidLines",
         *   shaderClass: foundry.canvas.rendering.shaders.GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        solidLines: layers.GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.DashedLines",
         *   shaderClass: foundry.canvas.rendering.shaders.GridShader,
         *   shaderOptions: {
         *     style: 1
         *   }
         * }
         * ```
         */
        dashedLines: layers.GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.DottedLines",
         *   shaderClass: foundry.canvas.rendering.shaders.GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        dottedLines: layers.GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.SquarePoints",
         *   shaderClass: foundry.canvas.rendering.shaders.GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        squarePoints: layers.GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.DiamondPoints",
         *   shaderClass: foundry.canvas.rendering.shaders.GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        diamondPoints: layers.GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.RoundPoints",
         *   shaderClass: foundry.canvas.rendering.shaders.GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        roundPoints: layers.GridLayer.GridStyle;
      }

      interface LightSourceAnimationConfig
        extends
          RenderedEffectSource._AnimationConfigBase,
          Pick<RenderedEffectSource._AnimationConfigLightingShaders, "colorationShader">,
          InexactPartial<Omit<RenderedEffectSource._AnimationConfigLightingShaders, "colorationShader">>,
          InexactPartial<RenderedEffectSource._Seed> {}

      interface LightAnimations {
        [animationID: Brand<string, "CONFIG.Canvas.lightAnimations">]: LightSourceAnimationConfig;
        flame: LightAnimations.Flame;
        torch: LightAnimations.Torch;
        revolving: LightAnimations.Revolving;
        siren: LightAnimations.Siren;
        pulse: LightAnimations.Pulse;
        chroma: LightAnimations.Chroma;
        wave: LightAnimations.Wave;
        fog: LightAnimations.Fog;
        sunburst: LightAnimations.Sunburst;
        dome: LightAnimations.Dome;
        emanation: LightAnimations.Emanation;
        hexa: LightAnimations.Hexa;
        ghost: LightAnimations.Ghost;
        energy: LightAnimations.Energy;
        vortex: LightAnimations.Vortex;
        witchwave: LightAnimations.WitchWave;
        rainbowswirl: LightAnimations.RainbowSwirl;
        radialrainbow: LightAnimations.RadialRainbow;
        fairy: LightAnimations.Fairy;
      }

      namespace LightAnimations {
        interface Flame extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationFame"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateFlickering} */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.FlameIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.FlameColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Torch extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationTorch"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTorch} */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.TorchIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.TorchColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Revolving extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationRevolving"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.RevolvingColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Siren extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationSiren"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTorch} */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.SirenIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.SirenIlluminationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Pulse extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationPulse"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animatePulse} */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.PulseIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.PulseColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Chroma extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationChroma"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `ChromaColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Wave extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationWave"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.WaveIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.WaveColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Fog extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationFog"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.FogColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Sunburst extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationSunburst"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.SunburstIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.SunburstColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Dome extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationLightDome"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.LightDomeColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Emanation extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationEmanation"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.EmanationColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Hexa extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationHexaDome";` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.HexaDomeColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Ghost extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationGhostLight"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.GhostLightIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.GhostLightColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Energy extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationEnergyField"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.EnergyFieldColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Vortex extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationVortex"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.VortexIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.VortexColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface WitchWave extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationBewitchingWave"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.BewitchingWaveIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.BewitchingWaveColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface RainbowSwirl extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationSwirlingRainbow"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.SwirlingRainbowColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface RadialRainbow extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationRadialRainbow"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointLightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.RadialRainbowColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }

        interface Fairy extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationFairyLight"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.LightSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.FairyLightIlluminationShader} */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.FairyLightColorationShader} */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        }
      }

      interface DarknessSourceAnimationConfig
        extends
          RenderedEffectSource._AnimationConfigBase,
          RenderedEffectSource._AnimationConfigDarknessShaders,
          InexactPartial<RenderedEffectSource._Seed> {}

      interface DarknessAnimations {
        [animationID: Brand<string, "CONFIG.Canvas.darknessAnimations">]: DarknessSourceAnimationConfig;
        magicalGloom: DarknessAnimations.MagicalGloom;
        roiling: DarknessAnimations.Roiling;
        hole: DarknessAnimations.Hole;
      }

      namespace DarknessAnimations {
        interface MagicalGloom extends DarknessSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationMagicalGloom"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointDarknessSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.MagicalGloomDarknessShader} */
          darknessShader: AdaptiveDarknessShader.AnyConstructor;
        }

        interface Roiling extends DarknessSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationRoilingMass"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointDarknessSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.RoilingDarknessShader} */
          darknessShader: AdaptiveDarknessShader.AnyConstructor;
        }

        interface Hole extends DarknessSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationBlackHole"` */
          label: string;

          /** @defaultValue {@linkcode foundry.canvas.sources.PointDarknessSource.prototype.animateTime} */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue {@linkcode foundry.canvas.rendering.shaders.BlackHoleDarknessShader} */
          darknessShader: AdaptiveDarknessShader.AnyConstructor;
        }
      }

      interface Pings {
        types: RemoveIndexSignatures<Pings.Types>;

        styles: RemoveIndexSignatures<Pings.Styles>;

        /** @defaultValue `700` */
        pullSpeed: number;
      }

      namespace Pings {
        interface Types {
          [pingType: string]: string;

          /** @defaultValue `"pulse"` */
          PULSE: string;

          /** @defaultValue `"alert"` */
          ALERT: string;

          /** @defaultValue `"chevron"` */
          PULL: string;

          /** @defaultValue `"arrow"` */
          ARROW: string;
        }

        interface Styles {
          [pingStyle: Brand<string, "CONFIG.Canvas.pings.styles">]: Style;

          /**
           * @defaultValue
           * ```ts
           * {
           *   class: foundry.canvas.interaction.AlertPing,
           *   color: "#ff0000",
           *   size: 1.5,
           *   duration: 900
           * }
           * ```
           */
          alert: Style;

          /**
           * @defaultValue
           * ```ts
           * {
           *   class: foundry.canvas.interaction.ArrowPing,
           *   size: 1,
           *   duration: 900
           * }
           * ```
           */
          arrow: Style;

          /**
           * @defaultValue
           * ```ts
           * {
           *   class: foundry.canvas.interaction.ChevronPing,
           *   size: 1,
           *   duration: 2000
           * }
           * ```
           */
          chevron: Style;

          /**
           * @defaultValue
           * ```ts
           * {
           *   class: foundry.canvas.interaction.PulsePing,
           *   size: 1.5,
           *   duration: 900
           * }
           * ```
           */
          pulse: Style;
        }

        interface Style {
          /**
           * @privateRemarks Instantiated via `new` in {@linkcode layers.ControlsLayer.drawPing | ControlsLayer#drawPing}
           */
          class: typeof foundry.canvas.interaction.Ping;

          /**
           * @remarks If not defined, will use the pinging user's {@linkcode User.color | color}, or, if that's also nullish,
           * the ping default of `"#FF6400"`.
           */
          color?: Color.Source;

          /**
           * @defaultValue `1`
           * @remarks A scaling factor, gets multiplied by `100 * `{@linkcode canvas.dimensions.scale}
           * before being passed to the `Ping` constructor (see {@linkcode foundry.canvas.interaction.Ping.ConstructorOptions.size}).
           */
          size?: number;

          /**
           * @remarks See {@linkcode foundry.canvas.interaction.Ping.ConstructorOptions.duration}
           */
          duration: number;
        }
      }

      interface DispositionColors {
        [disposition: string]: number;

        /** @defaultValue `0xE72124` */
        HOSTILE: number;

        /** @defaultValue `0xF1D836` */
        NEUTRAL: number;

        /** @defaultValue `0x43DFDF` */
        FRIENDLY: number;

        /** @defaultValue `0x555555` */
        INACTIVE: number;

        /** @defaultValue `0x33BC4E` */
        PARTY: number;

        /** @defaultValue `0xFF9829` */
        CONTROLLED: number;

        /** @defaultValue `0xA612D4` */
        SECRET: number;
      }

      interface Targeting {
        /**
         * TODO: Fix the following link once Token is updated
         * @remarks The default for `linkcode foundry.canvas.placeables.Token.ReticuleOptions.size`
         * @defaultValue `.15`
         */
        size: number;
      }

      interface HoverFade {
        /**
         * The delay in milliseconds before the (un)faded animation starts on (un)hover.
         * @defaultValue `250`
         */
        delay: number;

        /**
         * The duration in milliseconds of the (un)fade animation on (un)hover.
         * @defaultValue `750`
         */
        duration: number;
      }

      interface VisionModes {
        [visionMode: Brand<string, "CONFIG.Canvas.visionModes">]: perception.VisionMode;

        /**
         * Default (Basic) Vision
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.VisionMode({
         *   id: "basic",
         *   label: "VISION.ModeBasicVision",
         *   vision: {
         *     defaults: { attenuation: 0, contrast: 0, saturation: 0, brightness: 0 }
         *     preferred: true // Takes priority over other vision modes
         *   }
         * })
         * ```
         */
        basic: perception.VisionMode;

        /**
         * Darkvision
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.VisionMode({
         *   id: "darkvision",
         *   label: "VISION.ModeDarkvision",
         *     canvas: {
         *       shader: foundry.canvas.rendering.shaders.ColorAdjustmentsSamplerShader,
         *       uniforms: { contrast: 0, saturation: -1.0, brightness: 0 }
         *   },
         *   lighting: {
         *     levels: {
         *       [foundry.canvas.perception.VisionMode.LIGHTING_LEVELS.DIM]: foundry.canvas.perception.VisionMode.LIGHTING_LEVELS.BRIGHT
         *     },
         *   background: { visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.REQUIRED }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0, saturation: -1.0, brightness: 0 }
         *   }
         * })
         * ```
         */
        darkvision: perception.VisionMode;

        /**
         * Darkvision
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.VisionMode({
         *   id: "monochromatic",
         *   label: "VISION.ModeMonochromatic",
         *   canvas: {
         *     shader: foundry.canvas.rendering.shaders.ColorAdjustmentsSamplerShader,
         *     uniforms: { contrast: 0, saturation: -1.0, brightness: 0 }
         *   },
         *   lighting: {
         *     background: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0, tint: [1, 1, 1] }
         *     },
         *     illumination: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0, tint: [1, 1, 1] }
         *     },
         *     coloration: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0, tint: [1, 1, 1] }
         *     }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0, saturation: -1, brightness: 0 }
         *   }
         * })
         * ```
         */
        monochromatic: perception.VisionMode;

        /**
         * Blindness
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.VisionMode({
         *   id: "blindness",
         *   label: "VISION.ModeBlindness",
         *   tokenConfig: false,
         *   canvas: {
         *     shader: foundry.canvas.rendering.shaders.ColorAdjustmentsSamplerShader,
         *     uniforms: { contrast: -0.75, saturation: -1, exposure: -0.3 }
         *   },
         *   lighting: {
         *     background: { visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     illumination: { visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     coloration: { visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.DISABLED }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { color: null, attenuation: 0, contrast: -0.5, saturation: -1, brightness: -1 }
         *   }
         * }),
         * ```
         */
        blindness: perception.VisionMode;

        /**
         * Tremorsense
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.VisionMode({
         *   id: "tremorsense",
         *   label: "VISION.ModeTremorsense",
         *   canvas: {
         *     shader: foundry.canvas.rendering.shaders.ColorAdjustmentsSamplerShader,
         *     uniforms: { contrast: 0, saturation: -0.8, exposure: -0.65 }
         *   },
         *   lighting: {
         *     background: { visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     illumination: { visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     coloration: { visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     darkness: { visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.DISABLED }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0.2, saturation: -0.3, brightness: 1 },
         *     background: { shader: WaveBackgroundVisionShader },
         *     coloration: { shader: WaveColorationVisionShader }
         *   }
         * }, {animated: true})
         * ```
         */
        tremorsense: perception.VisionMode;

        /**
         * Light Amplification
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.VisionMode({
         *   id: "lightAmplification",
         *   label: "VISION.ModeLightAmplification",
         *   canvas: {
         *     shader: foundry.canvas.rendering.shaders.AmplificationSamplerShader,
         *     uniforms: { saturation: -0.5, tint: [0.38, 0.8, 0.38] }
         *   },
         *   lighting: {
         *     background: {
         *       visibility: foundry.canvas.perception.VisionMode.LIGHTING_VISIBILITY.REQUIRED,
         *       postProcessingModes: ["SATURATION", "EXPOSURE"],
         *       uniforms: { saturation: -0.5, exposure: 1.5, tint: [0.38, 0.8, 0.38] }
         *     },
         *     illumination: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -0.5 }
         *     },
         *     coloration: {
         *       postProcessingModes: ["SATURATION", "EXPOSURE"],
         *       uniforms: { saturation: -0.5, exposure: 1.5, tint: [0.38, 0.8, 0.38] }
         *     },
         *     levels: {
         *       [VisionMode.LIGHTING_LEVELS.DIM]: foundry.canvas.perception.VisionMode.LIGHTING_LEVELS.BRIGHT,
         *       [VisionMode.LIGHTING_LEVELS.BRIGHT]: foundry.canvas.perception.VisionMode.LIGHTING_LEVELS.BRIGHTEST
         *     }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0, saturation: -0.5, brightness: 1 },
         *     background: { shader: foundry.canvas.rendering.shaders.AmplificationBackgroundVisionShader }
         *   }
         * })
         * ```
         */
        lightAmplification: perception.VisionMode;
      }

      interface DetectionModes {
        [detectionMode: Brand<string, "CONFIG.Canvas.detectionModes">]: perception.DetectionMode;

        /**
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.DetectionModeLightPerception({
         *   id: "lightPerception",
         *   label: "DETECTION.LightPerception",
         *   type: foundry.canvas.perception.DetectionMode.DETECTION_TYPES.SIGHT
         * })
         * ```
         */
        lightPerception: perception.DetectionModeLightPerception;

        /**
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.DetectionModeDarkvision({
         *   id: "basicSight",
         *   label: "DETECTION.BasicSight",
         *   type: foundry.canvas.perception.DetectionMode.DETECTION_TYPES.SIGHT
         * })
         * ```
         */
        basicSight: perception.DetectionModeDarkvision;

        /**
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.DetectionModeInvisibility({
         *   id: "seeInvisibility",
         *   label: "DETECTION.SeeInvisibility",
         *   type: foundry.canvas.perception.DetectionMode.DETECTION_TYPES.SIGHT
         * })
         * ```
         */
        seeInvisibility: perception.DetectionModeInvisibility;

        /**
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.DetectionModeInvisibility({
         *   id: "senseInvisibility",
         *   label: "DETECTION.SenseInvisibility",
         *   walls: false,
         *   angle: false,
         *   type: foundry.canvas.perception.DetectionMode.DETECTION_TYPES.OTHER
         * })
         * ```
         */
        senseInvisibility: perception.DetectionModeInvisibility;

        /**
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.DetectionModeTremor({
         *   id: "feelTremor",
         *   label: "DETECTION.FeelTremor",
         *   walls: false,
         *   angle: false,
         *   type: foundry.canvas.perception.DetectionMode.DETECTION_TYPES.MOVE
         * })
         * ```
         */
        feelTremor: perception.DetectionModeTremor;

        /**
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.DetectionModeAll({
         *   id: "seeAll",
         *   label: "DETECTION.SeeAll",
         *   type: foundry.canvas.perception.DetectionMode.DETECTION_TYPES.SIGHT
         * })
         * ```
         */
        seeAll: perception.DetectionModeAll;

        /**
         * @defaultValue
         * ```ts
         * new foundry.canvas.perception.DetectionModeAll({
         *   id: "senseAll",
         *   label: "DETECTION.SenseAll",
         *   walls: false,
         *   angle: false,
         *   type: foundry.canvas.perception.DetectionMode.DETECTION_TYPES.OTHER
         * })
         * ```
         */
        senseAll: perception.DetectionModeAll;
      }
    }

    /** @internal */
    interface _StatusEffect {
      /**
       * DEPRECATED alias for {@linkcode ActiveEffect.CreateData.name}
       * @deprecated "`StatusEffectConfig#label` has been deprecated in favor of {@linkcode StatusEffect.name | StatusEffect#name}"
       * (since v12, until v14)
       */
      label: string;

      /**
       * DEPRECATED alias for {@linkcode ActiveEffect.CreateData.img}
       * @deprecated "`StatusEffectConfig#icon` has been deprecated in favor of {@linkcode StatusEffect.img | StatusEffect#img}"
       * (since v12, until v14)
       */
      icon: string;

      /**
       * Should this effect appear in the Token HUD? This effect is only selectable in the Token HUD
       * if the Token's Actor sub-type is one of the configured ones.
       * @defaultValue `true`
       */
      hud: boolean | { actorTypes?: foundry.documents.Actor.SubType[] };
    }

    /**
     * Configured status effects which are recognized by the game system
     */
    interface StatusEffect extends InexactPartial<_StatusEffect>, foundry.documents.ActiveEffect.CreateData {
      /**
       * A string identifier for the effect
       */
      id: string;
    }

    // The point of this interface is to be declaration merged into so you can override `DefaultSpecialStatusEffects` and remove existing
    // keys. It's never used when empty.
    interface SpecialStatusEffects {
      [specialStatusName: string]: string;
    }

    interface DefaultSpecialStatusEffects {
      [specialStatusName: string]: string;

      /** @defaultValue `"dead"` */
      DEFEATED: string;

      /** @defaultValue `"invisible"` */
      INVISIBLE: string;

      /** @defaultValue `"blind"` */
      BLIND: string;

      /** @defaultValue `"burrow"` */
      BURROW: string;

      /** @defaultValue `"hover"` */
      HOVER: string;

      /** @defaultValue `"fly"` */
      FLY: string;
    }

    interface Sounds {
      [soundName: string]: string;

      /** @defaultValue `"sounds/dice.wav"` */
      dice: string;

      /** @defaultValue `"sounds/lock.wav"` */
      lock: string;

      /** @defaultValue `"sounds/notify.wav"` */
      notification: string;

      /** @defaultValue `"sounds/drums.wav"` */
      combat: string;
    }

    interface SupportedLanguages {
      [languageIdentifier: string]: string;

      /** @defaultValue `"English"` */
      en: string;
    }

    interface Internationalization {
      /**
       * In operations involving the document index, search prefixes must have at least this many characters to avoid too
       * large a search space. Languages that have hundreds or thousands of characters will typically have very shallow
       * search trees, so it should be safe to lower this number in those cases.
       * @defaultValue `4`
       */
      searchMinimumCharacterLength: number;
    }

    interface WeatherEffects {
      [weatherEffectID: Brand<string, "CONFIG.weatherEffects">]: layers.WeatherEffects.AmbienceConfiguration;

      /**
       * @defaultValue
       * ```ts
       * {
       *   id: "leaves",
       *   label: "WEATHER.AutumnLeaves",
       *   effects: [{
       *     id: "leavesParticles",
       *     effectClass: foundry.canvas.containers.AutumnLeavesWeatherEffect
       *   }]
       * }
       * ```
       * @remarks See {@linkcode layers.WeatherEffects.SpecificallyAutumnLeavesConfiguration.config | SpecificallyAutumnLeavesConfiguration.config}
       */
      leaves: layers.WeatherEffects.AmbienceConfiguration;

      /**
       * @defaultValue
       * ```ts
       * {
       *   id: "rain",
       *   label: "WEATHER.Rain",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "rainShader",
       *     effectClass: foundry.canvas.rendering.shaders.WeatherShaderEffect,
       *     shaderClass: foundry.canvas.rendering.shaders.RainShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       opacity: 0.25,
       *       tint: [0.7, 0.9, 1.0],
       *       intensity: 1,
       *       strength: 1,
       *       rotation: 0.2618,
       *       speed: 0.2,
       *     }
       *   }]
       * }
       * ```
       */
      rain: layers.WeatherEffects.AmbienceConfiguration;

      /**
       * @defaultValue
       * ```ts
       * {
       *   id: "rainStorm",
       *   label: "WEATHER.RainStorm",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "fogShader",
       *     effectClass: foundry.canvas.rendering.shaders.WeatherShaderEffect,
       *     shaderClass: foundry.canvas.rendering.shaders.FogShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     performanceLevel: 2,
       *     config: {
       *       slope: 1.5,
       *       intensity: 0.050,
       *       speed: -55.0,
       *       scale: 25,
       *     }
       *   },
       *   {
       *     id: "rainShader",
       *     effectClass: foundry.canvas.rendering.shaders.WeatherShaderEffect,
       *     shaderClass: foundry.canvas.rendering.shaders.RainShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       opacity: 0.45,
       *       tint: [0.7, 0.9, 1.0],
       *       intensity: 1.5,
       *       strength: 1.5,
       *       rotation: 0.5236,
       *       speed: 0.30,
       *     }
       *   }]
       * }
       * ```
       */
      rainStorm: layers.WeatherEffects.AmbienceConfiguration;

      /**
       * @defaultValue
       * ```ts
       * {
       *   id: "fog",
       *   label: "WEATHER.Fog",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "fogShader",
       *     effectClass: foundry.canvas.rendering.shaders.WeatherShaderEffect,
       *     shaderClass: foundry.canvas.rendering.shaders.FogShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       slope: 0.45,
       *       intensity: 0.4,
       *       speed: 0.4,
       *     }
       *   }]
       * }
       * ```
       */
      fog: layers.WeatherEffects.AmbienceConfiguration;

      /**
       * @defaultValue
       * ```
       * {
       *   id: "snow",
       *   label: "WEATHER.Snow",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "snowShader",
       *     effectClass: foundry.canvas.rendering.shaders.WeatherShaderEffect,
       *     shaderClass: foundry.canvas.rendering.shaders.SnowShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       tint: [0.85, 0.95, 1],
       *       direction: 0.5,
       *       speed: 2,
       *       scale: 2.5,
       *     }
       *   }]
       * }
       * ```
       */
      snow: layers.WeatherEffects.AmbienceConfiguration;

      /**
       * @defaultValue
       * ```
       * {
       *   id: "blizzard",
       *   label: "WEATHER.Blizzard",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "snowShader",
       *     effectClass: foundry.canvas.rendering.shaders.WeatherShaderEffect,
       *     shaderClass: foundry.canvas.rendering.shaders.SnowShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       tint: [0.95, 1, 1],
       *       direction: 0.80,
       *       speed: 8,
       *       scale: 2.5,
       *     }
       *   },
       *   {
       *     id: "fogShader",
       *     effectClass: foundry.canvas.rendering.shaders.WeatherShaderEffect,
       *     shaderClass: foundry.canvas.rendering.shaders.FogShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     performanceLevel: 2,
       *     config: {
       *       slope: 1.0,
       *       intensity: 0.15,
       *       speed: -4.0,
       *     }
       *   }]
       * }
       * ```
       */
      blizzard: layers.WeatherEffects.AmbienceConfiguration;
    }

    interface ControlIcons {
      [iconName: string]: string;

      /** @defaultValue `"icons/svg/combat.svg"` */
      combat: string;

      /** @defaultValue `"icons/svg/cowled.svg"` */
      visibility: string;

      /** @defaultValue `"icons/svg/aura.svg"` */
      effects: string;

      /** @defaultValue `"icons/svg/padlock.svg"` */
      lock: string;

      /** @defaultValue `"icons/svg/up.svg"` */
      up: string;

      /** @defaultValue `"icons/svg/down.svg"` */
      down: string;

      /** @defaultValue `"icons/svg/skull.svg"` */
      defeated: string;

      /** @defaultValue `"icons/svg/light.svg"` */
      light: string;

      /** @defaultValue `"icons/svg/light-off.svg"` */
      lightOff: string;

      /** @defaultValue `"icons/svg/explosion.svg"` */
      template: string;

      /** @defaultValue `"icons/svg/sound.svg"` */
      sound: string;

      /** @defaultValue `"icons/svg/sound-off.svg"` */
      soundOff: string;

      /** @defaultValue `"icons/svg/door-closed-outline.svg"` */
      doorClosed: string;

      /** @defaultValue `"icons/svg/door-open-outline.svg"` */
      doorOpen: string;

      /** @defaultValue `"icons/svg/door-secret-outline.svg"` */
      doorSecret: string;

      /** @defaultValue `"icons/svg/door-locked-outline.svg"` */
      doorLocked: string;

      /** @defaultValue `"icons/svg/wall-direction.svg"` */
      wallDirection: string;
    }

    interface FontDefinitions {
      [fontName: string]: Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: []
       * }
       * ```
       */
      Arial: Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: [
       *     {urls: ["fonts/amiri/amiri-regular.woff2"]},
       *     {urls: ["fonts/amiri/amiri-bold.woff2"], weight: "700"}
       *   ]
       * }
       * ```
       */
      Amiri: Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: [
       *     {urls: ["fonts/bruno-ace/bruno-ace.woff2"]}
       *   ]}
       * ```
       */
      "Bruno Ace": Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: []
       * }
       * ```
       */
      Courier: Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: []
       * }
       * ```
       */
      "Courier New": Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: [
       *     {urls: ["fonts/modesto-condensed/modesto-condensed.woff2"]},
       *     {urls: ["fonts/modesto-condensed/modesto-condensed-bold.woff2"], weight: "700"}
       *   ]
       * }
       * ```
       */
      "Modesto Condensed": Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: [
       *     {urls: ["fonts/signika/signika-light.woff2"], weight: "300"},
       *     {urls: ["fonts/signika/signika-regular.woff2"]},
       *     {urls: ["fonts/signika/signika-medium.woff2"], weight: "500"},
       *     {urls: ["fonts/signika/signika-semibold.woff2"], weight: "600"},
       *     {urls: ["fonts/signika/signika-bold.woff2"], weight: "700"}
       *   ]
       * }
       * ```
       */
      Signika: Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: []
       * }
       * ```
       */
      Times: Font.FamilyDefinition;

      /**
       * @defaultValue
       * ```ts
       * {
       *   editor: true,
       *   fonts: []
       * }
       * ```
       */
      "Times New Roman": Font.FamilyDefinition;
    }

    // TODO: rename namespace Font to match interface FontDefinitions? CONFIG.FontDefinitions.Definition feels bad though,
    // TODO: and deprecations are annoying.
    namespace Font {
      interface Definition extends FontFaceDescriptors {
        /** An array of remote URLs the font files exist at. */
        urls: string[];
      }

      interface FamilyDefinition {
        /** Whether the font is available in the rich text editor. This will also enable it for notes and drawings. */
        editor: boolean;

        /**
         * Individual font face definitions for this font family. If this is empty,
         * the font family may only be loaded from the client's OS-installed fonts.
         */
        fonts: Font.Definition[];
      }
    }

    namespace Token {
      interface Movement {
        /** @defaultValue {@linkcode foundry.data.TerrainData} */
        TerrainData: foundry.data.BaseTerrainData.Internal.AnyConstructor;

        /** The movement cost aggregator. */
        costAggregator: TokenDocument.MovementCostAggregator;

        /**
         * The default movement animation speed in grid spaces per second.
         * @defaultValue `6`
         */
        defaultSpeed: number;

        /** @defaultValue `"walk"` */
        defaultAction: ConcreteKeys<Movement.Actions>;

        actions: RemoveIndexSignatures<Movement.Actions>;
      }

      namespace Movement {
        interface AnimationOptions extends Pick<
          foundry.canvas.placeables.Token.AnimateOptions,
          "duration" | "movementSpeed" | "easing" | "ontick"
        > {}

        /** Returns the cost of the move between the grid spaces (nonnegative) */
        type MovementActionCostFunction = (
          /** The base cost (terrain cost) */
          baseCost: number,

          /**
           * The offset that is moved from
           * @remarks foundry marked as `readonly`
           */
          from: foundry.grid.BaseGrid.Offset3D,

          /**
           * The offset that is moved to
           * @remarks foundry marked as `readonly`
           */
          to: foundry.grid.BaseGrid.Offset3D,

          /** The distance between the grid spaces */
          distance: number,

          /**
           * The properties of the segment
           * @remarks foundry marked as `readonly`
           */
          segment: TokenDocument.MovementSegmentData,
        ) => number;

        interface _ActionConfig {
          /**
           * The FontAwesome icon class.
           */
          icon: string;

          /**
           * An image filename. Takes precedence over the icon if both are supplied.
           */
          img: string;

          /**
           * The number that is used to sort the movement actions / movement action configs.
           * Determines the order in the Token Config/HUD and of cycling.
           * @defaultValue `0`
           */
          order: number;

          /**
           * Is teleportation? If true, the movement does not go through all grid spaces
           * between the origin and destination: it goes from teh origin immediately to the destination grid space.
           * @defaultValue `false`
           */
          teleport: boolean;

          /**
           * Is the movement measured? The distance, cost, spaces, and diagonals
           * of a segment that is not measured are always 0.
           * @defaultValue `true`
           */
          measure: boolean;

          /**
           * The type of walls that block this movement, if any.
           * @defaultValue `"move"`
           */
          walls: ConcreteKeys<CONFIG.Canvas.PolygonBackends> | null;

          /**
           * Is segment of the movement visualized by the ruler?
           * @defaultValue `true`
           */
          visualize: boolean;

          /**
           * Get the default animation options for this movement action.
           * @defaultValue `() => ({})`
           */
          getAnimationOptions: (token: foundry.canvas.placeables.Token) => AnimationOptions;

          /**
           * Can the current User select this movement action for the given Token? If selectable, the movement action of the
           * Token can be set to this movement action by the User via the UI and when cycling.
           * @defaultValue `() => true`
           */
          canSelect: (token: TokenDocument.Implementation | foundry.data.PrototypeToken) => boolean;

          /**
           * If set, this function is used to derive the terrain difficulty from from nonderived difficulties,
           * which are those that do not have `deriveTerrainDifficulty` set.
           * Used by {@linkcode foundry.data.regionBehaviors.ModifyMovementCostRegionBehaviorType}.
           * Derived terrain difficulties are not configurable via the behavior UI.
           */
          deriveTerrainDifficulty: ((nonDerivedDifficulties: { [action: string]: number }) => number) | null;

          /**
           * The cost modification function.
           * @defaultValue `() => cost => cost`
           */
          getCostFunction: (
            token: TokenDocument.Implementation,
            options: foundry.canvas.placeables.Token.MeasureMovementPathOptions,
          ) => MovementActionCostFunction;
        }

        interface ActionConfig extends InexactPartial<_ActionConfig> {
          /**
           * The label of the movement action.
           */
          label: string;
        }

        interface Actions {
          [action: string]: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.walk.label",
           *   icon: "fa-solid fa-person-walking",
           *   img: "icons/svg/walk.svg",
           *   order: 0
           * }
           * ```
           */
          walk: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.fly.label",
           *   icon: "fa-solid fa-person-fairy",
           *   img: "icons/svg/wing.svg",
           *   order: 1
           * }
           * ```
           */
          fly: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.swim.label",
           *   icon: "fa-solid fa-person-swimming",
           *   img: "icons/svg/whale.svg",
           *   order: 2,
           *   getAnimationOptions: () => ({movementSpeed: CONFIG.Token.movement.defaultSpeed / 2})
           * }
           * ```
           */
          swim: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.burrow.label",
           *   icon: "fa-solid fa-person-digging",
           *   img: "icons/svg/burrow.svg",
           *   order: 3
           * }
           * ```
           */
          burrow: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.crawl.label",
           *   icon: "fa-solid fa-person-praying",
           *   img: "icons/svg/leg.svg",
           *   order: 4,
           *   getAnimationOptions: () => ({movementSpeed: CONFIG.Token.movement.defaultSpeed / 2}),
           *   deriveTerrainDifficulty: ({walk}) => walk,
           *   getCostFunction: () => cost => cost * 2
           * }
           * ```
           */
          crawl: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.climb.label",
           *   icon: "fa-solid fa-person-through-window",
           *   img: "icons/svg/ladder.svg",
           *   order: 5,
           *   getAnimationOptions: () => ({movementSpeed: CONFIG.Token.movement.defaultSpeed / 2}),
           *   deriveTerrainDifficulty: ({walk}) => walk,
           *   getCostFunction: () => cost => cost * 2
           * }
           * ```
           */
          climb: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.jump.label",
           *   icon: "fa-solid fa-person-running-fast",
           *   img: "icons/svg/jump.svg",
           *   order: 6,
           *   deriveTerrainDifficulty: ({walk, fly}) => Math.max(walk, fly),
           *   getCostFunction: () => cost => cost * 2
           * }
           * ```
           */
          jump: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.blink.label",
           *   icon: "fa-solid fa-person-from-portal",
           *   img: "icons/svg/teleport.svg",
           *   order: 7,
           *   teleport: true,
           *   getAnimationOptions: () => ({duration: 0}),
           *   deriveTerrainDifficulty: () => 1
           * }
           * ```
           */
          blink: ActionConfig;

          /**
           * @defaultValue
           * ```ts
           * {
           *   label: "TOKEN.MOVEMENT.ACTIONS.displace.label",
           *   icon: "fa-solid fa-transporter-1",
           *   img: "icons/svg/portal.svg",
           *   order: 8,
           *   teleport: true,
           *   measure: false,
           *   walls: null,
           *   visualize: false,
           *   getAnimationOptions: () => ({duration: 0}),
           *   canSelect: () => false,
           *   deriveTerrainDifficulty: () => 1,
           *   getCostFunction: () => () => 0
           * }
           * ```
           */
          displace: ActionConfig;
        }
      }

      /** @deprecated Use {@linkcode CONFIG.Token.Movement.ActionConfig} instead. This warning will be removed in v14. */
      type MovementActionConfig = Movement.ActionConfig;
    }

    interface Time {
      /**
       * The Calendar configuration used for in-world timekeeping.
       * @defaultValue {@linkcode foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG}
       */
      worldCalendarConfig: foundry.data.CalendarData.CreateData;

      /**
       * The CalendarData subclass is used for in-world timekeeping.
       * @defaultValue {@linkcode foundry.data.CalendarData}
       */
      worldCalendarClass: typeof foundry.data.CalendarData;

      /**
       * The Calendar configuration used for IRL timekeeping.
       * @defaultValue {@linkcode foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG}
       */
      earthCalendarConfig: foundry.data.CalendarData.CreateData;

      /**
       * The CalendarData subclass is used for IRL timekeeping.
       * @defaultValue {@linkcode foundry.data.CalendarData}
       */
      earthCalendarClass: typeof foundry.data.CalendarData;

      /**
       * The number of seconds which automatically elapse at the end of a Combat turn.
       * @defaultValue `0`
       */
      turnTime: number;

      /**
       * The number of seconds which automatically elapse at the end of a Combat round.
       * @defaultValue `0`
       */
      roundTime: number;

      /** Formatting functions used to display time data as strings. */
      formatters: RemoveIndexSignatures<CONFIG.Time.formatters>;
    }

    namespace Time {
      interface formatters {
        [formatterName: string]: foundry.data.CalendarData.TimeFormatter;
        timestamp: typeof foundry.data.CalendarData.formatTimestamp;
        ago: typeof foundry.data.CalendarData.formatAgo;
      }
    }

    interface ActiveEffect extends _Document<"ActiveEffect">, _HasTypes<"ActiveEffect"> {
      /**
       * If true, Active Effects on Items will be copied to the Actor when the Item is created on the Actor if the
       * Active Effect's transfer property is true, and will be deleted when that Item is deleted from the Actor.
       * If false, Active Effects are never copied to the Actor, but will still apply to the Actor from within the Item
       * if the transfer property on the Active Effect is true.
       * @defaultValue `false`
       * @deprecated since V11. It can be set to true until V14, at which point it will be removed.
       */
      legacyTransferral: boolean;
    }

    interface ActorDelta extends _Document<"ActorDelta">, _HasNoTypes<"ActorDelta"> {}

    interface Card extends _Document<"Card">, _HasTypes<"Card"> {}

    interface TableResult extends _Document<"TableResult">, _HasNoTypes<"TableResult"> {}

    interface JournalEntryCategory extends _Document<"JournalEntryCategory">, _HasNoTypes<"JournalEntryCategory"> {}

    interface JournalEntryPage extends _Document<"JournalEntryPage">, _HasTypes<"JournalEntryPage"> {
      /**
       * @defaultValue
       * ```ts
       * {
       *   image: "fa-solid fa-file-image",
       *   pdf: "fa-solid fa-file-pdf",
       *   text: "fa-solid fa-file-lines",
       *   video: "fa-solid fa-file-video"
       * }
       * ```
       */
      typeIcons: _HasTypes<"JournalEntryPage">["typeIcons"];

      /** @defaultValue `"text"` */
      defaultType: string;

      /** @defaultValue `"fa-solid fa-book-open"` */
      sidebarIcon: string;
    }

    interface PlaylistSound extends _Document<"PlaylistSound">, _HasNoTypes<"PlaylistSound"> {
      /** @defaultValue `"fa-solid fa-music"` */
      sidebarIcon: string;
    }

    interface AmbientLight extends _Document<"AmbientLight">, _HasNoTypes<"AmbientLight">, _CanvasDoc<"AmbientLight"> {
      /**
       * @defaultValue
       * ```js
       * {
       *   applicationClass: foundry.applications.sidebar.tabs.AmbientLightTab,
       *   order: 500
       * }
       * ```
       */
      sidebar: { applicationClass: typeof foundry.applications.sidebar.tabs.AmbientLightTab; order: number };
    }

    interface AmbientSound extends _Document<"AmbientSound">, _HasNoTypes<"AmbientSound">, _CanvasDoc<"AmbientSound"> {
      /**
       * @defaultValue
       * ```js
       * {
       *   applicationClass: foundry.applications.sidebar.tabs.AmbientSoundTab,
       *   order: 600
       * }
       * ```
       */
      sidebar: { applicationClass: typeof foundry.applications.sidebar.tabs.AmbientSoundTab; order: number };
    }

    interface Combatant extends _Document<"Combatant">, _HasTypes<"Combatant"> {}

    interface CombatantGroup extends _Document<"CombatantGroup">, _HasTypes<"CombatantGroup"> {}

    interface Drawing extends _Document<"Drawing">, _HasNoTypes<"Drawing">, _CanvasDoc<"Drawing"> {
      /**
       * @defaultValue {@linkcode foundry.applications.hud.DrawingHUD}
       * @privateRemarks Instantiated by `new` in the {@linkcode foundry.applications.hud.HeadsUpDisplayContainer} class body.
       */
      hudClass: typeof foundry.applications.hud.DrawingHUD;

      /**
       * @defaultValue
       * ```js
       * {
       *   applicationClass: foundry.applications.sidebar.tabs.DrawingTab,
       *   order: 300
       * }
       * ```
       */
      sidebar: { applicationClass: typeof foundry.applications.sidebar.tabs.DrawingTab; order: number };
    }

    interface MeasuredTemplate
      extends _Document<"MeasuredTemplate">, _HasNoTypes<"MeasuredTemplate">, _CanvasDoc<"MeasuredTemplate"> {
      defaults: MeasuredTemplate.Defaults;

      /**
       * @deprecated "`CONFIG.MeasuredTemplate.types` has been deprecated without replacement. Use {@linkcode CONST.MEASURED_TEMPLATE_TYPES}
       * and `TEMPLATE.TYPES.${type}` instead." (since v13, until v15)
       */
      get types(): Record<string, string>;
    }

    namespace MeasuredTemplate {
      interface Defaults {
        /** @defaultValue `53.13` */
        angle: number;

        /** @defaultValue `1` */
        width: number;
      }
    }

    interface Note extends _Document<"Note">, _HasNoTypes<"Note">, _CanvasDoc<"Note"> {
      /**
       * @defaultValue
       * ```js
       * {
       *   applicationClass: foundry.applications.sidebar.tabs.NoteTab,
       *   order: 800
       * }
       * ```
       */
      sidebar: { applicationClass: typeof foundry.applications.sidebar.tabs.NoteTab; order: number };
    }

    interface Region extends _Document<"Region">, _HasNoTypes<"Region">, _CanvasDoc<"Region"> {
      /**
       * @defaultValue
       * ```js
       * {
       *   applicationClass: foundry.applications.sidebar.tabs.RegionTab,
       *   order: 700
       * }
       * ```
       */
      sidebar: { applicationClass: typeof foundry.applications.sidebar.tabs.RegionTab; order: number };
    }

    interface RegionBehavior extends _Document<"RegionBehavior">, _HasTypes<"RegionBehavior"> {
      /**
       * @defaultValue
       * ```ts
       * {
       *   adjustDarknessLevel: "fa-solid fa-circle-half-stroke",
       *   displayScrollingText: "fa-solid fa-message-arrow-up",
       *   executeMacro: "fa-solid fa-code",
       *   executeScript: "fa-brands fa-js",
       *   modifyMovementCost: "fa-solid fa-shoe-prints",
       *   pauseGame: "fa-solid fa-pause",
       *   suppressWeather: "fa-solid fa-cloud-slash",
       *   teleportToken: "fa-solid fa-transporter-1",
       *   toggleBehavior: "fa-solid fa-sliders"
       * }
       * ```
       */
      typeIcons: _HasTypes<"RegionBehavior">["typeIcons"];
    }

    interface Tile extends _Document<"Tile">, _HasNoTypes<"Tile">, _CanvasDoc<"Tile"> {
      /**
       * @defaultValue {@linkcode foundry.applications.hud.TileHUD}
       * @privateRemarks Instantiated by `new` in the {@linkcode foundry.applications.hud.HeadsUpDisplayContainer} class body.
       */
      hudClass: typeof foundry.applications.hud.TileHUD;

      /**
       * @defaultValue
       * ```js
       * {
       *   applicationClass: foundry.applications.sidebar.tabs.TileTab,
       *   order: 200
       * }
       * ```
       */
      sidebar: { applicationClass: typeof foundry.applications.sidebar.tabs.TileTab; order: number };
    }

    interface Level extends _Document<"Level">, _HasNoTypes<"Level"> {}

    interface Token extends _Document<"Token">, _HasNoTypes<"Token">, _CanvasDoc<"Token"> {
      /**
       * @defaultValue {@linkcode foundry.applications.sheets.PrototypeTokenConfig}
       * @privateRemarks Instantiated via `new` in `ActorSheetV2##onConfigurePrototypeToken` and
       * {@linkcode foundry.appv1.sheets.ActorSheet._onConfigureToken | ActorSheet#_onConfigureToken}.
       */
      prototypeSheetClass: typeof foundry.applications.sheets.PrototypeTokenConfig;

      /**
       * @defaultValue {@linkcode foundry.applications.hud.TokenHUD}
       * @privateRemarks Instantiated by `new` in the {@linkcode foundry.applications.hud.HeadsUpDisplayContainer} class body.
       */
      hudClass: typeof foundry.applications.hud.TokenHUD;

      /**
       * @defaultValue {@linkcode foundry.canvas.placeables.tokens.TokenRuler}
       * @privateRemarks Instantiated via `new` in {@linkcode foundry.canvas.placeables.Token._initializeRuler | Token#_initializeRuler}.
       */
      rulerClass: typeof foundry.canvas.placeables.tokens.TokenRuler;

      /**
       * @defaultValue
       * ```js
       * {
       *   applicationClass: foundry.applications.sidebar.tabs.TokenTab,
       *   order: 100
       * }
       * ```
       */
      sidebar: { applicationClass: typeof foundry.applications.sidebar.tabs.TokenTab; order: number };

      movement: Token.Movement;

      /** @defaultValue `"TOKEN.Adjectives"` */
      adjectivesPrefix: string;

      /**
       * @defaultValue `new `{@linkcode foundry.canvas.placeables.tokens.TokenRingConfig}`()`
       * @privateRemarks This gets `defineProperty`'d to `{ writable: false, configurable: false }` near the bottom of `config.mjs`
       */
      readonly ring: foundry.canvas.placeables.tokens.TokenRingConfig;
    }

    interface Wall extends _Document<"Wall">, _HasNoTypes<"Wall">, _CanvasDoc<"Wall"> {
      // TODO: is InterfaceToObject required?
      animationTypes: InterfaceToObject<RemoveIndexSignatures<CONFIG.Wall.DoorAnimations>>;

      // TODO: is InterfaceToObject required?
      doorSounds: InterfaceToObject<RemoveIndexSignatures<CONFIG.Wall.DoorSounds>>;

      /**
       * A default grid size in pixels which is used for rendering {@linkcode foundry.canvas.containers.DoorMesh} sizing.
       * @defaultValue `200`
       */
      textureGridSize: number;

      /** @defaultValue `1` */
      thresholdAttenuationMultiplier: number;

      /**
       * @defaultValue
       * ```js
       * {
       *   applicationClass: foundry.applications.sidebar.tabs.WallTab,
       *   order: 400
       * }
       * ```
       */
      sidebar: { applicationClass: typeof foundry.applications.sidebar.tabs.WallTab; order: number };
    }

    namespace Wall {
      /** @internal */
      interface _DoorSoundConfig {
        /**
         * One or more sound paths for when the door is closed
         * @remarks If an array is provided, a random entry is chosen
         */
        close: MaybeArray<string>;

        /**
         * One or more sound paths for when the door becomes locked
         * @remarks If an array is provided, a random entry is chosen
         */
        lock: MaybeArray<string>;

        /**
         * One or more sound paths for when opening the door
         * @remarks If an array is provided, a random entry is chosen
         */
        open: MaybeArray<string>;

        /**
         * One or more sound paths for when attempting to open a locked door
         * @remarks If an array is provided, a random entry is chosen
         */
        test: MaybeArray<string>;

        /**
         * One or more sound paths for when the door becomes unlocked
         * @remarks If an array is provided, a random entry is chosen
         */
        unlock: MaybeArray<string>;
      }

      interface DoorSoundConfig extends InexactPartial<_DoorSoundConfig> {
        /** A localization string label */
        label: string;
      }

      interface DoorSounds {
        [sound: Brand<string, "CONFIG.Wall.doorSounds">]: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.FuturisticFast",
         *   close: "sounds/doors/futuristic/close-fast.ogg",
         *   lock: "sounds/doors/futuristic/lock.ogg",
         *   open: "sounds/doors/futuristic/open-fast.ogg",
         *   test: "sounds/doors/futuristic/test.ogg",
         *   unlock: "sounds/doors/futuristic/unlock.ogg"
         * }
         * ```
         */
        futuristicFast: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.FuturisticHydraulic",
         *   close: "sounds/doors/futuristic/close-hydraulic.ogg",
         *   lock: "sounds/doors/futuristic/lock.ogg",
         *   open: "sounds/doors/futuristic/open-hydraulic.ogg",
         *   test: "sounds/doors/futuristic/test.ogg",
         *   unlock: "sounds/doors/futuristic/unlock.ogg"
         * }
         * ```
         */
        futuristicHydraulic: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.FuturisticForcefield",
         *   close: "sounds/doors/futuristic/close-forcefield.ogg",
         *   lock: "sounds/doors/futuristic/lock.ogg",
         *   open: "sounds/doors/futuristic/open-forcefield.ogg",
         *   test: "sounds/doors/futuristic/test-forcefield.ogg",
         *   unlock: "sounds/doors/futuristic/unlock.ogg"
         * }
         * ```
         */
        futuristicForcefield: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.Industrial",
         *   close: "sounds/doors/industrial/close.ogg",
         *   lock: "sounds/doors/industrial/lock.ogg",
         *   open: "sounds/doors/industrial/open.ogg",
         *   test: "sounds/doors/industrial/test.ogg",
         *   unlock: "sounds/doors/industrial/unlock.ogg"
         * }
         * ```
         */
        industrial: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.IndustrialCreaky",
         *   close: "sounds/doors/industrial/close-creaky.ogg",
         *   lock: "sounds/doors/industrial/lock.ogg",
         *   open: "sounds/doors/industrial/open-creaky.ogg",
         *   test: "sounds/doors/industrial/test.ogg",
         *   unlock: "sounds/doors/industrial/unlock.ogg"
         * }
         * ```
         */
        industrialCreaky: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.Jail",
         *   close: "sounds/doors/jail/close.ogg",
         *   lock: "sounds/doors/jail/lock.ogg",
         *   open: "sounds/doors/jail/open.ogg",
         *   test: "sounds/doors/jail/test.ogg",
         *   unlock: "sounds/doors/jail/unlock.ogg"
         * }
         * ```
         */
        jail: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.MagicDoor",
         *   close: "sounds/doors/magic/door-close.ogg",
         *   lock: "sounds/doors/magic/lock.ogg",
         *   open: "sounds/doors/magic/door-open.ogg",
         *   test: "sounds/doors/magic/test.ogg",
         *   unlock: "sounds/doors/magic/unlock.ogg"
         * }
         * ```
         */
        magicDoor: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.MagicWall",
         *   close: "sounds/doors/magic/wall-close.ogg",
         *   lock: "sounds/doors/magic/lock.ogg",
         *   open: "sounds/doors/magic/wall-open.ogg",
         *   test: "sounds/doors/magic/test.ogg",
         *   unlock: "sounds/doors/magic/unlock.ogg"
         * }
         * ```
         */
        magicWall: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.Metal",
         *   close: "sounds/doors/metal/close.ogg",
         *   lock: "sounds/doors/metal/lock.ogg",
         *   open: "sounds/doors/metal/open.ogg",
         *   test: "sounds/doors/metal/test.ogg",
         *   unlock: "sounds/doors/metal/unlock.ogg"
         * }
         * ```
         */
        metal: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.SlidingMetal",
         *   close: "sounds/doors/shutter/close.ogg",
         *   lock: "sounds/doors/shutter/lock.ogg",
         *   open: "sounds/doors/shutter/open.ogg",
         *   test: "sounds/doors/shutter/test.ogg",
         *   unlock: "sounds/doors/shutter/unlock.ogg"
         * }
         * ```
         */
        slidingMetal: DoorSoundConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.DoorSounds.SlidingMetalHeavy";
         *   close: "sounds/doors/metal/heavy-sliding-close.ogg";
         *   lock: "sounds/doors/metal/heavy-sliding-lock.ogg";
         *   open: "sounds/doors/metal/heavy-sliding-open.ogg";
         *   test: "sounds/doors/metal/heavy-sliding-test.ogg";
         *   unlock: "sounds/doors/metal/heavy-sliding-unlock.ogg";
         * }
         * ```
         */
        slidingMetalHeavy: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.SlidingModern",
         *   close: "sounds/doors/sliding/close.ogg",
         *   lock: "sounds/doors/sliding/lock.ogg",
         *   open: "sounds/doors/sliding/open.ogg",
         *   test: "sounds/doors/sliding/test.ogg",
         *   unlock: "sounds/doors/sliding/unlock.ogg"
         * }
         * ```
         */
        slidingModern: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.SlidingWood",
         *   close: "sounds/doors/sliding/close-wood.ogg",
         *   lock: "sounds/doors/sliding/lock.ogg",
         *   open: "sounds/doors/sliding/open-wood.ogg",
         *   test: "sounds/doors/sliding/test.ogg",
         *   unlock: "sounds/doors/sliding/unlock.ogg"
         * }
         * ```
         */
        slidingWood: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.StoneBasic",
         *   close: "sounds/doors/stone/close.ogg",
         *   lock: "sounds/doors/stone/lock.ogg",
         *   open: "sounds/doors/stone/open.ogg",
         *   test: "sounds/doors/stone/test.ogg",
         *   unlock: "sounds/doors/stone/unlock.ogg"
         * }
         * ```
         */
        stoneBasic: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.StoneRocky",
         *   close: "sounds/doors/stone/close-rocky.ogg",
         *   lock: "sounds/doors/stone/lock.ogg",
         *   open: "sounds/doors/stone/open-rocky.ogg",
         *   test: "sounds/doors/stone/test.ogg",
         *   unlock: "sounds/doors/stone/unlock.ogg"
         * }
         * ```
         */
        stoneRocky: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.StoneSandy",
         *   close: "sounds/doors/stone/close-sandy.ogg",
         *   lock: "sounds/doors/stone/lock.ogg",
         *   open: "sounds/doors/stone/open-sandy.ogg",
         *   test: "sounds/doors/stone/test.ogg",
         *   unlock: "sounds/doors/stone/unlock.ogg"
         * }
         * ```
         */
        stoneSandy: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.WoodBasic",
         *   close: "sounds/doors/wood/close.ogg",
         *   lock: "sounds/doors/wood/lock.ogg",
         *   open: "sounds/doors/wood/open.ogg",
         *   test: "sounds/doors/wood/test.ogg",
         *   unlock: "sounds/doors/wood/unlock.ogg"
         * }
         * ```
         */
        woodBasic: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.WoodCreaky",
         *   close: "sounds/doors/wood/close-creaky.ogg",
         *   lock: "sounds/doors/wood/lock.ogg",
         *   open: "sounds/doors/wood/open-creaky.ogg",
         *   test: "sounds/doors/wood/test.ogg",
         *   unlock: "sounds/doors/wood/unlock.ogg"
         * }
         * ```
         */
        woodCreaky: DoorSoundConfig;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.WoodHeavy",
         *   close: "sounds/doors/wood/close-heavy.ogg",
         *   lock: "sounds/doors/wood/lock.ogg",
         *   open: "sounds/doors/wood/open-heavy.ogg",
         *   test: "sounds/doors/wood/test.ogg",
         *   unlock: "sounds/doors/wood/unlock.ogg"
         * }
         * ```
         */
        woodHeavy: DoorSoundConfig;
      }

      type DoorAnimationFunction = (this: DoorMesh, open: boolean) => CanvasAnimation.Attribute[];

      type DoorAnimationHook = (this: DoorMesh, open: boolean) => MaybePromise<void>;

      /** @internal */
      interface _DoorAnimationConfig {
        /**
         * @defaultValue `false`
         * @remarks Pivot about the midpoint, instead of the {@linkcode geometry.edges.Edge.a | a} endpoint of the Wall's Edge?
         */
        midpoint: boolean;

        /** @defaultValue {@linkcode CanvasAnimation.easeInOutCosine | "easeInOutCosine"} */
        easing: CanvasAnimation.EasingFunction;

        /** @remarks `initialize` hooks are not awaited */
        initialize: DoorAnimationHook;

        /** @remarks `preAnimate` hooks **are** awaited */
        preAnimate: DoorAnimationHook;

        /** @remarks `postAnimate` hooks **are** awaited */
        postAnimate: DoorAnimationHook;
      }

      interface DoorAnimationConfig extends InexactPartial<_DoorAnimationConfig> {
        /** @remarks Label (or localization key) for the animation select in {@linkcode foundry.applications.sheets.WallConfig | WallConfig}*/
        label: string;

        animate: DoorAnimationFunction;

        /** @remarks Time to animate over in milliseconds */
        duration: number;
      }

      interface DoorAnimations {
        [animationName: Brand<string, "CONFIG.Wall.animationTypes">]: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.ASCEND",
         *   midpoint: true,
         *   animate: canvas.containers.DoorMesh.animateAscend,
         *   duration: 1000
         * }
         * ```
         */
        ascend: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.DESCEND",
         *   midpoint: true,
         *   initialize: canvas.containers.DoorMesh.initializeDescend,
         *   animate: canvas.containers.DoorMesh.animateDescend,
         *   preAnimate: canvas.containers.DoorMesh.preAnimateDescend,
         *   postAnimate: canvas.containers.DoorMesh.postAnimateDescend,
         *   duration: 1000
         * }
         * ```
         */
        descend: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.SLIDE",
         *   animate: canvas.containers.DoorMesh.animateSlide,
         *   duration: 500
         * }
         * ```
         */
        slide: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.SWING",
         *   animate: canvas.containers.DoorMesh.animateSwing,
         *   duration: 500
         * }
         * ```
         */
        swing: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.SWIVEL",
         *   midpoint: true,
         *   animate: canvas.containers.DoorMesh.animateSwing,
         *   duration: 500
         * }
         * ```
         */
        swivel: DoorAnimationConfig;
      }
    }

    interface SoundEffects {
      [effectName: string]: SoundEffect;

      /**
       * @defaultValue
       * ```ts
       * {
       *   label: "SOUND.EFFECTS.LOWPASS",
       *   effectClass: audio.BiquadFilterEffect
       * }
       * ```
       */
      lowpass: SoundEffect;

      /**
       * @defaultValue
       * ```ts
       *  {
       *   label: "SOUND.EFFECTS.HIGHPASS",
       *   effectClass: audio.BiquadFilterEffect
       * }
       * ```
       */
      highpass: SoundEffect;

      /**
       * @defaultValue
       * ```ts
       * {
       *   label: "SOUND.EFFECTS.REVERB",
       *   effectClass: audio.ConvolverEffect
       * }
       * ```
       */
      reverb: SoundEffect;
    }

    interface SoundEffect {
      label: string;
      effectClass: typeof BiquadFilterNode | typeof ConvolverNode;
    }

    interface TextEditor {
      /**
       * Configuration for custom text editor engines.
       */
      engines: Record<string, CONFIG.TextEditorEngineConfig>;

      /**
       * A collection of custom enrichers that can be applied to text content, allowing for the matching and handling of
       * custom patterns.
       */
      enrichers: foundry.applications.ux.TextEditor.EnricherConfig[];

      /**
       * A collection of custom ProseMirror inserts.
       */
      inserts: CONFIG.ProseMirrorInsert[];
    }

    interface WebRTC {
      /** @defaultValue `SimplePeerAVClient` */
      clientClass: GetKey<WebRTCConfig, "clientClass", typeof foundry.av.clients.SimplePeerAVClient>;

      /** @defaultValue `50` */
      detectPeerVolumeInterval: number;

      /** @defaultValue `20` */
      detectSelfVolumeInterval: number;

      /** @defaultValue `25` */
      emitVolumeInterval: number;

      /** @defaultValue `2` */
      speakingThresholdEvents: number;

      /** @defaultValue `10` */
      speakingHistoryLength: number;

      /** @defaultValue `8` */
      connectedUserPollIntervalS: number;
    }

    interface Cursors extends Record<keyof typeof CONST.CURSOR_STYLES, string | CursorDescriptor> {}

    interface _CursorDescriptor {
      /** The X co-ordinate of the cursor hotspot. */
      x: number;

      /** The Y co-ordinate of the cursor hotspot. */
      y: number;
    }

    interface CursorDescriptor extends InexactPartial<_CursorDescriptor> {
      /** The URL of the cursor image. Must be no larger than 128x128. 32x32 is recommended. */
      url: string;
    }

    interface TextEditorEngineRenderOptions extends foundry.applications.fields.EditorInputConfig {}

    /**
     * A callback used to instantiate the editor instance.
     * @param options        - Construction options.
     * @param initialContent - The editor's initial content.
     */
    type TextEditorEngineFactory = (
      options: Record<string, unknown>,
      initialContent: string,
    ) => Promise<foundry.applications.ux.TextEditor.CustomEngine>;

    /**
     * A callback used to generate markup used for the createEditorInput method and `{{ editor }}` handlebars helper.
     */
    type TextEditorEngineRenderer = (options: TextEditorEngineRenderOptions) => HTMLElement;

    interface TextEditorEngineConfig {
      /** A callback used to instantiate the editor instance. */
      create: TextEditorEngineFactory;

      /**
       * A callback used to generate markup used for the createEditorInput method and `{{ editor }}` handlebars helper.
       */
      render: TextEditorEngineRenderer;
    }

    interface ProseMirrorInsert {
      /** A unique identifier. */
      action: string;

      /** The description of the menu item or insert. */
      title: string;

      /** Whether the insert is inline content, otherwise it is assumed to be block content. */
      inline?: boolean | undefined;

      /** The insert's markup. */
      html?: string | undefined;

      /** Any child entries. */
      children?: ProseMirrorInsert[] | undefined;
    }
  }
}

declare const _MixedCanvasGroup: groups.CanvasGroupMixin.AnyMixedConstructor;

/**
 * @privateRemarks Used to enforce user-provided group classes taking no constructor arguments
 */
declare class MixedCanvasGroup extends _MixedCanvasGroup {
  constructor();
}
