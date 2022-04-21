/**
 * The client-side Wall document which extends the common BaseWall model.
 * Each Wall document contains WallData which defines its data schema.
 *
 * @see {@link data.WallData}                 The Wall data schema
 * @see {@link documents.Scene}               The Scene document type which contains Wall embedded documents
 * @see {@link applications.WallConfig}       The Wall configuration application
 */
declare class WallDocument extends CanvasDocumentMixin(foundry.documents.BaseWall) {}
