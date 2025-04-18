import { assertType, expectTypeOf } from "vitest";

import Document = foundry.abstract.Document;

type EmbeddedInSceneDocumentSheetOptions = DocumentSheet.Options<Document.AnyChild<Scene.Implementation>>;

class EmbeddedInSceneDocumentSheet<
  Options extends EmbeddedInSceneDocumentSheetOptions = EmbeddedInSceneDocumentSheetOptions,
> extends DocumentSheet<Options, Document.AnyChild<Scene.Implementation>> {}

declare class BaseEmbeddedInSceneDocument extends Document<any, any, Scene.Implementation | null> {
  constructor();
}

class EmbeddedInSceneDocument extends CanvasDocumentMixin(BaseEmbeddedInSceneDocument) {
  override get sheet(): EmbeddedInSceneDocumentSheet {
    return null as unknown as EmbeddedInSceneDocumentSheet;
  }
}

class OnePlaceable extends PlaceableObject<EmbeddedInSceneDocument> {
  get bounds(): PIXI.Rectangle {
    return null as unknown as PIXI.Rectangle;
  }

  protected async _draw(): Promise<void> {}
}

const placeable = new OnePlaceable(new EmbeddedInSceneDocument());
assertType<Document.Any>(placeable.document);
expectTypeOf(placeable.document).toEqualTypeOf<EmbeddedInSceneDocument>();
expectTypeOf(placeable.sheet).toEqualTypeOf<EmbeddedInSceneDocumentSheet>();

class ConcretePlaceableObject extends PlaceableObject<EmbeddedInSceneDocument> {
  get bounds(): PIXI.Rectangle {
    throw new Error("Not implemented");
  }
  protected async _draw() {}
}
expectTypeOf(
  new ConcretePlaceableObject(new EmbeddedInSceneDocument()).mouseInteractionManager,
).toEqualTypeOf<MouseInteractionManager<ConcretePlaceableObject> | null>();

expectTypeOf(PlaceableObject.RENDER_FLAGS.redraw?.propagate).toEqualTypeOf<
  Array<"redraw" | "refresh" | "refreshState"> | undefined
>();

expectTypeOf(AmbientLight.RENDER_FLAGS.redraw?.propagate).toEqualTypeOf<
  Array<"redraw" | "refresh" | "refreshState" | "refreshField" | "refreshPosition"> | undefined
>();
