import type { AnyObject, DeepPartial, InexactPartial, InterfaceToObject, Merge } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields, LightData, TextureData } from "../../../common/data/module.d.mts";
import type { ActorDeltaField } from "../../../common/documents/token.d.mts";
import type BaseToken from "../../../common/documents/token.d.mts";

declare global {
  namespace TokenDocument {
    /**
     * The document's name.
     */
    type Name = "Token";

    /**
     * The arguments to construct the document.
     */
    interface ConstructorArgs extends Document.ConstructorParameters<CreateData, Parent> {}

    /**
     * The documents embedded within Token.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the TokenDocument document instance configured through `CONFIG.Token.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredTokenDocument | `fvtt-types/configuration/ConfiguredTokenDocument`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the TokenDocument document configured through `CONFIG.Token.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
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
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all instances, or never if the document doesn't have any descendants.
     */
    type Descendants = ActorDelta.Stored | ActorDelta.Descendants;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClasses = ActorDelta.ImplementationClass | ActorDelta.DescendantClasses;

    /**
     * The valid `parent` entries for descendant document operations.
     * This includes the current document as well as any descendants that have descendants.
     */
    type DescendantParents = Stored | ActorDelta.DescendantParents;

    /**
     * Types of CompendiumCollection this document might be contained in.
     * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
     */
    type Pack = CompendiumCollection.ForDocument<"Scene">;

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
      // TODO(LukeAbby): There's a circularity. Should be `Document.Embedded.CollectionDocumentFor<Metadata.Embedded, CollectionName>`
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Any;

      /**
       * Gets the collection for an embedded document.
       */
      type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
        // TODO(LukeAbby): This should be `TokenDocument.Implementation` but this causes a circularity.
        Document.Any,
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
     * An instance of `TokenDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<TokenDocument.Implementation> {}

    /**
     * The data put in {@link TokenDocument._source | `TokenDocument#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link TokenDocument._source | `TokenDocument#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link TokenDocument.create | `TokenDocument.create`}
     * and {@link TokenDocument | `new TokenDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link TokenDocument.name | `TokenDocument#name`}.
     *
     * This is data transformed from {@link TokenDocument.Source | `TokenDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link TokenDocument.update | `TokenDocument#update`}.
     * It is a distinct type from {@link TokenDocument.CreateData | `DeepPartial<TokenDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * Schema definition shared by {@link foundry.data.PrototypeToken | `PrototypeToken`}.
     * Foundry technically implements this through deletion, but it's easier for us to do by extension as there are field
     * option overrides (e.g `textSearch` on `name`) that cause type issues otherwise.
     */
    interface SharedProtoSchema extends DataSchema {
      // `name` omitted here because, while it is not in the list of omitted fields for `PrototypeToken`, it's `textSearch: true` in the base schema, but overridden to `false` in `PrototypeToken`

      /**
       * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
       * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE` (`0`)
       */
      displayName: fields.NumberField<
        {
          required: true;
          initial: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
          choices: CONST.TOKEN_DISPLAY_MODES[];
          validationError: "must be a value in CONST.TOKEN_DISPLAY_MODES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.TOKEN_DISPLAY_MODES | null | undefined,
        CONST.TOKEN_DISPLAY_MODES,
        CONST.TOKEN_DISPLAY_MODES
      >;

      /**
       * Does this Token uniquely represent a singular Actor, or is it one of many?
       * @defaultValue `false`
       */
      actorLink: fields.BooleanField;

      appendNumber: fields.BooleanField;

      prependAdjective: fields.BooleanField;

      /**
       * The width of the Token in grid units
       * @defaultValue `1`
       */
      width: fields.NumberField<{ nullable: false; positive: true; initial: 1; step: 0.5; label: "Width" }>;

      /**
       * The height of the Token in grid units
       * @defaultValue `1`
       */
      height: fields.NumberField<{ nullable: false; positive: true; initial: 1; step: 0.5; label: "Height" }>;

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
       * @defaultValue `CONST.TOKEN_HEXAGONAL_SHAPES.ELLIPSE_1` (`0`)
       */
      hexagonalShape: fields.NumberField<
        {
          initial: typeof CONST.TOKEN_HEXAGONAL_SHAPES.ELLIPSE_1;
          choices: CONST.TOKEN_HEXAGONAL_SHAPES[];
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.TOKEN_HEXAGONAL_SHAPES | null | undefined,
        CONST.TOKEN_HEXAGONAL_SHAPES,
        CONST.TOKEN_HEXAGONAL_SHAPES
      >;

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
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.TOKEN_DISPOSITIONS | null | undefined,
        CONST.TOKEN_DISPOSITIONS,
        CONST.TOKEN_DISPOSITIONS
      >;

      /**
       * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
       * @defaultValue `CONST.TOKEN_DISPLAY_MODES.NONE` (`0`)
       */
      displayBars: fields.NumberField<
        {
          required: true;
          choices: CONST.TOKEN_DISPLAY_MODES[];
          initial: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
          validationError: "must be a value in CONST.TOKEN_DISPLAY_MODES";
        },
        //FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
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
       * @defaultValue see {@link LightData | `LightData`}
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
          label: "TOKEN.VisionMode";
          hint: "TOKEN.VisionModeHint";
        }>;

        /**
         * A special color which applies a hue to the visible area
         * @defaultValue `null`
         */
        color: fields.ColorField<{ label: "TOKEN.VisionColor" }>;

        /**
         * A degree of attenuation which gradually fades the edges of the visible area
         * @defaultValue `0.1`
         */
        attenuation: fields.AlphaField<{
          initial: 0.1;
          label: "TOKEN.VisionAttenuation";
          hint: "TOKEN.VisionAttenuationHint";
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
          label: "TOKEN.VisionBrightness";
          hint: "TOKEN.VisionBrightnessHint";
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
          label: "TOKEN.VisionSaturation";
          hint: "TOKEN.VisionSaturationHint";
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
          label: "TOKEN.VisionContrast";
          hint: "TOKEN.VisionContrastHint";
        }>;
      }>;

      /**
       * An array of detection modes which are available to this Token
       * @defaultValue `[]`
       * @remarks The validation function is a `BaseToken.#validateDetectionModes` reference, which throws if there's a duplicate mode ID
       */
      detectionModes: fields.ArrayField<
        fields.SchemaField<{
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
        }>,
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
        radius: fields.NumberField<{ nullable: false; min: 0; step: 0.01; initial: 0 }>;
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
        effects: fields.NumberField<{ initial: 1; min: 0; max: 0x7fffff; integer: true }>;

        /**
         * @defaultValue see properties
         */
        subject: fields.SchemaField<{
          /**
           * @defaultValue `1`
           */
          scale: fields.NumberField<{ initial: 1; min: 0.5 }>;

          /**
           * @defaultValue `null`
           */
          texture: fields.FilePathField<{ categories: ["IMAGE"] }>;
        }>;
      }>;

      /**
       * @remarks Foundry marked `@internal`
       */
      _regions: fields.ArrayField<fields.ForeignDocumentField<typeof documents.BaseRegion, { idOnly: true }>>;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name, InterfaceToObject<CoreFlags>>;
    }

    /**
     * The schema for {@link TokenDocument | `TokenDocument`}. This is the source of truth for how an TokenDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link TokenDocument | `TokenDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
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
      delta: ActorDeltaField<typeof documents.BaseActor>;

      /**
       * The x-coordinate of the top-left corner of the Token
       * @defaultValue `0`
       */
      x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

      /**
       * The y-coordinate of the top-left corner of the Token
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

      /**
       * The vertical elevation of the Token, in distance units
       * @defaultValue `0`
       */
      elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

      /**
       * Is the Token currently locked? A locked token cannot be moved or rotated via
       * standard keyboard or mouse interaction.
       * @defaultValue `false`
       */
      locked: fields.BooleanField;

      /**
       * The z-index of this token relative to other siblings
       * @defaultValue `0`
       */
      sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

      /**
       * Is the Token currently hidden from player view?
       * @defaultValue `false`
       */
      hidden: fields.BooleanField;
    }

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

      /** Operation for {@link TokenDocument.createDocuments | `TokenDocument.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<TokenDocument.Database.Create<Temporary>> {}

      /** Operation for {@link TokenDocument.updateDocuments | `TokenDocument.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<TokenDocument.Database.Update> {}

      /** Operation for {@link TokenDocument.deleteDocuments | `TokenDocument.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<TokenDocument.Database.Delete> {}

      /** Operation for {@link TokenDocument.create | `TokenDocument.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<TokenDocument.Database.Create<Temporary>> {}

      /** Operation for {@link TokenDocument.update | `TokenDocument#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link TokenDocument.get | `TokenDocument.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link TokenDocument._preCreate | `TokenDocument#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link TokenDocument._onCreate | `TokenDocument#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link TokenDocument._preCreateOperation | `TokenDocument._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<TokenDocument.Database.Create> {}

      /** Operation for {@link TokenDocument._onCreateOperation | `TokenDocument#_onCreateOperation`} */
      interface OnCreateOperation extends TokenDocument.Database.Create {}

      /** Options for {@link TokenDocument._preUpdate | `TokenDocument#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link TokenDocument._onUpdate | `TokenDocument#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link TokenDocument._preUpdateOperation | `TokenDocument._preUpdateOperation`} */
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

      /** Context for {@link TokenDocument._onDeleteOperation | `TokenDocument._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<TokenDocument.Parent> {}

      /** Context for {@link TokenDocument._onCreateDocuments | `TokenDocument._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<TokenDocument.Parent> {}

      /** Context for {@link TokenDocument._onUpdateDocuments | `TokenDocument._onUpdateDocuments`} */
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
    }

    interface CoreFlags {
      core?: {
        /** @remarks If provided, will be used for any light animations emanating from this token */
        animationSeed?: number;

        /** @remarks If true, and texture.src is a video, it will jump to a random timestamp every time the token is drawn */
        randomizeVideo?: boolean;
      };
    }

    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      type Scope = Document.FlagKeyOf<Flags>;
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    /**
     * @deprecated {@link TokenDocument.Database | `TokenDocument.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<TokenDocument> {}

    /**
     * @deprecated {@link TokenDocument.CreateData | `TokenDocument.CreateData`}
     */
    interface ConstructorData extends TokenDocument.CreateData {}

    /**
     * @deprecated {@link TokenDocument.implementation | `TokenDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link TokenDocument.Implementation | `TokenDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;

    // The getBarAttribute monkeypatch is simply inside the data model definition at `src\foundry\common\data\data.d.mts`

    interface TrackedAttributesDescription {
      /** A list of property path arrays to attributes with both a value and a max property. */
      bar: string[][];
      /** A list of property path arrays to attributes that have only a value property. */
      value: string[][];
    }

    interface CreateCombatantOptions {
      /**
       * A specific Combat instance which should be modified. If undefined,
       * the current active combat will be modified if one exists. Otherwise, a new
       * Combat encounter will be created if the requesting user is a Gamemaster.
       */
      combat?: Combat | undefined;
    }

    interface ToggleCombatantOptions extends InexactPartial<TokenDocument.CreateCombatantOptions> {
      /**
       * Require this token to be an active Combatant or to be removed.
       * Otherwise, the current combat state of the Token is toggled.
       */
      active: boolean;
    }
  }

  /**
   * The client-side Token document which extends the common BaseToken model.
   *
   * @see {@link Scene | `Scene`}               The Scene document type which contains Token embedded documents
   * @see {@link TokenConfig | `TokenConfig`}      The Token configuration application
   */
  class TokenDocument extends CanvasDocumentMixin(foundry.documents.BaseToken) {
    /**
     * @param data    - Initial data from which to construct the `TokenDocument`
     * @param context - Construction context options
     */
    constructor(...args: TokenDocument.ConstructorArgs);

    /**
     * A singleton collection which holds a reference to the synthetic token actor by its base actor's ID.
     */
    actors(): Collection<Actor.Implementation>;

    /**
     * A lazily evaluated reference to the Actor this Token modifies.
     * If actorLink is true, then the document is the primary Actor document.
     * Otherwise the Actor document is a synthetic (ephemeral) document constructed using the Token's ActorDelta.
     */
    get actor(): Actor.Implementation | null;

    /**
     * A reference to the base, World-level Actor this token represents.
     */
    get baseActor(): Actor | undefined;

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
     * The Regions this Token is currently in.
     */
    regions: Set<RegionDocument.Implementation> | null;

    // TODO: Same as `DataModel._initialize`
    protected override _initialize(options?: any): void;

    override prepareBaseData(): void;

    override prepareEmbeddedDocuments(): void;

    override prepareDerivedData(): void;

    /**
     * Infer the subject texture path to use for a token ring.
     */
    protected _inferRingSubjectTexture(): string;

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
    getBarAttribute(
      barName: string,
      options?: InexactPartial<{
        /**
         * An alternative attribute path to get instead of the default one
         */
        alternative: string;
      }>,
    ): SingleAttributeBar | ObjectAttributeBar | null;

    /**
     * Test whether a Token has a specific status effect.
     * @param statusId - The status effect ID as defined in CONFIG.statusEffects
     * @returns Does the Actor of the Token have this status effect?
     */
    hasStatusEffect(statusId: string): boolean;

    /**
     * Add or remove this Token from a Combat encounter.
     * @param options - Additional options passed to TokenDocument.createCombatants or
     *                  TokenDocument.deleteCombatants
     *                  Default: `{}`
     *  @returns Is this Token now an active Combatant?
     */
    toggleCombatant({ active, ...options }?: TokenDocument.ToggleCombatantOptions): Promise<boolean>;

    /**
     * Create or remove Combatants for an array of provided Token objects.
     * @param tokens  - The tokens which should be added to the Combat
     * @param options - Options which modify the toggle operation
     *                  Default: `{}`
     * @returns An array of created Combatant documents
     */
    static createCombatants(
      tokens: TokenDocument[],
      options?: TokenDocument.CreateCombatantOptions,
    ): Promise<Combatant.Implementation[]>;

    /**
     * Remove Combatants for the array of provided Tokens.
     * @param tokens  - The tokens which should removed from the Combat
     * @param options - Options which modify the operation
     *                  Default: `{}`
     * @returns An array of deleted Combatant documents
     */
    static deleteCombatants(
      tokens: TokenDocument[],
      options?: TokenDocument.CreateCombatantOptions,
    ): Promise<Combatant.Implementation[]>;

    /**
     * Convenience method to change a token vision mode.
     * @param visionMode - The vision mode to apply to this token.
     * @param defaults   - If the vision mode should be updated with its defaults.
     *                     Default = `true`
     */
    updateVisionMode(
      visionMode: typeof CONFIG.Canvas.visionModes,
      defaults?: boolean,
    ): Promise<ReturnType<this["update"]>>;

    override getEmbeddedCollection<EmbeddedName extends TokenDocument.Embedded.CollectionName>(
      embeddedName: EmbeddedName,
    ): TokenDocument.Embedded.CollectionFor<EmbeddedName>;

    /**
     * @privateRemarks _onCreate, _preUpdate, _onUpdate, _onDelete, preCreateOperation, _preUpdateOperation, _onCreateOperation,
     * _onUpdateOperation, _onDeleteOperation are all overridden but with no signature changes from their definition in BaseToken.
     */

    protected override _preCreateDescendantDocuments<
      DescendantDocumentType extends TokenDocument.DescendantClasses,
      Parent extends TokenDocument.DescendantParents,
      CreateData extends Document.CreateDataFor<DescendantDocumentType>,
      Operation extends foundry.abstract.types.DatabaseCreateOperation<CreateData, Parent, false>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      data: CreateData[],
      options: Document.Database.CreateOptions<Operation>,
      userId: string,
    ): void;

    protected override _onCreateDescendantDocuments<
      DescendantDocumentType extends TokenDocument.DescendantClasses,
      Parent extends TokenDocument.DescendantParents,
      CreateData extends Document.CreateDataFor<DescendantDocumentType>,
      Operation extends foundry.abstract.types.DatabaseCreateOperation<CreateData, Parent, false>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      documents: InstanceType<DescendantDocumentType>,
      data: CreateData[],
      options: Document.Database.CreateOptions<Operation>,
      userId: string,
    ): void;

    protected override _preUpdateDescendantDocuments<
      DescendantDocumentType extends TokenDocument.DescendantClasses,
      Parent extends TokenDocument.DescendantParents,
      UpdateData extends Document.UpdateDataFor<DescendantDocumentType>,
      Operation extends foundry.abstract.types.DatabaseUpdateOperation<UpdateData, Parent>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      changes: UpdateData[],
      options: Document.Database.UpdateOptions<Operation>,
      userId: string,
    ): void;

    protected override _onUpdateDescendantDocuments<
      DescendantDocumentType extends TokenDocument.DescendantClasses,
      Parent extends TokenDocument.DescendantParents,
      UpdateData extends Document.UpdateDataFor<DescendantDocumentType>,
      Operation extends foundry.abstract.types.DatabaseUpdateOperation<UpdateData, Parent>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      documents: InstanceType<DescendantDocumentType>,
      changes: UpdateData[],
      options: Document.Database.UpdateOptions<Operation>,
      userId: string,
    ): void;

    protected _preDeleteDescendantDocuments<
      DescendantDocumentType extends TokenDocument.DescendantClasses,
      Parent extends TokenDocument.DescendantParents,
      Operation extends foundry.abstract.types.DatabaseDeleteOperation<Parent>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      ids: string[],
      options: Document.Database.DeleteOptions<Operation>,
      userId: string,
    ): void;

    protected _onDeleteDescendantDocuments<
      DescendantDocumentType extends TokenDocument.DescendantClasses,
      Parent extends TokenDocument.DescendantParents,
      Operation extends foundry.abstract.types.DatabaseDeleteOperation<Parent>,
    >(
      parent: Parent,
      collection: DescendantDocumentType["metadata"]["collection"],
      documents: InstanceType<DescendantDocumentType>,
      ids: string[],
      options: Document.Database.DeleteOptions<Operation>,
      userId: string,
    ): void;

    /**
     * Is to Token document updated such that the Regions the Token is contained in may change?
     * Called as part of the preUpdate workflow.
     * @param changes - The changes.
     * @returns Could this Token update change Region containment?
     */
    protected _couldRegionsChange(changes: Token.UpdateData): boolean;

    /**
     * When the base Actor for a TokenDocument changes, we may need to update its Actor instance
     */
    protected _onUpdateBaseActor(
      update?: DeepPartial<Actor.Implementation["_source"]>,
      options?: Actor.Database.OnUpdateOperation,
    ): void;

    /**
     * Whenever the token's actor delta changes, or the base actor changes, perform associated refreshes.
     * @param update  - The update delta.
     * @param options - The options provided to the update.
     */
    protected _onRelatedUpdate(
      update?: DeepPartial<Actor.Implementation["_source"]>,
      /**
       * @privateRemarks foundry calls this field operation
       * but it's being passed options (and then ignores them)
       */
      operation?: Actor.Database.OnUpdateOperation,
    ): void;

    /**
     * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
     * @param _path - (default: `[]`)
     */
    // TODO: There's some very complex handling for non-datamodel Actor system implementations if we want
    static getTrackedAttributes(
      data?: Actor.Implementation["system"],
      _path?: string[],
    ): TokenDocument.TrackedAttributesDescription;

    /**
     * Retrieve an Array of attribute choices from a plain object.
     * @param schema - The schema to explore for attributes.
     */
    protected static _getTrackedAttributesFromObject(
      data: object,
      _path?: string[],
    ): TokenDocument.TrackedAttributesDescription;

    /**
     * Retrieve an Array of attribute choices from a SchemaField.
     * @param schema - The schema to explore for attributes.
     */
    protected static _getTrackedAttributesFromSchema(
      schema: foundry.data.fields.SchemaField.Any,
      _path?: string[],
    ): TokenDocument.TrackedAttributesDescription;

    /**
     * Retrieve any configured attributes for a given Actor type.
     * @param type - The Actor type.
     */
    static _getConfiguredTrackedAttributes(type: string): TokenDocument.TrackedAttributesDescription | void;

    /**
     * Inspect the Actor data model and identify the set of attributes which could be used for a Token Bar
     * @param attributes - The tracked attributes which can be chosen from
     * @returns A nested object of attribute choices to display
     */
    static getTrackedAttributeChoices(
      attributes?: TokenDocument.TrackedAttributesDescription,
    ): Record<string, string[]>;

    /**
     * @deprecated since v11
     * @remarks `"TokenDocument#getActor has been deprecated. Please use the`
     * `TokenDocument#actor getter to retrieve the Actor instance that the TokenDocument represents, or use`
     * `TokenDocument#delta#apply to generate a new synthetic Actor instance."`
     */
    getActor(): Actor.Implementation;

    /**
     * @deprecated since v11
     */
    get actorData(): this["delta"]["_source"];

    /**
     * @deprecated since v11
     */
    set actorData(actorData: this["delta"]["_source"]);

    /**
     * A helper function to toggle a status effect which includes an Active Effect template
     * @param effectData - The Active Effect data, including statusId
     * @param options    - Options to configure application of the Active Effect
     *                     (default: `{}`)
     * @returns Whether the Active Effect is now on or off
     * @deprecated since v12
     * @remarks `TokenDocument#toggleActiveEffect is deprecated in favor of Actor#toggleStatusEffect"`
     */
    toggleActiveEffect(
      effectData: CONFIG.StatusEffect,
      options?: InexactPartial<ToggleActiveEffectOptions>,
    ): Promise<boolean>;

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

    static override defaultName(
      context: Document.DefaultNameContext<"base", NonNullable<TokenDocument.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<TokenDocument.CreateData>,
      context: Document.CreateDialogContext<string, NonNullable<TokenDocument.Parent>>,
    ): Promise<TokenDocument.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<TokenDocument.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<TokenDocument.Implementation | undefined>;

    static override fromImport(
      source: TokenDocument.Source,
      context?: Document.FromImportContext<TokenDocument.Parent>,
    ): Promise<TokenDocument.Implementation>;

    // TODO: The deprecated Embedded Document Operations
  }

  /**
   * @deprecated {@link TokenDocument.TrackedAttributesDescription | `TokenDocument.TrackedAttributesDescription`}
   */
  type TrackedAttributesDescription = TokenDocument.TrackedAttributesDescription;

  /**
   * @deprecated {@link TokenDocument.CreateCombatantOptions | `TokenDocument.CreateCombatantOptions`}
   */
  type CreateCombatantOptions = TokenDocument.CreateCombatantOptions;
}

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

interface ToggleActiveEffectOptions {
  /**
   * Should the Active Effect icon be displayed as an overlay on the token?
   * @defaultValue `false`
   */
  overlay: boolean;

  /** Force a certain active state for the effect. */
  active: boolean;
}
