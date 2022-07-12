import type { ConfiguredDocumentClass } from '../../../../src/types/helperTypes';

import { expectAssignable, expectType } from 'tsd';
import '../../../../index';
import { Document } from '../../../../src/foundry/common/abstract/module.mjs';

class EmbeddedOfSceneDocument extends Document<any, InstanceType<ConfiguredDocumentClass<typeof Scene>>> {
  get sheet(): DocumentSheet {
    return null as unknown as DocumentSheet;
  }
}

class OnePlaceable extends PlaceableObject<EmbeddedOfSceneDocument> {
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

const placeable = new OnePlaceable(new EmbeddedOfSceneDocument());
expectAssignable<AnyDocument>(placeable.document);
expectType<EmbeddedOfSceneDocument>(placeable.document);
expectType<DocumentSheet>(placeable.sheet);

class ConcretePlaceableObject extends PlaceableObject<EmbeddedOfSceneDocument> {
  get bounds(): NormalizedRectangle {
    throw new Error('Not implemented');
  }
  async draw() {
    return this;
  }
  refresh() {
    return this;
  }
}
expectType<MouseInteractionManager<ConcretePlaceableObject> | null>(
  new ConcretePlaceableObject(new EmbeddedOfSceneDocument()).mouseInteractionManager
);
