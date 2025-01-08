import type Document from "../../../common/abstract/document.d.mts";
import type BaseMeasuredTemplate from "../../../common/documents/measured-template.d.mts";

declare global {
  namespace MeasuredTemplateDocument {
    type Metadata = Document.MetadataFor<MeasuredTemplateDocument>;

    type ConfiguredClass = Document.ConfiguredClassForName<"MeasuredTemplate">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"MeasuredTemplate">;

    interface DatabaseOperations extends Document.Database.Operations<MeasuredTemplateDocument> {}

    // Helpful aliases
    type ConstructorData = BaseMeasuredTemplate.ConstructorData;
    type UpdateData = BaseMeasuredTemplate.UpdateData;
    type Schema = BaseMeasuredTemplate.Schema;
    type Source = BaseMeasuredTemplate.Source;
  }

  /**
   * The client-side MeasuredTemplate document which extends the common BaseMeasuredTemplate document model.
   *
   * @see {@link Scene}                     The Scene document type which contains MeasuredTemplate documents
   * @see {@link MeasuredTemplateConfig}    The MeasuredTemplate configuration application
   */
  class MeasuredTemplateDocument extends CanvasDocumentMixin(foundry.documents.BaseMeasuredTemplate) {
    static override metadata: MeasuredTemplateDocument.Metadata;

    static get implementation(): MeasuredTemplateDocument.ConfiguredClass;

    /**
     * Rotation is an alias for direction
     */
    get rotation(): this["direction"];

    /**
     * Is the current User the author of this template?
     */
    get isAuthor(): boolean;
  }
}
