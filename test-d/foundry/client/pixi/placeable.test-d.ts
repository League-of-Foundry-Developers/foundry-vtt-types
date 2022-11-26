import type { ConfiguredDocumentClass } from "../../../../src/types/helperTypes";

import { expectAssignable, expectType } from "tsd";
import "../../../../index";
import { Document } from "../../../../src/foundry/common/abstract/module.mjs.js";

type EmbeddedInSceneDocumentSheetOptions = DocumentSheetOptions<
  Document<any, InstanceType<ConfiguredDocumentClass<typeof Scene>>>
>;

class EmbeddedInSceneDocumentSheet<
  Options extends EmbeddedInSceneDocumentSheetOptions = EmbeddedInSceneDocumentSheetOptions
> extends DocumentSheet<Options, Document<any, InstanceType<ConfiguredDocumentClass<typeof Scene>>>> {}

class EmbeddedInSceneDocument extends Document<any, InstanceType<ConfiguredDocumentClass<typeof Scene>>> {
  get sheet(): EmbeddedInSceneDocumentSheet {
    return null as unknown as EmbeddedInSceneDocumentSheet;
  }
}

class OnePlaceable extends PlaceableObject<EmbeddedInSceneDocument> {
  get bounds(): Rectangle {
    return null as unknown as Rectangle;
  }

  draw(): Promise<this> {
    return Promise.resolve(this);
  }

  refresh(): this | void {
    return undefined;
  }
}

const placeable = new OnePlaceable(new EmbeddedInSceneDocument());
expectAssignable<Document<any, any>>(placeable.document);
expectType<EmbeddedInSceneDocument>(placeable.document);
expectType<EmbeddedInSceneDocumentSheet>(placeable.sheet);

class ConcretePlaceableObject extends PlaceableObject<EmbeddedInSceneDocument> {
  get bounds(): NormalizedRectangle {
    throw new Error("Not implemented");
  }
  async draw() {
    return this;
  }
  refresh() {
    return this;
  }
}
expectType<MouseInteractionManager<ConcretePlaceableObject> | null>(
  new ConcretePlaceableObject(new EmbeddedInSceneDocument()).mouseInteractionManager
);
