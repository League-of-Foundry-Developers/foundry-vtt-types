/**
 * The client-side AmbientSound document which extends the common BaseAmbientSound model.
 * Each AmbientSound document contains AmbientSoundData which defines its data schema.
 *
 * @see {@link data.AmbientSoundData}             The AmbientSound data schema
 * @see {@link documents.Scene}                   The Scene document type which contains AmbientSound embedded documents
 * @see {@link applications.AmbientSoundConfig}   The AmbientSound configuration application
 */
declare class AmbientSoundDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientSound) {}
