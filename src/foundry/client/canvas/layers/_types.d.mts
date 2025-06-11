/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

export {};

type AmbientSoundPlaybackConfig = foundry.canvas.layers.SoundsLayer.AmbientSoundPlaybackConfig;

type CanvasHistoryEvent<DocumentName extends foundry.abstract.Document.PlaceableType> =
  foundry.canvas.layers.PlaceablesLayer.HistoryEntry<DocumentName>;

// type PlaceablesLayerOptions<Placeable extends foundry.canvas.placeables.PlaceableObject.AnyConstructor> =
//   foundry.canvas.placeables.PlaceableObject.LayerOptions<Placeable>;

type CanvasVisionContainerSight = foundry.canvas.layers.CanvasVisionMask.CanvasVisionContainerSight;

type CanvasVisionContainerLight = foundry.canvas.layers.CanvasVisionMask.CanvasVisionContainerLight;

type CanvasVisionContainerDarkness = foundry.canvas.layers.CanvasVisionMask.CanvasVisionContainerDarkness;

type CanvasVisionContainer = foundry.canvas.layers.CanvasVisionMask.CanvasVisionContainer;
