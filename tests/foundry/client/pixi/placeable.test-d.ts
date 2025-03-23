import { assertType, expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

class FakeLight extends PlaceableObject<AmbientLightDocument.Implementation> {
  get bounds(): PIXI.Rectangle {
    return new PIXI.Rectangle();
  }

  protected async _draw(): Promise<void> {}
}

declare const someLightDoc: AmbientLightDocument.Implementation;

const placeable = new FakeLight(someLightDoc);
assertType<Document.Any>(placeable.document);

expectTypeOf(placeable.document).toEqualTypeOf<AmbientLightDocument.Implementation>();
//TODO: investigate AmbientLightDocument.sheet to see if this should be a more narrowed type
expectTypeOf(placeable.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();

expectTypeOf(placeable.mouseInteractionManager).toEqualTypeOf<MouseInteractionManager<FakeLight> | null>();

expectTypeOf(PlaceableObject.RENDER_FLAGS.redraw?.propagate).toEqualTypeOf<
  Array<"redraw" | "refresh" | "refreshState"> | undefined
>();

expectTypeOf(AmbientLight.RENDER_FLAGS.redraw?.propagate).toEqualTypeOf<
  Array<"redraw" | "refresh" | "refreshState" | "refreshField" | "refreshPosition" | "refreshElevation"> | undefined
>();
