import type {
  AnyArray,
  AnyObject,
  DeepReadonly,
  InexactPartial,
  InterfaceToObject,
  MaybeArray,
  Merge,
  NullishProps,
} from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema, SchemaField } from "#common/data/fields.d.mts";
import type { ActorDeltaField } from "#common/documents/token.d.mts";
import type BaseToken from "#common/documents/token.d.mts";
import type { LightData, TextureData } from "#common/data/data.mjs";
import type { VisionMode } from "#client/canvas/perception/_module.d.mts";
import type DataModel from "#common/abstract/data.mjs";
import type { TerrainData } from "#client/data/terrain-data.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;
import Token = foundry.canvas.placeables.Token;

declare namespace TokenDocument {
  /**
   * The document's name.
   */
  type Name = "Token";

  /**
   * The context used to create a `TokenDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `TokenDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `TokenDocument` document instance configured through
   * {@linkcode CONFIG.Token.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `TokenDocument` document configured through
   * {@linkcode CONFIG.Token.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "Token";
        collection: "tokens";
        label: string;
        labelPlural: string;
        isEmbedded: true;
        embedded: TokenDocument.Metadata.Embedded;
        permissions: TokenDocument.Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      ActorDelta: "delta";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create: "TOKEN_CREATE";
      update(
        user: User.Internal.Implementation,
        doc: TokenDocument.Implementation,
        data: BaseToken.UpdateData,
      ): boolean;
      delete: "TOKEN_DELETE";
    }
  }

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Scene.Implementation | null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendantName = "ActorDelta";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = ActorDelta.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = ActorDelta.ImplementationClass;

  /**
   * A document's descendants are any documents that are contained within, either within its schema
   * or its descendant's schemas.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type Descendant = DirectDescendant | ActorDelta.Descendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass | ActorDelta.DescendantClass;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  type Pack = never;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = Document.ImplementationFor<Embedded.Name>;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * Gets the collection name for an embedded document.
     */
    type CollectionNameOf<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionNameFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection document for an embedded document.
     */
    type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.DocumentFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection for an embedded document.
     */
    type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
      TokenDocument.Implementation,
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * A valid name to refer to a collection embedded in this document. For example an `Actor`
     * has the key `"items"` which contains `Item` instance which would make both `"Item" | "Items"`
     * valid keys (amongst others).
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;
  }

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `TokenDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `TokenDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<TokenDocument.Implementation>;

  /**
   * The data put in {@linkcode TokenDocument._source | TokenDocument#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode TokenDocument.create}
   * and {@linkcode TokenDocument | new TokenDocument(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode TokenDocument.create} and {@linkcode TokenDocument.createDocuments} signatures, and
   * {@linkcode TokenDocument.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode TokenDocument.create}, returning (a single | an array of) (temporary | stored)
   * `TokenDocument`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<TokenDocument.TemporaryIf<Temporary>>
      : TokenDocument.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode TokenDocument.name | TokenDocument#name}.
   *
   * This is data transformed from {@linkcode TokenDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode TokenDocument.update | TokenDocument#update}.
   * It is a distinct type from {@linkcode TokenDocument.CreateData | DeepPartial<TokenDocument.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode TokenDocument.update | TokenDocument#update} and
   * {@linkcode TokenDocument.updateDocuments} signatures, and {@linkcode TokenDocument.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * Schema definition shared by {@link foundry.data.PrototypeToken | `PrototypeToken`}.
   * Foundry technically implements this through deletion, but it's easier for us to do by extension as there are field
   * option overrides (e.g `textSearch` on `name`) that cause type issues otherwise.
   */
  interface SharedProtoSchema extends DataSchema {
    // `name` omitted here because, while it is not in the list of omitted fields for `PrototypeToken`, it's `textSearch: true` in the base schema, but overridden to `false` in `PrototypeToken`

    /**
     * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
     * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
     */
    displayName: fields.NumberField<
      {
        required: true;
        initial: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
        choices: CONST.TOKEN_DISPLAY_MODES[];
        validationError: "must be a value in CONST.TOKEN_DISPLAY_MODES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.TOKEN_DISPLAY_MODES | null | undefined,
      CONST.TOKEN_DISPLAY_MODES,
      CONST.TOKEN_DISPLAY_MODES
    >;

    /**
     * Does this Token uniquely represent a singular Actor, or is it one of many?
     * @defaultValue `false`
     */
    actorLink: fields.BooleanField;

    randomImg: fields.BooleanField;

    appendNumber: fields.BooleanField;

    prependAdjective: fields.BooleanField;

    /**
     * The width of the Token in grid units
     * @defaultValue `1`
     */
    width: fields.NumberField<{ nullable: false; positive: true; initial: 1; step: 0.5 }>;

    /**
     * The height of the Token in grid units
     * @defaultValue `1`
     */
    height: fields.NumberField<{ nullable: false; positive: true; initial: 1; step: 0.5 }>;

    /**
     * The token's texture on the canvas.
     */
    texture: TextureData<{
      initial: {
        src: () => typeof BaseToken.DEFAULT_ICON;
        anchorX: 0.5;
        anchorY: 0.5;
        fit: "contain";
        alphaThreshold: 0.75;
      };
      wildcard: true;
    }>;

    /**
     * Prevent the Token image from visually rotating?
     * @defaultValue `false`
     */
    lockRotation: fields.BooleanField;

    /**
     * The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The opacity of the token image
     * @defaultValue `1`
     */
    alpha: fields.AlphaField;

    /**
     * A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
     * @defaultValue `CONST.TOKEN_DISPOSITIONS.HOSTILE` (`-1`)
     */
    disposition: fields.NumberField<
      {
        required: true;
        choices: CONST.TOKEN_DISPOSITIONS[];
        initial: typeof CONST.TOKEN_DISPOSITIONS.HOSTILE;
        validationError: "must be a value in CONST.TOKEN_DISPOSITIONS";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.TOKEN_DISPOSITIONS | null | undefined,
      CONST.TOKEN_DISPOSITIONS,
      CONST.TOKEN_DISPOSITIONS
    >;

    /**
     * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
     * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE`
     */
    displayBars: fields.NumberField<
      {
        required: true;
        choices: CONST.TOKEN_DISPLAY_MODES[];
        initial: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
        validationError: "must be a value in CONST.TOKEN_DISPLAY_MODES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.TOKEN_DISPLAY_MODES | null | undefined,
      CONST.TOKEN_DISPLAY_MODES,
      CONST.TOKEN_DISPLAY_MODES
    >;

    /**
     * The configuration of the Token's primary resource bar
     * @defaultValue see property
     */
    bar1: fields.SchemaField<{
      /**
       * The attribute path within the Token's Actor data which should be displayed
       * @defaultValue `game?.system.primaryTokenAttribute || null`
       */
      attribute: fields.StringField<{
        required: true;
        nullable: true;
        blank: false;
        initial: () => string | null;
      }>;
    }>;

    /**
     * The configuration of the Token's secondary resource bar
     * @defaultValue see property
     */
    bar2: fields.SchemaField<{
      /**
       * The attribute path within the Token's Actor data which should be displayed
       * @defaultValue `game?.system.secondaryTokenAttribute || null`
       */
      attribute: fields.StringField<{
        required: true;
        nullable: true;
        blank: false;
        initial: () => string | null;
      }>;
    }>;

    /**
     * Configuration of the light source that this Token emits
     * @defaultValue see {@linkcode LightData}
     */
    light: fields.EmbeddedDataField<typeof LightData>;

    /**
     * Configuration of sight and vision properties for the Token
     * @defaultValue see properties
     * @privateRemarks Foundry has this split out into its own `@typedef TokenSightData`, but it's never
     * referenced outside `@typedef TokenData`, so no need for a separate interface
     */
    sight: fields.SchemaField<{
      /**
       * Should vision computation and rendering be active for this Token?
       * @defaultValue `true`, when the token's sight range is greater than 0
       */
      enabled: fields.BooleanField<{ initial: (data: unknown) => boolean }>;

      /**
       * How far in distance units the Token can see without the aid of a light source
       * @defaultValue `0`
       */
      range: fields.NumberField<{ required: true; nullable: true; min: 0; step: 0.01; initial: 0 }>;

      /**
       * An angle at which the Token can see relative to their direction of facing
       * @defaultValue `360`
       */
      angle: fields.AngleField<{ initial: 360; normalize: false }>;

      /**
       * The vision mode which is used to render the appearance of the visible area
       * @defaultValue `"basic"`
       */
      visionMode: fields.StringField<{
        required: true;
        blank: false;
        initial: "basic";
      }>;

      /**
       * A special color which applies a hue to the visible area
       * @defaultValue `null`
       */
      color: fields.ColorField;

      /**
       * A degree of attenuation which gradually fades the edges of the visible area
       * @defaultValue `0.1`
       */
      attenuation: fields.AlphaField<{
        initial: 0.1;
      }>;

      /**
       * An advanced customization for the perceived brightness of the visible area
       * @defaultValue `0`
       */
      brightness: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
      }>;

      /**
       * An advanced customization of color saturation within the visible area
       * @defaultValue `0`
       */
      saturation: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
      }>;

      /**
       * An advanced customization for contrast within the visible area
       * @defaultValue `0`
       */
      contrast: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
      }>;
    }>;

    /**
     * An array of detection modes which are available to this Token
     * @defaultValue `[]`
     * @remarks The validation function is a `BaseToken.#validateDetectionModes` reference, which throws if there's a duplicate mode ID
     */
    detectionModes: fields.ArrayField<
      fields.SchemaField<DetectionModeSchema>,
      {
        validate: () => void;
      }
    >;

    /**
     * @defaultValue see properties
     */
    occludable: fields.SchemaField<{
      /**
       * @defaultValue `0`
       */
      radius: fields.NumberField<{ required: true; nullable: false; min: 0; step: 0.01; initial: 0 }>;
    }>;

    /**
     * @defaultValue see properties
     */
    ring: fields.SchemaField<{
      /**
       * @defaultValue `false`
       */
      enabled: fields.BooleanField;

      /**
       * @defaultValue see properties
       */
      colors: fields.SchemaField<{
        /**
         * @defaultValue `null`
         */
        ring: fields.ColorField;

        /**
         * @defaultValue `null`
         */
        background: fields.ColorField;
      }>;

      /**
       * @defaultValue `1`
       */
      effects: fields.NumberField<{ required: true; initial: 1; min: 0; max: 0x7fffff; integer: true }>;

      /**
       * @defaultValue see properties
       */
      subject: fields.SchemaField<{
        /**
         * @defaultValue `1`
         */
        scale: fields.NumberField<{ required: true; nullable: false; initial: 1; min: 0.5 }>;

        /**
         * @defaultValue `null`
         */
        texture: fields.FilePathField<{ categories: ["IMAGE"] }>;
      }>;
    }>;

    turnMarker: fields.SchemaField<{
      mode: fields.NumberField<
        {
          required: true;
          choices: CONST.TOKEN_TURN_MARKER_MODES[];
          initial: typeof CONST.TOKEN_TURN_MARKER_MODES.DEFAULT;
          validationError: "must be a value in CONST.TOKEN_TURN_MARKER_MODES";
        },
        // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.TOKEN_TURN_MARKER_MODES | null | undefined,
        CONST.TOKEN_TURN_MARKER_MODES,
        CONST.TOKEN_TURN_MARKER_MODES
      >;

      animation: fields.StringField<{ required: true; blank: false; nullable: true }>;

      src: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;

      disposition: fields.BooleanField;
    }>;

    movementAction: fields.StringField<{
      required: true;
      blank: false;
      nullable: true;
      initial: null;
      choices: typeof CONFIG.Token.movement.actions;
    }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;
  }

  interface DetectionModeSchema extends DataSchema {
    /**
     * The id of the detection mode, a key from CONFIG.Canvas.detectionModes
     * @defaultValue `""`
     */
    id: fields.StringField;

    /**
     * Whether or not this detection mode is presently enabled
     * @defaultValue `true`
     */
    enabled: fields.BooleanField<{ initial: true }>;

    /**
     * The maximum range in distance units at which this mode can detect targets
     * @defaultValue `null`
     */
    range: fields.NumberField<{ required: true; min: 0; step: 0.01 }>;
  }

  interface DetectionModeData extends SchemaField.InitializedData<DetectionModeSchema> {}

  interface MeasuredMovementWaypointSchema extends DataSchema {
    /**
     * The top-left x-coordinate in pixels (integer).
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; integer: true; initial: undefined }>;

    /**
     * The top-left y-coordinate in pixels (integer).
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; integer: true; initial: undefined }>;

    /**
     * The elevation in grid units.
     * @defaultValue `undefined`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The width in grid spaces (positive).
     * @defaultValue `undefined`
     */
    width: fields.NumberField<{ required: true; nullable: false; positive: true; initial: undefined }>;

    /**
     * The height in grid spaces (positive).
     * @defaultValue `undefined`
     */
    height: fields.NumberField<{ required: true; nullable: false; positive: true; initial: undefined }>;

    /**
     * The shape type (see {@linkcode CONST.TOKEN_SHAPES}).
     * @defaultValue `undefined`
     */
    shape: fields.NumberField<
      {
        required: true;
        initial: undefined;
        choices: CONST.TOKEN_SHAPES[];
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.TOKEN_SHAPES | null | undefined,
      CONST.TOKEN_SHAPES,
      CONST.TOKEN_SHAPES
    >;

    /**
     * The movement action from the previous to this waypoint.
     * @defaultValue `undefined`
     */
    action: fields.StringField<{ required: true; blank: false; initial: undefined }>;

    /**
     * The terrain data from the previous to this waypoint.
     * @defaultValue `undefined`
     * @remarks Not technically a union, but dependent on whether `CONFIG.Token.movement?.TerrainData` exists
     */
    terrain:
      | fields.EmbeddedDataField<typeof TerrainData, { nullable: true; initial: undefined }>
      | fields.ObjectField<{ nullable: true; initial: undefined }>;

    /**
     * Was this waypoint snapped to the grid?
     * @defaultValue `undefined`
     */
    snapped: fields.BooleanField<{ initial: undefined }>;

    /**
     * Was this waypoint explicitly placed by the user?
     * @defaultValue `undefined`
     */
    explicit: fields.BooleanField<{ initial: undefined }>;

    /**
     * Is this waypoint a checkpoint?
     * @defaultValue `undefined`
     */
    checkpoint: fields.BooleanField<{ initial: undefined }>;

    /**
     * Is this waypoint intermediate?
     * @defaultValue `undefined`
     */
    intermediate: fields.BooleanField<{ initial: undefined }>;

    /**
     * The ID of the user that moved the token to from the previous to this waypoint.
     * @defaultValue `undefined`
     */
    userId: fields.ForeignDocumentField<
      typeof documents.BaseUser,
      { idOnly: true; required: true; initial: undefined }
    >;

    /**
     * The ID of the movement from the previous to this waypoint.
     * @defaultValue `undefined`
     */
    movementId: fields.StringField<{
      required: true;
      blank: false;
      initial: undefined;
      validate: (value: string) => void;
    }>;

    /**
     * The movement cost from the previous to this waypoint (nonnegative).
     * @defaultValue `undefined`
     */
    cost: fields.NumberField<{ required: true; nullable: false; min: 0; initial: undefined }>;
  }

  interface MeasuredMovementWaypoint extends SchemaField.InitializedData<MeasuredMovementWaypointSchema> {}

  interface GetCompleteMovementPathWaypoint
    extends InexactPartial<Omit<MeasuredMovementWaypoint, "userId" | "movementId" | "cost">> {}

  interface CompleteMovementWaypoint extends Omit<MeasuredMovementWaypoint, "userId" | "movementId" | "cost"> {}

  /**
   * The schema for {@linkcode TokenDocument}. This is the source of truth for how an TokenDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode TokenDocument}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends SharedProtoSchema {
    /**
     * The Token _id which uniquely identifies it within its parent Scene
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name used to describe the Token
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: true; textSearch: true }>;

    /**
     * The _id of an Actor document which this Token represents
     * @defaultValue `null`
     */
    actorId: fields.ForeignDocumentField<typeof documents.BaseActor, { idOnly: true }>;

    /**
     * The ActorDelta embedded document which stores the differences between this
     * token and the base actor it represents.
     */
    delta: ActorDeltaField<typeof documents.BaseActorDelta>;

    /**
     * The shape of the Token
     * @defaultValue `CONST.TOKEN_SHAPES.RECTANGLE_1`
     */
    shape: fields.NumberField<{ initial: typeof CONST.TOKEN_SHAPES.RECTANGLE_1; choices: CONST.TOKEN_SHAPES[] }>;

    /**
     * The x-coordinate of the top-left corner of the Token
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate of the top-left corner of the Token
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The vertical elevation of the Token, in distance units
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The z-index of this token relative to other siblings
     * @defaultValue `0`
     */
    sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * Is the Token currently locked? A locked token cannot be moved or rotated via
     * standard keyboard or mouse interaction.
     * @defaultValue `false`
     */
    locked: fields.BooleanField;

    /**
     * Is the Token currently hidden from player view?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * @remarks Foundry marked `@internal`
     */
    _movementHistory: fields.ArrayField<fields.SchemaField<MeasuredMovementWaypointSchema>>;

    /**
     * @remarks Foundry marked `@internal`
     */
    _regions: fields.ArrayField<fields.ForeignDocumentField<typeof documents.BaseRegion, { idOnly: true }>>;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `TokenDocument` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<TokenDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode TokenDocument.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `TokenDocument` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `TokenDocument` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TokenDocument.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<TokenDocument.CreateInput, TokenDocument.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode TokenDocument.create} or {@linkcode TokenDocument.createDocuments}.
     * @see {@linkcode Document.Database2.CreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `TokenDocument` documents. (see {@linkcode TokenDocument.Parent})
     * @see {@linkcode Document.Database2.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database2.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `TokenDocument` documents.
     * @see {@linkcode Document.Database2.BackendCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendCreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode TokenDocument._preCreate | TokenDocument#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateTokenDocument` hook}.
     * @see {@linkcode Document.Database2.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode TokenDocument._preCreateOperation}.
     * @see {@linkcode Document.Database2.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode TokenDocument._onCreateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnCreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode TokenDocument._onCreate | TokenDocument#_onCreate} and
     * {@link Hooks.CreateDocument | the `createTokenDocument` hook}.
     * @see {@linkcode Document.Database2.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database2.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._onCreateOperation} and `TokenDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database2.OnCreateOperation<CreateOperation> {}

    /* ***********************************************
     *              UPDATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.UpdateOperation | DatabaseUpdateOperation}
     * interface for `TokenDocument` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TokenDocument.update | TokenDocument#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation
      extends DatabaseBackend.UpdateOperation<TokenDocument.UpdateInput, TokenDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode TokenDocument.update | TokenDocument#update}.
     * @see {@linkcode Document.Database2.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database2.UpdateOneDocumentOperation<UpdateOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `TokenDocument` documents (see {@linkcode TokenDocument.Parent}). This interface is just an alias
     * for {@linkcode UpdateOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateEmbeddedOperation extends UpdateOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode TokenDocument.updateDocuments}.
     * @see {@linkcode Document.Database2.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database2.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `TokenDocument` documents.
     * @see {@linkcode Document.Database2.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database2.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._preUpdate | TokenDocument#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateTokenDocument` hook}.
     * @see {@linkcode Document.Database2.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database2.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._preUpdateOperation}.
     * @see {@linkcode Document.Database2.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database2.PreUpdateOperation<UpdateOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode TokenDocument._onUpdateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnUpdateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateDocumentsOperation extends Document.Database2.OnUpdateDocumentsOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._onUpdate | TokenDocument#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateTokenDocument` hook}.
     * @see {@linkcode Document.Database2.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database2.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._onUpdateOperation} and `TokenDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database2.OnUpdateOperation<UpdateOperation> {}

    /* ***********************************************
     *              DELETE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.DeleteOperation | DatabaseDeleteOperation}
     * interface for `TokenDocument` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TokenDocument.delete | TokenDocument#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<TokenDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode TokenDocument.delete | TokenDocument#delete}.
     * @see {@linkcode Document.Database2.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database2.DeleteOneDocumentOperation<DeleteOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `TokenDocument` documents (see {@linkcode TokenDocument.Parent}). This interface is just an alias
     * for {@linkcode DeleteOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteEmbeddedOperation extends DeleteOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode TokenDocument.deleteDocuments}.
     * @see {@linkcode Document.Database2.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database2.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `TokenDocument` documents.
     * @see {@linkcode Document.Database2.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database2.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._preDelete | TokenDocument#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteTokenDocument` hook}.
     * @see {@linkcode Document.Database2.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database2.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._preDeleteOperation}.
     * @see {@linkcode Document.Database2.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database2.PreDeleteOperation<DeleteOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode TokenDocument._onDeleteDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnDeleteDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteDocumentsOperation extends Document.Database2.OnDeleteDocumentsOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._onDelete | TokenDocument#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteTokenDocument` hook}.
     * @see {@linkcode Document.Database2.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database2.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode TokenDocument._onDeleteOperation} and `TokenDocument`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database2.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap<Temporary extends boolean | undefined = boolean | undefined> {
        GetDocumentsOperation: TokenDocument.Database2.GetDocumentsOperation;
        BackendGetOperation: TokenDocument.Database2.BackendGetOperation;
        GetOperation: TokenDocument.Database2.GetOperation;

        CreateDocumentsOperation: TokenDocument.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: TokenDocument.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: TokenDocument.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: TokenDocument.Database2.CreateOperation<Temporary>;
        PreCreateOptions: TokenDocument.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: TokenDocument.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: TokenDocument.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: TokenDocument.Database2.OnCreateOptions;
        OnCreateOperation: TokenDocument.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: TokenDocument.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: TokenDocument.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: TokenDocument.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: TokenDocument.Database2.BackendUpdateOperation;
        UpdateOperation: TokenDocument.Database2.UpdateOperation;
        PreUpdateOptions: TokenDocument.Database2.PreUpdateOptions;
        PreUpdateOperation: TokenDocument.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: TokenDocument.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: TokenDocument.Database2.OnUpdateOptions;
        OnUpdateOperation: TokenDocument.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: TokenDocument.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: TokenDocument.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: TokenDocument.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: TokenDocument.Database2.BackendDeleteOperation;
        DeleteOperation: TokenDocument.Database2.DeleteOperation;
        PreDeleteOptions: TokenDocument.Database2.PreDeleteOptions;
        PreDeleteOperation: TokenDocument.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: TokenDocument.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: TokenDocument.Database2.OnDeleteOptions;
        OnDeleteOperation: TokenDocument.Database2.OnDeleteOperation;
      }
    }

    /* ***********************************************
     *             DocsV2 DEPRECATIONS               *
     *************************************************/

    /** @deprecated Use {@linkcode GetOperation} instead. This type will be removed in v14.  */
    type Get = GetOperation;

    /** @deprecated Use {@linkcode GetDocumentsOperation} instead. This type will be removed in v14.  */
    type GetOptions = GetDocumentsOperation;

    /** @deprecated Use {@linkcode CreateOperation} instead. This type will be removed in v14.  */
    type Create<Temporary extends boolean | undefined> = CreateOperation<Temporary>;

    /** @deprecated Use {@linkcode UpdateOperation} instead. This type will be removed in v14.  */
    type Update = UpdateOperation;

    /** @deprecated Use {@linkcode DeleteOperation} instead. This type will be removed in v14.  */
    type Delete = DeleteOperation;

    // CreateDocumentsOperation didn't change purpose or name

    /** @deprecated Use {@linkcode UpdateManyDocumentsOperation} instead. This type will be removed in v14 */
    type UpdateDocumentsOperation = UpdateManyDocumentsOperation;

    /** @deprecated Use {@linkcode DeleteManyDocumentsOperation} instead. This type will be removed in v14 */
    type DeleteDocumentsOperation = DeleteManyDocumentsOperation;

    // PreCreateOptions didn't change purpose or name

    // OnCreateOptions didn't change purpose or name

    // PreCreateOperation didn't change purpose or name

    // OnCreateOperation didn't change purpose or name

    // PreUpdateOptions didn't change purpose or name

    // OnUpdateOptions didn't change purpose or name

    // PreUpdateOperation didn't change purpose or name

    // OnUpdateOperation didn't change purpose or name

    // PreDeleteOptions didn't change purpose or name

    // OnDeleteOptions didn't change purpose or name

    // PreDeleteOperation didn't change purpose or name

    // OnDeleteOperation didn't change purpose or name

    /** @deprecated Use {@linkcode OnCreateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnCreateDocumentsContext = OnCreateDocumentsOperation;

    /** @deprecated Use {@linkcode OnUpdateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnUpdateDocumentsContext = OnUpdateDocumentsOperation;

    /** @deprecated Use {@linkcode OnDeleteOptions} instead. This type will be removed in v14 */
    type DeleteOptions = OnDeleteOptions;

    /** @deprecated Use {@linkcode OnCreateOptions} instead. This type will be removed in v14 */
    type CreateOptions = OnCreateOptions;

    /** @deprecated Use {@linkcode OnUpdateOptions} instead. This type will be removed in v14 */
    type UpdateOptions = OnUpdateOptions;

    /** @deprecated Use {@linkcode OnDeleteDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type DeleteDocumentsContext = OnDeleteDocumentsOperation;

    /** @deprecated use {@linkcode CreateDocumentsOperation} instead. This type will be removed in v14. */
    type DialogCreateOptions = CreateDocumentsOperation;
  }

  /**
   * If `Temporary` is true then {@linkcode TokenDocument.Implementation}, otherwise {@linkcode TokenDocument.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? TokenDocument.Implementation : TokenDocument.Stored;

  namespace Database {
    /** Options passed along in Get operations for TokenDocuments */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<TokenDocument.Parent> {}

    /** Options passed along in Create operations for TokenDocuments */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<
        TokenDocument.CreateData,
        TokenDocument.Parent,
        Temporary
      > {}

    /** Options passed along in Delete operations for TokenDocuments */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<TokenDocument.Parent> {}

    /** Options passed along in Update operations for TokenDocuments */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<TokenDocument.UpdateData, TokenDocument.Parent> {
      previousActorId?: string | null;
      animate?: boolean;
      _priorRegions?: Record<string, string[]>;
      _priorPosition?: Record<string, { x: number; y: number; elevation: number }>;
      teleport?: boolean;
      forced?: boolean;
      // TODO: Type this accurately when going over the Token placeable
      animation: AnyObject;
    }

    /** Operation for {@linkcode TokenDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<TokenDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode TokenDocument.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<TokenDocument.Database.Update> {}

    /** Operation for {@linkcode TokenDocument.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<TokenDocument.Database.Delete> {}

    /** Operation for {@linkcode TokenDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<TokenDocument.Database.Create<Temporary>> {}

    /** Operation for {@link TokenDocument.update | `TokenDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode TokenDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link TokenDocument._preCreate | `TokenDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link TokenDocument._onCreate | `TokenDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode TokenDocument._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<TokenDocument.Database.Create> {}

    /** Operation for {@link TokenDocument._onCreateOperation | `TokenDocument#_onCreateOperation`} */
    interface OnCreateOperation extends TokenDocument.Database.Create {}

    /** Options for {@link TokenDocument._preUpdate | `TokenDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link TokenDocument._onUpdate | `TokenDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode TokenDocument._preUpdateOperation} */
    interface PreUpdateOperation extends TokenDocument.Database.Update {}

    /** Operation for {@link TokenDocument._onUpdateOperation | `TokenDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends TokenDocument.Database.Update {}

    /** Options for {@link TokenDocument._preDelete | `TokenDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link TokenDocument._onDelete | `TokenDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link TokenDocument._preDeleteOperation | `TokenDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends TokenDocument.Database.Delete {}

    /** Options for {@link TokenDocument._onDeleteOperation | `TokenDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends TokenDocument.Database.Delete {}

    /** Context for {@linkcode TokenDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<TokenDocument.Parent> {}

    /** Context for {@linkcode TokenDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<TokenDocument.Parent> {}

    /** Context for {@linkcode TokenDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<TokenDocument.Parent> {}

    /**
     * Options for {@link TokenDocument._preCreateDescendantDocuments | `TokenDocument#_preCreateDescendantDocuments`}
     * and {@link TokenDocument._onCreateDescendantDocuments | `TokenDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<TokenDocument.Database.Create> {}

    /**
     * Options for {@link TokenDocument._preUpdateDescendantDocuments | `TokenDocument#_preUpdateDescendantDocuments`}
     * and {@link TokenDocument._onUpdateDescendantDocuments | `TokenDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<TokenDocument.Database.Update> {}

    /**
     * Options for {@link TokenDocument._preDeleteDescendantDocuments | `TokenDocument#_preDeleteDescendantDocuments`}
     * and {@link TokenDocument._onDeleteDescendantDocuments | `TokenDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<TokenDocument.Database.Delete> {}

    /**
     * Create options for {@linkcode TokenDocument.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name>, CoreFlags {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  interface CoreFlags {
    core?: {
      /** @remarks If provided, will be used for any light animations emanating from this token */
      animationSeed?: number;

      /** @remarks If true, and texture.src is a video, it will jump to a random timestamp every time the token is drawn */
      randomizeVideo?: boolean;
    };
  }

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode TokenDocument.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode TokenDocument.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode TokenDocument.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode TokenDocument.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode TokenDocument.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode TokenDocument.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode TokenDocument.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends TokenDocument.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<TokenDocument.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode TokenDocument.deleteDialog | TokenDocument#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    TokenDocument.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs =
    | Document.Internal.PreCreateDescendantDocumentsArgs<
        TokenDocument.Stored,
        TokenDocument.DirectDescendantName,
        TokenDocument.Metadata.Embedded
      >
    | ActorDelta.PreCreateDescendantDocumentsArgs;

  type OnCreateDescendantDocumentsArgs =
    | Document.Internal.OnCreateDescendantDocumentsArgs<
        TokenDocument.Stored,
        TokenDocument.DirectDescendantName,
        TokenDocument.Metadata.Embedded
      >
    | ActorDelta.OnCreateDescendantDocumentsArgs;

  type PreUpdateDescendantDocumentsArgs =
    | Document.Internal.PreUpdateDescendantDocumentsArgs<
        TokenDocument.Stored,
        TokenDocument.DirectDescendantName,
        TokenDocument.Metadata.Embedded
      >
    | ActorDelta.PreUpdateDescendantDocumentsArgs;

  type OnUpdateDescendantDocumentsArgs =
    | Document.Internal.OnUpdateDescendantDocumentsArgs<
        TokenDocument.Stored,
        TokenDocument.DirectDescendantName,
        TokenDocument.Metadata.Embedded
      >
    | ActorDelta.OnUpdateDescendantDocumentsArgs;

  type PreDeleteDescendantDocumentsArgs =
    | Document.Internal.PreDeleteDescendantDocumentsArgs<
        TokenDocument.Stored,
        TokenDocument.DirectDescendantName,
        TokenDocument.Metadata.Embedded
      >
    | ActorDelta.PreDeleteDescendantDocumentsArgs;

  type OnDeleteDescendantDocumentsArgs =
    | Document.Internal.OnDeleteDescendantDocumentsArgs<
        TokenDocument.Stored,
        TokenDocument.DirectDescendantName,
        TokenDocument.Metadata.Embedded
      >
    | ActorDelta.OnDeleteDescendantDocumentsArgs;

  /* ***********************************************
   *            TOKEN-SPECIFIC TYPES               *
   *************************************************/

  // The getBarAttribute monkeypatch is simply inside the data model definition at `src/foundry/common/data/data.d.mts`

  interface PseudoActorCollection extends foundry.utils.Collection<Actor.Implementation> {
    documentClass: Actor.ImplementationClass;
  }

  /** @internal */
  type _GetBarAttributeOptions = NullishProps<{
    /**
     * An alternative attribute path to get instead of the default one
     * @defaultValue `this[barName]?.attribute`
     * @remarks If the above default returns falsey, the {@link TokenDocument.getBarAttribute | `TokenDocument#getBarAttribute`}
     * call returns `null`
     */
    alternative: string;
  }>;

  interface GetBarAttributeOptions extends _GetBarAttributeOptions {}

  interface SingleAttributeBar {
    type: "value";
    attribute: string;
    value: number;
    editable: boolean;
  }

  interface ObjectAttributeBar {
    type: "bar";
    attribute: string;
    value: number;
    max: number;
    editable: boolean;
  }

  type GetBarAttributeReturn = SingleAttributeBar | ObjectAttributeBar | null;

  /** @internal */
  type _CreateCombatantsOptions = NullishProps<{
    /**
     * A specific Combat instance which should be modified. If undefined,
     * the current active combat will be modified if one exists. Otherwise, a new
     * Combat encounter will be created if the requesting user is a Gamemaster.
     * @defaultValue `game.combats.viewed`
     */
    combat: Combat.Implementation;
  }>;

  interface CreateCombatantsOptions extends _CreateCombatantsOptions {}

  interface DeleteCombatantsOptions extends _CreateCombatantsOptions {}

  type TrackedAttributesSubject =
    | DataModel.Any
    | DataModel.AnyConstructor
    | SchemaField.Any
    | Actor.SubType
    | AnyObject
    | AnyArray;

  interface TrackedAttributesDescription {
    /** A list of property path arrays to attributes with both a value and a max property. */
    bar: string[][];

    /** A list of property path arrays to attributes that have only a value property. */
    value: string[][];
  }

  interface TrackedAttributesChoice {
    group: string;
    value: string;
    label: string;
  }

  interface ToggleCombatantOptions extends InexactPartial<TokenDocument.CreateCombatantsOptions> {
    /**
     * Require this token to be an active Combatant or to be removed.
     * Otherwise, the current combat state of the Token is toggled.
     */
    active: boolean;
  }

  type GetEmbeddedCollectionName = Embedded.CollectionName | "Actor" | "Item" | "ActiveEffect";

  type GetEmbeddedCollectionResult<Name extends GetEmbeddedCollectionName> =
    | (Name extends Document.Type ? globalThis.Collection<Document.ImplementationFor<Name>> : never)
    | (Name extends Embedded.CollectionName ? Embedded.CollectionFor<Name> : never);

  type MovementState = "completed" | "paused" | "pending" | "stopped";

  type MovementMethod = "api" | "config" | "dragging" | "keyboard" | "paste" | "undo";

  interface Position {
    /**
     * The top-left x-coordinate in pixels (integer).
     */
    x: number;

    /**
     * The top-left y-coordinate in pixels (integer).
     */
    y: number;

    /**
     * The elevation in grid units.
     */
    elevation: number;

    /**
     * The width in grid spaces (positive).
     */
    width: number;

    /**
     * The height in grid spaces (positive).
     */
    height: number;

    /**
     * The shape type (see {@link CONST.TOKEN_SHAPES}).
     */
    shape: CONST.TOKEN_SHAPES;
  }

  interface Dimensions extends Pick<Position, "width" | "height" | "shape"> {}

  interface PartialDimensions extends InexactPartial<Dimensions> {}

  interface ShapelessDimensions extends Omit<Dimensions, "shape"> {}

  interface Dimensions2D extends InexactPartial<foundry.canvas.Canvas.Point & Dimensions> {}

  interface Dimensions3D extends InexactPartial<foundry.canvas.Canvas.ElevatedPoint & Dimensions> {}

  interface ResizeOptions extends InexactPartial<Omit<TokenDocument.Database.UpdateOperation, "updates">> {}

  interface MovementWaypoint
    extends Omit<MeasuredMovementWaypoint, "terrain" | "intermediate" | "userId" | "movementId" | "cost"> {}

  interface MovementSegmentData
    extends Pick<MeasuredMovementWaypoint, "width" | "height" | "shape" | "action" | "terrain"> {
    actionConfig: CONFIG.Token.MovementActionConfig;
    teleport: boolean;
  }

  interface MovementSectionData {
    /**
     * The waypoints of the movement path
     */
    waypoints: TokenDocument.MeasuredMovementWaypoint[];

    /**
     * The distance of the movement path
     */
    distance: number;

    /**
     * The cost of the movement path
     */
    cost: number;

    /**
     * The number of spaces moved along the path
     */
    spaces: number;

    /**
     * The number of diagonals moved along the path
     */
    diagonals: number;
  }

  interface MovementHistoryData {
    /**
     * The recorded waypoints of the movement path
     */
    recorded: TokenDocument.MovementSectionData;

    /**
     * The unrecorded waypoints of the movement path
     */
    unrecorded: TokenDocument.MovementSectionData;

    /**
     * The distance of the combined movement path
     */
    distance: number;

    /**
     * The cost of the combined movement path
     */
    cost: number;

    /**
     * The number spaces of moved along the combined path
     */
    space: number;

    /**
     * The number of diagonals moved along the combined path
     */
    diagonals: number;
  }

  interface MovementContinuationHandle {
    /**
     * The movement ID
     */
    movementId: string;

    /**
     * The continuation promise
     */
    continuePromise: Promise<boolean> | undefined;
  }

  interface MovementContinuationState {
    handles: Map<string | symbol, TokenDocument.MovementContinuationHandle>;
    callbacks: Array<(continued: boolean) => void>;
    pending: Set<string>;
  }

  interface MovementContinuationData {
    /**
     * The movement ID
     */
    movementId: string;

    /**
     * The number of continuations
     */
    continueCounter: number;

    /**
     * Was continued?
     */
    continued: boolean;

    /**
     * The continuation promise
     */
    continuePromise: Promise<boolean> | null;

    /**
     * The promise to wait for before continuing movement
     */
    waitPromise: Promise<void>;

    /**
     * Resolve function of the wait promise
     */
    resolveWaitPromise: (() => void) | undefined;

    /**
     * The promise that resolves after the update workflow
     */
    postWorkflowPromise: Promise<void>;

    /**
     * The movement continuation states
     */
    states: {
      [movementId: string]: TokenDocument.MovementContinuationState;
    };
  }

  interface ConstrainOptions extends Omit<Token.ConstrainMovementPathOptions, "preview" | "history"> {}

  interface MovementData {
    /**
     * The ID of the movement
     */
    id: string;

    /**
     * The chain of prior movement IDs that this movement is a continuation of
     */
    chain: string[];

    /**
     * The origin of movement
     */
    origin: TokenDocument.Position;

    /**
     * The destination of movement
     */
    destination: TokenDocument.Position;

    /**
     * The waypoints and measurements of the passed path
     */
    passed: TokenDocument.MovementSectionData;

    /**
     * The waypoints and measurements of the pending path
     */
    pending: TokenDocument.MovementSectionData;

    /**
     * The waypoints and measurements of the history path
     */
    history: TokenDocument.MovementHistoryData;

    /**
     * Was the movement constrained?
     */
    constrained: boolean;

    /**
     * Was the movement recorded in the movement history?
     */
    recorded: boolean;

    /**
     * The method of movement
     */
    method: TokenDocument.MovementMethod;

    /**
     * The options to constrain movement
     */
    constrainOptions: ConstrainOptions;

    /**
     * Automatically rotate the token in the direction of movement?
     */
    autoRotate: boolean;

    /**
     * Show the ruler during the movement animation of the token?
     */
    showRuler: boolean;

    /**
     * The user that moved the token
     */
    user: User.Implementation;

    /**
     * The state of the movement
     */
    state: TokenDocument.MovementState;

    /**
     * The update options of the movement operation
     */
    updateOptions: Database.UpdateOperation;
  }

  interface MoveOptions extends Database.UpdateOperation {
    method: MovementMethod;
    autoRotate: boolean;
    showRuler: boolean;
    constrainOptions: ConstrainOptions;
  }

  interface MovementCostFunction extends Omit<foundry.grid.BaseGrid.MeasurePathCostFunction3D, "segment"> {
    segment: MovementSegmentData;
  }

  interface MovementCostAggregatorResult {
    from: foundry.grid.BaseGrid.Offset3D;
    to: foundry.grid.BaseGrid.Offset3D;
    cost: number;
  }

  /** Returns the aggregated cost */
  type MovementCostAggregator = (
    /**
     * The results of the cost function calls.
     * The array may be sorted but otherwise not mutated
     * @remarks marked by foundry as readonly
     */
    results: MovementCostAggregatorResult[],

    /** The distance between the grid spaces. */
    distance: number,

    /**
     * The properties of the segment
     * @remarks marked by foundry as readonly
     */
    segment: MovementSegmentData,
  ) => number;

  interface MeasureMovementPathOptions
    extends InexactPartial<{
      /**
       * The function that returns the cost for a given move between grid spaces
       * (default is the distance travelled along the direct path)
       */
      cost: MovementCostFunction;

      /**
       * The cost aggregator.
       * @defaultValue `CONFIG.Token.movement.costAggregator`
       */
      aggregator: MovementCostAggregator;
    }> {}

  interface MovementOperation extends Omit<MovementData, "user" | "state" | "updateOptions"> {}

  /**
   * The hexagonal offsets of a Token.
   */
  interface HexagonalOffsetsData {
    /**
     * The occupied offsets in an even grid in the 0th row/column
     */
    even: foundry.grid.BaseGrid.Offset2D[];

    /**
     * The occupied offsets in an odd grid in the 0th row/column
     */
    odd: foundry.grid.BaseGrid.Offset2D[];

    /**
     * The anchor in normalized coordiantes
     */
    anchor: foundry.canvas.Canvas.Point;
  }

  interface PreMovementOptions
    extends DeepReadonly<Omit<MovementOperation, "autoRotate" | "showRuler">>,
      Pick<MovementOperation, "autoRotate" | "showRuler"> {}

  interface SegmentizeMovementWaypoint
    extends InexactPartial<
      Pick<
        MeasuredMovementWaypoint,
        "x" | "y" | "elevation" | "width" | "height" | "shape" | "action" | "terrain" | "snapped"
      >
    > {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced by {@linkcode Token.ConstrainMovementPathOptions}.
   */
  type ConstrainMovementPathOptions = Token.ConstrainMovementPathOptions;
}

/**
 * The client-side Token document which extends the common BaseToken model.
 *
 * @see {@linkcode Scene}               The Scene document type which contains Token embedded documents
 * @see {@linkcode TokenConfig}      The Token configuration application
 */
declare class TokenDocument extends BaseToken.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `TokenDocument`
   * @param context - Construction context options
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: TokenDocument.CreateData, context?: TokenDocument.ConstructionContext);

  /**
   * The current movement data of this Token document.
   */
  get movement(): DeepReadonly<TokenDocument.MovementData>;

  /**
   * The movement continuation state of this Token document.
   * @internal
   * @defaultValue
   * ```js
   * {
   *   movementId: "",
   *   continueCounter: 0,
   *   continued: false,
   *   continuePromise: Promise.resolve(false),
   *   waitPromise: Promise.resolve(),
   *   resolveWaitPromise: undefined,
   *   postWorkflowPromise: Promise.resolve(),
   *   states: {}
   * }
   * ```
   */
  protected _movementContinuation: TokenDocument.MovementContinuationData;

  /**
   * A singleton collection which holds a reference to the synthetic token actor by its base actor's ID.
   * @remarks Initialized by an IIFE that makes a base-model {@linkcode Collection} and adds a `documentClass` property to it
   */
  actors: TokenDocument.PseudoActorCollection;

  /**
   * A lazily evaluated reference to the Actor this Token modifies.
   * If actorLink is true, then the document is the primary Actor document.
   * Otherwise the Actor document is a synthetic (ephemeral) document constructed using the Token's ActorDelta.
   */
  get actor(): Actor.Implementation | null;

  /**
   * A reference to the base, World-level Actor this token represents.
   */
  get baseActor(): Actor.Implementation | null;

  /**
   * An indicator for whether or not the current User has full control over this Token document.
   */
  get isOwner(): boolean;

  /**
   * A convenient reference for whether this TokenDocument is linked to the Actor it represents, or is a synthetic copy
   */
  get isLinked(): boolean;

  /**
   * Does this TokenDocument have the SECRET disposition and is the current user lacking the necessary permissions
   * that would reveal this secret?
   */
  get isSecret(): boolean;

  /**
   * Return a reference to a Combatant that represents this Token, if one is present in the current encounter.
   */
  get combatant(): Combatant.Implementation | null;

  /**
   * An indicator for whether or not this Token is currently involved in the active combat encounter.
   */
  get inCombat(): boolean;

  /**
   * The movement history
   */
  get movementHistory(): TokenDocument.MeasuredMovementWaypoint[];

  /**
   * Check if the document has a distinct subject texture (inferred or explicit).
   */
  get hasDistinctSubjectTexture(): boolean;

  /**
   * The Regions this Token is currently in.
   */
  regions: Set<RegionDocument.Implementation> | null;

  protected override _initializeSource(
    data: TokenDocument.CreateData,
    options?: Document.InitializeSourceOptions,
  ): TokenDocument.Source;

  protected override _initialize(options?: Document.InitializeOptions): void;

  override prepareBaseData(): void;

  override prepareEmbeddedDocuments(): void;

  override prepareDerivedData(): void;

  /**
   * Infer the subject texture path to use for a token ring.
   */
  protected _inferRingSubjectTexture(): string;

  /**
   * Infer the movement action.
   * The default implementation returns `CONFIG.Token.movement.defaultAction`.
   */
  protected _inferMovementAction(): string;

  /**
   * Prepare detection modes which are available to the Token.
   * Ensure that every Token has the basic sight detection mode configured.
   */
  protected _prepareDetectionModes(): void;

  /**
   * A helper method to retrieve the underlying data behind one of the Token's attribute bars
   * @param barName     - The named bar to retrieve the attribute for
   * @returns The attribute displayed on the Token bar, if any
   */
  getBarAttribute(barName: string, options?: TokenDocument.GetBarAttributeOptions): TokenDocument.GetBarAttributeReturn;

  /**
   * Test whether a Token has a specific status effect.
   * @param statusId - The status effect ID as defined in CONFIG.statusEffects
   * @returns Does the Actor of the Token have this status effect?
   */
  hasStatusEffect(statusId: string): boolean;

  /**
   * Move the Token through the given waypoint(s).
   * @param waypoints - The waypoint(s) to move the Token through
   * @param options   - Parameters of the update operation
   * @returns A Promise that resolves to true if the Token was moved, otherwise resolves to false
   */
  move(
    waypoints: InexactPartial<TokenDocument.MovementWaypoint> | InexactPartial<TokenDocument.MovementWaypoint>[],
    options?: InexactPartial<TokenDocument.MoveOptions>,
  ): Promise<boolean>;

  /**
   * Undo all recorded movement or the recorded movement corresponding to given movement ID up to the last movement.
   * The token is displaced to the prior recorded position and the movement history it rolled back accordingly.
   * @param movementId - The ID of the recorded movement to undo
   * @returns True if the movement was undone, otherwise false
   */
  revertRecordedMovement(movementId?: string): Promise<boolean>;

  /**
   * Resize the token Token such that its center point remains (almost) unchanged. The center point might change
   * slightly because the new (x, y) position is rounded.
   * @param dimensions - The new dimensions
   * @param options    - Parameters of the update operation
   * @returns A Promise that resolves to true if the Token was resized, otherwise resolves to false
   */
  resize(dimensions: TokenDocument.PartialDimensions, options?: TokenDocument.ResizeOptions): Promise<boolean>;

  /**
   * Stop the movement of this Token document. The movement cannot be continued after being stopped.
   * Only the User that initiated the movement can stop it.
   * @returns True if the movement was or is stopped, otherwise false
   */
  stopMovement(): boolean;

  /**
   * This function is called on Token documents that are still being moved by a User that just disconnected.
   * @internal
   */
  _stopMovementOnDisconnect(): void;

  /**
   * Pause the movement of this Token document. The movement can be resumed after being paused.
   *
   * Only the User that initiated the movement can pause it.
   *
   * Returns a promise that resolves to true if the movement was resumed by {@linkcode TokenDocument.resumeMovement | TokenDocument#resumeMovement}
   * with the same key that was passed to this function.
   *
   * Only after all callbacks and keys have been called the movement of the Token is resumed.
   *
   * If the callback is called within the update operation workflow, the movement is resumed after the workflow.
   * @param key - The key to resume movement with {@linkcode TokenDocument.resumeMovement | TokenDocument#resumeMovement}
   * @returns The continuation promise if the movement was paused, otherwise null
   * @example
   * ```js
   * // This is an Execute Script Region Behavior of a pressure plate that activates a trap
   * // On TOKEN_MOVE_IN...
   * if ( event.user.isSelf ) {
   *   event.data.token.pauseMovement(this.parent.uuid);
   * }
   * if ( game.user.isActiveGM ) {
   *   if ( event.data.token.rendered ) await event.data.token.object.movementAnimationPromise;
   *   const trapUuid; // The Region Behavior UUID of the trap
   *   const trapBehavior = await fromUuid(trapUuid);
   *   await trapBehavior.update({disabled: false});
   *   event.data.token.resumeMovement(event.data.movement.id, this.parent.uuid);
   * }
   * ```
   */
  pauseMovement(key?: string): (() => Promise<boolean>) | Promise<boolean> | null;

  /**
   * Resume the movement given its ID and the key that was passed to {@link foundry.documents.TokenDocument.pauseMovement | `TokenDocument#pauseMovement`}.
   * @param movementId - The movement ID
   * @param key        - The key that was passed to {@link foundry.documents.TokenDocument.pauseMovement | `TokenDocument#pauseMovement`}
   */
  resumeMovement(movementId: string, key: string): void;

  /**
   * Measure the movement path for this Token.
   * @param waypoints - The waypoints of movement
   * @param options   - Additional measurement options
   */
  measureMovementPath(
    waypoints: TokenDocument.MeasuredMovementWaypoint[],
    options?: TokenDocument.MeasureMovementPathOptions,
  ): foundry.grid.BaseGrid.MeasurePathResult;

  /**
   * Get the path of movement with the intermediate steps of the direct path between waypoints.
   * @param waypoints - The waypoints of movement
   * @returns The path of movement with all intermediate steps
   */
  getCompleteMovementPath(
    waypoints: TokenDocument.GetCompleteMovementPathWaypoint[],
  ): TokenDocument.CompleteMovementWaypoint[];

  /**
   * Add or remove this Token from a Combat encounter.
   * @param options - Additional options passed to TokenDocument.createCombatants or TokenDocument.deleteCombatants (default: `{}`)
   * @returns Is this Token now an active Combatant?
   */
  toggleCombatant(options?: TokenDocument.ToggleCombatantOptions): Promise<boolean>;

  /**
   * Create or remove Combatants for an array of provided Token objects.
   * @param tokens  - The tokens which should be added to the Combat
   * @param options - Options which modify the toggle operation (default: `{}`)
   * @returns An array of created Combatant documents
   */
  static createCombatants(
    tokens: TokenDocument.Implementation[],
    options?: TokenDocument.CreateCombatantsOptions,
  ): Promise<Combatant.Implementation[]>;

  /**
   * Remove Combatants for the array of provided Tokens.
   * @param tokens  - The tokens which should removed from the Combat
   * @param options - Options which modify the operation (default: `{}`)
   * @returns An array of deleted Combatant documents
   */
  static deleteCombatants(
    tokens: TokenDocument.Implementation[],
    options?: TokenDocument.DeleteCombatantsOptions,
  ): Promise<Combatant.Implementation[]>;

  /**
   * Convenience method to change a token vision mode.
   * @param visionMode - The vision mode to apply to this token.
   * @param defaults   - If the vision mode should be updated with its defaults. (default: `true`)
   */
  updateVisionMode(
    visionMode: VisionMode.ConfiguredModes,
    defaults?: boolean | null,
  ): Promise<TokenDocument.Implementation | undefined>;

  /**
   * @remarks Foundry specifically overrides this method such that unlinked `TokenDocument` instances
   * handles 3 extra cases:
   * - Passing `"Actor"` returns `this.actors`.
   * - Passing `"Item"` returns `this.actor.items`.
   * - Passing `"ActiveEffect"` returns `this.actor.effects`.
   */
  override getEmbeddedCollection<EmbeddedName extends TokenDocument.GetEmbeddedCollectionName>(
    embeddedName: EmbeddedName,
  ): TokenDocument.GetEmbeddedCollectionResult<EmbeddedName>;

  // _onCreate, _preUpdate, _onUpdate, _onDelete, _preCreateOperation, _preUpdateOperation, _onCreateOperation,
  // _onUpdateOperation, _onDeleteOperation are all overridden but with no signature changes from their definition in BaseToken.

  /**
   *
   * @param changes - The changes that will be applied to this Token
   * @returns The Region IDs this Token is in after changes ar applied (sorted)
   * @internal
   */
  protected _identifyRegions(changes?: TokenDocument.UpdateData): string[];

  /**
   * Reject the movement or modify the update operation as needed based on the movement.
   * Called after the movement for this document update has been determined.
   * The waypoints of movement are final and cannot be changed. The movement can only be rejected entirely.
   * @param movement  - The pending movement of this Token
   * @param operation - The update operation
   * @returns If false, the movement is prevented
   * @remarks default implementation does nothing
   */
  protected _preUpdateMovement(
    movement: TokenDocument.PreMovementOptions,
    operation: TokenDocument.Database.UpdateOperation,
  ): Promise<boolean | void>;

  /**
   * Post-process an update operation of a movement.
   * @param movement  - The movement of this Token
   * @param operation - The update operation
   * @param user      - The User that requested the update operation
   * @remarks default implementation does nothing, foundry marked `movement` as readonly
   */
  protected _onUpdateMovement(
    movement: TokenDocument.MovementOperation,
    operation: TokenDocument.Database.UpdateOperation,
    user: User.Implementation,
  ): void;

  /**
   * Called when the current movement is stopped.
   */
  protected _onMovementStopped(): void;

  /**
   * Called when the current movement is paused.
   */
  protected _onMovementPaused(): void;

  /**
   * Called when the movement is recorded or cleared.
   */
  protected _onMovementRecorded(): void;

  /**
   * Add deprecated getters for the teleport and forced option.
   * @internal
   * @deprecated since v13
   */
  protected static _addTeleportAndForcedShims(operation: TokenDocument.Database.UpdateOperation): void;

  /**
   * Are these changes moving the Token?
   * OR
   * Are these changes moving the Token from the given origin?
   * @param changes - The (candidate) changes
   * @param origin  - The origin
   * @returns Is movement?
   * @internal
   */
  protected static _isMovementUpdate(changes: TokenDocument.UpdateData, origin?: TokenDocument.Position): boolean;

  /**
   * Should the movement of this Token update be recorded in the movement history?
   * Called as part of the preUpdate workflow if the Token is moved.
   * @returns Should the movement of this Token update be recorded in the movement history?
   */
  protected _shouldRecordMovementHistory(): boolean;

  /**
   * Clear the movement history of this Token.
   */
  clearMovementHistory(): Promise<void>;

  /**
   * Is to Token document updated such that the Regions the Token is contained in may change?
   * Called as part of the preUpdate workflow.
   * @param changes - The changes.
   * @returns Could this Token update change Region containment?
   */
  protected _couldRegionsChange(changes: TokenDocument.UpdateData): boolean;

  /**
   * Test whether the Token is inside the Region.
   * This function determines the state of {@linkcode TokenDocument.regions | TokenDocument#regions} and
   * {@linkcode foundry.documents.RegionDocument.tokens | foundry.documents.RegionDocument#tokens}.
   * The Token and the Region must be in the same Scene.
   *
   * Implementations of this function are restricted in the following ways:
   *   - If the bounds (given by {@link TokenDocument#getSize}) of the Token do not intersect the
   *     Region, then the Token is not contained within the Region.
   *   - If the Token is inside the Region a particular elevation, then the Token is inside the Region at any elevation
   *     within the elevation range of the Region.
   *   - This function must not use prepared field values that are animated. In particular, it must use the source
   *     instead of prepared values of the following fields: `x`, `y`, `elevation`, `width`, `height`, and `shape`.
   *
   * If this function is overridden, then {@link TokenDocument#segmentizeRegionMovementPath} must be
   * overridden too.
   *
   * If an override of this function uses Token document fields other than `x`, `y`, `elevation`, `width`, `height`, and
   * `shape`, {@link TokenDocument#_couldRegionsChange} must be overridden to return true for changes
   * of these fields. If an override of this function uses non-Token properties other than `Scene#grid.type` and
   * `Scene#grid.size`,
   * {@link foundry.documents.Scene#updateTokenRegions} must be called when any of those properties change.
   * @param region - The region.
   * @param data   - The position and dimensions. Defaults to the values of the document source.
   * @returns Is inside the Region?
   */
  testInsideRegion(region: RegionDocument.Implementation, data?: TokenDocument.Dimensions3D): boolean;

  /**
   * Split the Token movement path through the Region into its segments.
   * The Token and the Region must be in the same Scene.
   *
   * Implementations of this function are restricted in the following ways:
   *   - The segments must go through the waypoints.
   *   - The *from* position matches the *to* position of the succeeding segment.
   *   - The Token must be contained (w.r.t. {@linkcode TokenDocument.testInsideRegion | `TokenDocument#testInsideRegion`}) within the Region
   *     at the *from* and *to* of MOVE segments.
   *   - The Token must be contained (w.r.t. {@linkcode TokenDocument.testInsideRegion | `TokenDocument#testInsideRegion`}) within the Region
   *     at the *to* position of ENTER segments.
   *   - The Token must be contained (w.r.t. {@linkcode TokenDocument.testInsideRegion | `TokenDocument#testInsideRegion`}) within the Region
   *     at the *from* position of EXIT segments.
   *   - The Token must not be contained (w.r.t. {@linkcode TokenDocument.testInsideRegion | `TokenDocument#testInsideRegion`}) within the
   *     Region at the *from* position of ENTER segments.
   *   - The Token must not be contained (w.r.t. {@linkcode TokenDocument.testInsideRegion | `TokenDocument#testInsideRegion`}) within the
   *     Region at the *to* position of EXIT segments.
   *   - This function must not use prepared field values that are animated. In particular, it must use the source
   *     instead of prepared values of the following fields: `x`, `y`, `elevation`, `width`, `height`, and `shape`.
   * @param region    - The region
   * @param waypoints - The waypoints of movement
   * @returns The movement split into its segments
   */
  segmentizeRegionMovementPath(
    region: RegionDocument.Implementation,
    waypoints: TokenDocument.SegmentizeMovementWaypoint[],
  ): RegionDocument.MovementSegment[];

  protected override _preCreateDescendantDocuments(...args: ActorDelta.PreCreateDescendantDocumentsArgs): void;

  protected override _onCreateDescendantDocuments(...args: ActorDelta.OnCreateDescendantDocumentsArgs): void;

  protected override _preUpdateDescendantDocuments(...args: ActorDelta.PreUpdateDescendantDocumentsArgs): void;

  protected override _onUpdateDescendantDocuments(...args: TokenDocument.OnUpdateDescendantDocumentsArgs): void;

  protected override _preDeleteDescendantDocuments(...args: TokenDocument.PreDeleteDescendantDocumentsArgs): void;

  protected override _onDeleteDescendantDocuments(...args: TokenDocument.OnDeleteDescendantDocumentsArgs): void;

  /**
   * When the base Actor for a TokenDocument changes, we may need to update its Actor instance
   * @remarks After updating the synthetic actor, forwards to {@link TokenDocument._onRelatedUpdate | `TokenDocument#_onRelatedUpdate`}
   */
  protected _onUpdateBaseActor(update?: Actor.UpdateData, options?: Actor.Database.OnUpdateOperation): void;

  /**
   * Whenever the token's actor delta changes, or the base actor changes, perform associated refreshes.
   * @param update  - The update delta.
   * @param options - The options provided to the update.
   */
  protected _onRelatedUpdate(
    update?: Actor.UpdateData | ActorDelta.UpdateData,

    /**
     * @privateRemarks foundry calls this field operation
     * but it's being passed options (and then ignores them)
     */
    operation?: Actor.Database.OnUpdateOperation,
  ): void;

  /**
   * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
   * @param data  - The object to explore for attributes, or an Actor type.
   * @param _path - (default: `[]`)
   */
  // TODO: There's some very complex handling for non-datamodel Actor system implementations if we want
  static getTrackedAttributes(
    data?: TokenDocument.TrackedAttributesSubject | null,
    _path?: string[],
  ): TokenDocument.TrackedAttributesDescription;

  /**
   * Retrieve an Array of attribute choices from a plain object.
   * @param schema - The schema to explore for attributes.
   */
  protected static _getTrackedAttributesFromObject(
    data: AnyObject | AnyArray,
    _path?: string[],
  ): TokenDocument.TrackedAttributesDescription;

  /**
   * Retrieve an Array of attribute choices from a SchemaField.
   * @param schema - The schema to explore for attributes.
   */
  protected static _getTrackedAttributesFromSchema(
    schema: SchemaField.Any,
    _path?: string[],
  ): TokenDocument.TrackedAttributesDescription;

  /**
   * Retrieve any configured attributes for a given Actor type.
   * @param type - The Actor type.
   * @remarks If `type` is invalid, or doesn't have an entry in {@linkcode CONFIG.Actor.trackableAttributes}, returns the merged
   * tracked attributes of all types. If no types have any configured, returns `void`
   */
  static _getConfiguredTrackedAttributes(
    type?: Actor.SubType | null,
  ): TokenDocument.TrackedAttributesDescription | void;

  /**
   * Inspect the Actor data model and identify the set of attributes which could be used for a Token Bar
   * @param attributes - The tracked attributes which can be chosen from (default: `this.getTrackedAttributes()`)
   * @returns A nested object of attribute choices to display
   */
  static getTrackedAttributeChoices(
    attributes?: TokenDocument.TrackedAttributesDescription | null,
  ): TokenDocument.TrackedAttributesChoice[];

  /**
   * A helper function to toggle a status effect which includes an Active Effect template
   * @param effectData - The Active Effect data, including statusId
   * @param options    - Options to configure application of the Active Effect
   *                     (default: `{}`)
   * @returns Whether the Active Effect is now on or off
   * @deprecated since v12
   * @remarks "`TokenDocument#toggleActiveEffect` is deprecated in favor of {@link Actor.toggleStatusEffect | `Actor#toggleStatusEffect`}"
   */
  toggleActiveEffect(effectData: CONFIG.StatusEffect, options?: Actor.ToggleStatusEffectOptions): Promise<boolean>;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  static override defaultName(context?: TokenDocument.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends TokenDocument.CreateDialogOptions | undefined = undefined,
  >(
    data?: TokenDocument.CreateDialogData,
    createOptions?: TokenDocument.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<TokenDocument.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode TokenDocument.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends TokenDocument.CreateDialogOptions | undefined = undefined,
  >(
    data: TokenDocument.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: TokenDocument.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<TokenDocument.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: TokenDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<TokenDocument.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: TokenDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<TokenDocument.DeleteDialogReturn<Options>>;

  static override fromDropData(data: TokenDocument.DropData): Promise<TokenDocument.Implementation | undefined>;

  static override fromImport(
    source: TokenDocument.Source,
    context?: Document.FromImportContext<TokenDocument.Parent> | null,
  ): Promise<TokenDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // TODO: The deprecated Embedded Document Operations

  #TokenDocument: true;
}

export default TokenDocument;
