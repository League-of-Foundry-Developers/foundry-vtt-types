// FOUNDRY_VERSION: 10.291

/**
 * The client-side Wall document which extends the common BaseWall document model.
 *
 * @see {@link Scene}                     The Scene document type which contains Wall documents
 * @see {@link WallConfig}                The Wall configuration application
 */
declare class WallDocument extends CanvasDocumentMixin(foundry.documents.BaseWall) {}
