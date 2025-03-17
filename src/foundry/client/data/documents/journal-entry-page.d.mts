import type { ConfiguredJournalEntryPage } from "../../../../configuration/index.d.mts";
import type { InexactPartial, LazyUnknown } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseJournalEntryPage from "../../../common/documents/journal-entry-page.d.mts";

declare global {
  namespace JournalEntryPage {
    /**
     * The implementation of the JournalEntryPage document instance configured through `CONFIG.JournalEntryPage.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredJournalEntryPage | `fvtt-types/configuration/ConfiguredJournalEntryPage`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"JournalEntryPage">;

    /**
     * The implementation of the JournalEntryPage document configured through `CONFIG.JournalEntryPage.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"JournalEntryPage">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"JournalEntryPage"> {}

    type SubType = Game.Model.TypeNames<"JournalEntryPage">;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"JournalEntryPage">;
    type Known = JournalEntryPage.OfType<JournalEntryPage.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<
      ConfiguredJournalEntryPage<Type>,
      JournalEntryPage<SubType>
    >;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = JournalEntry.Implementation | null;

    /**
     * An instance of `JournalEntryPage` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link DataModel._source | `DataModel._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link JournalEntryPage._source | `JournalEntryPage._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link JournalEntryPage.create | `JournalEntryPage.create`}
     * and {@link JournalEntryPage | `new JournalEntryPage(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link JournalEntryPage.name | `JournalEntryPage#name`}.
     *
     * This is data transformed from {@link JournalEntryPage.Source | `JournalEntryPage.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link JournalEntryPage.update | `JournalEntryPage#update`}.
     * It is a distinct type from {@link JournalEntryPage.CreateData | `DeepPartial<JournalEntryPage.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link JournalEntryPage | `JournalEntryPage`}. This is the source of truth for how an JournalEntryPage document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link JournalEntryPage | `JournalEntryPage`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this JournalEntryPage embedded document.
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The text name of this page.
       */
      name: fields.StringField<{ required: true; blank: false; label: "JOURNALENTRYPAGE.PageTitle"; textSearch: true }>;

      /**
       * The type of this page, in {@link BaseJournalEntryPage.TYPES | `BaseJournalEntryPage.TYPES`}.
       * @defaultValue `"text"`
       */
      type: fields.DocumentTypeField<
        typeof BaseJournalEntryPage,
        {
          initial: "text";
        }
      >;

      /**
       * System-specific data.
       * @defaultValue `{}`
       */
      system: fields.TypeDataField<typeof BaseJournalEntryPage>;

      /**
       * Data that control's the display of this page's title.
       */
      title: fields.SchemaField<{
        /**
         * Whether to render the page's title in the overall journal view.
         * @defaultValue `true`
         */
        show: fields.BooleanField<{ initial: true }>;

        /**
         * The heading level to render this page's title at in the overall journal view.
         * @defaultValue `1`
         */
        level: fields.NumberField<{ required: true; initial: 1; min: 1; max: 6; integer: true; nullable: false }>;
      }>;

      /**
       * Data particular to image journal entry pages.
       */
      image: fields.SchemaField<{
        /**
         * A caption for the image.
         * @defaultValue `undefined`
         */
        caption: fields.StringField<{ required: false; initial: undefined }>;
      }>;

      /**
       * Data particular to text journal entry pages.
       */
      text: fields.SchemaField<{
        /**
         * The content of the JournalEntryPage in a format appropriate for its type.
         * @defaultValue `undefined`
         */
        content: fields.HTMLField<{ required: false; initial: undefined; textSearch: true }>;

        /**
         * The original markdown source, if applicable.
         * @defaultValue `undefined`
         */
        markdown: fields.StringField<{ required: false; initial: undefined }>;

        /**
         * The format of the page's content, in {@link CONST.JOURNAL_ENTRY_PAGE_FORMATS | `CONST.JOURNAL_ENTRY_PAGE_FORMATS`}.
         * @defaultValue `CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML`
         */
        format: fields.NumberField<{
          label: "JOURNALENTRYPAGE.Format";
          initial: typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML;
          choices: foundry.CONST.JOURNAL_ENTRY_PAGE_FORMATS[];
        }>;
      }>;

      /**
       * Data particular to video journal entry pages.
       */
      video: fields.SchemaField<{
        controls: fields.BooleanField<{ initial: true }>;

        /**
         * Automatically loop the video?
         * @defaultValue `undefined`
         */
        loop: fields.BooleanField<{ required: false; initial: undefined }>;

        /**
         * Should the video play automatically?
         * @defaultValue `undefined`
         */
        autoplay: fields.BooleanField<{ required: false; initial: undefined }>;

        /**
         * The volume level of any audio that the video file contains.
         * @defaultValue `0.5`
         */
        volume: fields.AlphaField<{ required: true; step: 0.01; initial: 0.5 }>;

        /**
         * The starting point of the video, in seconds.
         * @defaultValue `undefined`
         */
        timestamp: fields.NumberField<{ required: false; min: 0; initial: undefined }>;

        /**
         * The width of the video, otherwise it will fill the available container width.
         * @defaultValue `undefined`
         */
        width: fields.NumberField<{ required: false; positive: true; integer: true; initial: undefined }>;

        /**
         * The height of the video, otherwise it will use the aspect ratio of the source video, or 16:9 if that aspect
         * ratio is not available.
         * @defaultValue `undefined`
         */
        height: fields.NumberField<{ required: false; positive: true; integer: true; initial: undefined }>;
      }>;

      /**
       * The URI of the image or other external media to be used for this page.
       * @defaultValue `null`
       */
      src: fields.StringField<{
        required: false;
        blank: false;
        nullable: true;
        initial: null;
        label: "JOURNALENTRYPAGE.Source";
      }>;

      /**
       * The numeric sort value which orders this page relative to its siblings.
       * @defaultValue `0`
       */
      sort: fields.IntegerSortField;

      /**
       * An object which configures the ownership of this page.
       * @defaultValue `CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT`
       */
      ownership: fields.DocumentOwnershipField<{
        initial: { default: typeof CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT };
      }>;

      /**
       * An object of optional key/value flags.
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"JournalEntryPage">;

      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for JournalEntryPages */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<JournalEntryPage.Parent> {}
      /** Options passed along in Create operations for JournalEntryPages */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          JournalEntryPage.CreateData,
          JournalEntryPage.Parent,
          Temporary
        > {
        animate?: boolean;
      }
      /** Options passed along in Delete operations for JournalEntryPages */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<JournalEntryPage.Parent> {
        animate?: boolean;
      }
      /** Options passed along in Update operations for JournalEntryPages */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<JournalEntryPage.UpdateData, JournalEntryPage.Parent> {
        animate?: boolean;
      }

      /** Options for {@link JournalEntryPage.createDocuments | `JournalEntryPage.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link JournalEntryPage._preCreateOperation | `JournalEntryPage._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link JournalEntryPage._preCreate | `JournalEntryPage#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOptions<Create>;
      /** Options for {@link JournalEntryPage._onCreate | `JournalEntryPage#_onCreate`} */
      type OnCreateOperation = Document.Database.CreateOptions<Create>;

      /** Options for {@link JournalEntryPage.updateDocuments | `JournalEntryPage.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateDocumentsOperation<Update>;
      /** Options for {@link JournalEntryPage._preUpdateOperation | `JournalEntryPage._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link JournalEntryPage._preUpdate | `JournalEntryPage#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOptions<Update>;
      /** Options for {@link JournalEntryPage._onUpdate | `JournalEntryPage#_onUpdate`} */
      type OnUpdateOperation = Document.Database.UpdateOptions<Update>;

      /** Options for {@link JournalEntryPage.deleteDocuments | `JournalEntryPage.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteDocumentsOperation<Delete>;
      /** Options for {@link JournalEntryPage._preDeleteOperation | `JournalEntryPage._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link JournalEntryPage._preDelete | `JournalEntryPage#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link JournalEntryPage._onDelete | `JournalEntryPage#_onDelete`} */
      type OnDeleteOperation = Document.Database.DeleteOptions<Delete>;
    }

    interface JournalEntryPageHeading {
      /** The heading level, 1-6. */
      level: number;

      /** The raw heading text with any internal tags omitted. */
      text: string;

      /** The generated slug for this heading. */
      slug: string;

      /** The currently rendered element for this heading, if it exists. */
      element?: HTMLHeadingElement;

      /** Any child headings of this one. */
      children: string[];

      /** The linear ordering of the heading in the table of contents. */
      order: number;
    }

    /**
     * @deprecated {@link JournalEntryPage.DatabaseOperation | `JournalEntryPage.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<JournalEntryPage> {}

    /**
     * @deprecated {@link JournalEntryPage.Types | `JournalEntryPage.SubType`}
     */
    type TypeNames = JournalEntryPage.SubType;

    /**
     * @deprecated {@link JournalEntryPage.CreateData | `JournalEntryPage.CreateData`}
     */
    interface ConstructorData extends JournalEntryPage.CreateData {}

    /**
     * @deprecated {@link JournalEntryPage.implementation | `JournalEntryPage.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link JournalEntryPage.Implementation | `JournalEntryPage.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side JournalEntryPage document which extends the common BaseJournalEntryPage document model.
   *
   * @see {@link JournalEntry | `JournalEntry`}  The JournalEntry document type which contains JournalEntryPage embedded documents.
   */
  class JournalEntryPage<
    out SubType extends JournalEntryPage.SubType = JournalEntryPage.SubType,
  > extends ClientDocumentMixin(foundry.documents.BaseJournalEntryPage)<SubType> {
    /**
     * @param data    - Initial data from which to construct the `JournalEntryPage`
     * @param context - Construction context options
     *
     * @deprecated Constructing `JournalEntryPage` directly is not advised. While `new JournalEntryPage(...)` would create a
     * temporary document it would not respect a system's subclass of `JournalEntryPage`, if any.
     *
     * You should use {@link JournalEntryPage.implementation | `new JournalEntryPage.implementation(...)`} instead which
     * will give you a system specific implementation of `JournalEntryPage`.
     */
    constructor(...args: Document.ConstructorParameters<JournalEntryPage.CreateData, JournalEntryPage.Parent>);

    /**
     * The cached table of contents for this JournalEntryPage.
     */
    protected _toc: Record<string, JournalEntryPage.JournalEntryPageHeading>;

    /**
     * The table of contents for this JournalEntryPage.
     */
    get toc(): Record<string, JournalEntryPage.JournalEntryPageHeading>;

    override get permission(): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * Return a reference to the Note instance for this Journal Entry Page in the current Scene, if any.
     * If multiple notes are placed for this Journal Entry, only the first will be returned.
     */
    get sceneNote(): Note | null;

    /**
     * Convert a heading into slug suitable for use as an identifier.
     * @param heading - The heading element or some text content.
     */
    static slugifyHeading(heading: HTMLHeadingElement | string): string;

    /**
     * Build a table of contents for the given HTML content.
     * @param html    - The HTML content to generate a ToC outline for.
     * @param options - Additional options to configure ToC generation.
     */
    static buildTOC(
      html: HTMLElement[],
      options: InexactPartial<{
        /**
         * Include references to the heading DOM elements in the returned ToC.
         * @defaultValue `true`
         */
        includeElement: boolean;
      }>,
    ): Record<string, JournalEntryPage.JournalEntryPageHeading>;

    /**
     * Flatten the tree structure into a single object with each node's slug as the key.
     * @param nodes - The root ToC nodes.
     */
    protected static _flattenTOC(
      nodes: JournalEntryPage.JournalEntryPageHeading[],
    ): Record<string, JournalEntryPage.JournalEntryPageHeading>;

    /**
     * Construct a table of contents node from a heading element.
     * @param heading - The heading element.
     * @param options - Additional options to configure the returned node.
     */
    protected static _makeHeadingNode(
      heading: HTMLHeadingElement,
      options: InexactPartial<{
        /**
         * Whether to include the DOM element in the returned ToC node.
         * @defaultValue `true`
         */
        includeElement: boolean;
      }>,
    ): JournalEntryPage.JournalEntryPageHeading;

    protected override _createDocumentLink(
      eventData: unknown,
      options?: InexactPartial<{
        /**
         * A document to generate a link relative to.
         */
        relativeTo: ClientDocument;
        /**
         * A custom label to use instead of the document's name.
         */
        label: string;
      }>,
    ): string;

    override _onClickDocumentLink(event: MouseEvent): this;

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _buildEmbedHTML(
      config: TextEditor.DocumentHTMLEmbedConfig,
    ): Promise<HTMLCollection | HTMLElement | null>;

    protected override _createFigureEmbed(
      content: HTMLElement | HTMLCollection,
      config: TextEditor.DocumentHTMLEmbedConfig,
      options?: TextEditor.EnrichmentOptions,
    ): Promise<HTMLElement | null>;

    /**
     * Embed text page content.
     * @param config        - Configuration for embedding behavior. This can include
     *                        enrichment options to override those passed as part of
     *                        the root enrichment process.
     * @param options       - The original enrichment options to propagate to the embedded text page's
     *                        enrichment.
     * @returns
     *
     * @example Embed the content of the Journal Entry Page as a figure.
     * ```
     * @Embed[.yDbDF1ThSfeinh3Y classes="small right"]{Special caption}
     * ```
     * becomes
     * ```html
     * <figure class="content-embed small right" data-content-embed
     *         data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y">
     *   <p>The contents of the page</p>
     *   <figcaption>
     *     <strong class="embed-caption">Special caption</strong>
     *     <cite>
     *       <a class="content-link" draggable="true" data-link
     *          data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y"
     *          data-id="yDbDF1ThSfeinh3Y" data-type="JournalEntryPage" data-tooltip="Text Page">
     *         <i class="fas fa-file-lines"></i> Text Page
     *       </a>
     *     </cite>
     *   <figcaption>
     * </figure>
     * ```
     *
     * @example Embed the content of the Journal Entry Page into the main content flow.
     * ```
     * @Embed[.yDbDF1ThSfeinh3Y inline]
     * ```
     * becomes
     * ```html
     * <section class="content-embed" data-content-embed
     *          data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y">
     *   <p>The contents of the page</p>
     * </section>
     * ```
     */
    protected _embedTextPage(
      config: TextEditor.DocumentHTMLEmbedConfig & TextEditor.EnrichmentOptions,
      options?: TextEditor.EnrichmentOptions,
    ): Promise<HTMLCollection>;

    /**
     * Embed image page content.
     * @param config            - Configuration for embedding behavior.
     * @param options           - The original enrichment options for cases where the Document embed content
     *                            also contains text that must be enriched.
     * @returns
     *
     * @example Create an embedded image from a sibling journal entry page.
     * ```
     * @Embed[.QnH8yGIHy4pmFBHR classes="small right"]{Special caption}
     * ```
     * becomes
     * ```html
     * <figure class="content-embed small right" data-content-embed
     *         data-uuid="JournalEntry.xFNPjbSEDbWjILNj.JournalEntryPage.QnH8yGIHy4pmFBHR">
     *   <img src="path/to/image.webp" alt="Special caption">
     *   <figcaption>
     *     <strong class="embed-caption">Special caption</strong>
     *     <cite>
     *       <a class="content-link" draggable="true" data-link
     *          data-uuid="JournalEntry.xFNPjbSEDbWjILNj.JournalEntryPage.QnH8yGIHy4pmFBHR"
     *          data-id="QnH8yGIHy4pmFBHR" data-type="JournalEntryPage" data-tooltip="Image Page">
     *         <i class="fas fa-file-image"></i> Image Page
     *       </a>
     *     </cite>
     *   </figcaption>
     * </figure>
     * ```
     */
    protected _embedImagePage(
      config: TextEditor.DocumentHTMLEmbedConfig & {
        /** Alt text for the image, otherwise the caption will be used. **/
        alt?: string | LazyUnknown;
      },
      options?: InexactPartial<TextEditor.EnrichmentOptions>,
    ): Promise<HTMLElement | HTMLCollection | null>;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(
      context: Document.DefaultNameContext<JournalEntryPage.SubType, NonNullable<JournalEntryPage.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<JournalEntryPage.CreateData>,
      context: Document.CreateDialogContext<JournalEntryPage.SubType, NonNullable<JournalEntryPage.Parent>>,
    ): Promise<JournalEntryPage.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<JournalEntryPage.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<JournalEntryPage.Implementation | undefined>;

    static override fromImport(
      source: JournalEntryPage.Source,
      context?: Document.FromImportContext<JournalEntryPage.Parent>,
    ): Promise<JournalEntryPage.Implementation>;
  }
}
