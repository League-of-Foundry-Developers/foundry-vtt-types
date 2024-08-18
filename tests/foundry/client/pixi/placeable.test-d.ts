import { assertType, expectTypeOf } from "vitest";
import type { Document } from "../../../../src/foundry/common/abstract/module.d.mts";
import type { AnyMetadata } from "../../../../src/foundry/common/abstract/document.d.mts";

type EmbeddedInSceneDocumentSheetOptions = DocumentSheetOptions<Document<any, AnyMetadata, Scene.ConfiguredInstance>>;

class EmbeddedInSceneDocumentSheet<
  Options extends EmbeddedInSceneDocumentSheetOptions = EmbeddedInSceneDocumentSheetOptions,
> extends DocumentSheet<Options, Document<any, AnyMetadata, Scene.ConfiguredInstance>> {}

class BaseEmbeddedInSceneDocument extends Document<any, AnyMetadata, Scene.ConfiguredInstance | null> {}

class EmbeddedInSceneDocument extends CanvasDocumentMixin(BaseEmbeddedInSceneDocument) {
  get sheet(): EmbeddedInSceneDocumentSheet {
    return null as unknown as EmbeddedInSceneDocumentSheet;
  }
}

class OnePlaceable extends PlaceableObject<EmbeddedInSceneDocument> {
  get bounds(): Rectangle {
    return null as unknown as Rectangle;
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

expectTypeOf(PlaceableObject.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  Array<keyof PlaceableObject.RenderFlags> | undefined
>();

expectTypeOf(AmbientLight.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  Array<keyof AmbientLight.RenderFlags> | undefined
>();
