import type EmbeddedCollection from '../../../../../../src/foundry/common/abstract/embedded-collection.mjs';
import { expectError, expectType } from 'tsd';

declare class SomeLightLayer extends PlaceablesLayer<'AmbientLight', PlaceablesLayer.LayerOptions<'AmbientLight'>> {}

expectType<CanvasLayer | undefined>(SomeLightLayer.instance);
expectType<PlaceablesLayer.LayerOptions<any>>(SomeLightLayer.layerOptions);
expectType<any>(SomeLightLayer.layerOptions.objectClass); // TODO: Can this be typed to DocumentConstructor?
expectType<'AmbientLight' | 'AmbientSound' | 'Drawing' | 'MeasuredTemplate' | 'Note' | 'Tile' | 'Token' | 'Wall'>(
  PlaceablesLayer.documentName
);
expectType<ConstructorOf<PlaceableObject>>(PlaceablesLayer.placeableClass);

const layer = new SomeLightLayer();
expectType<typeof AmbientLight>(layer.options.objectClass);
expectType<PIXI.Container | null>(layer.objects);
expectType<PIXI.Container | null>(layer.preview);
expectType<Array<{ type: 'create' | 'update' | 'delete'; data: Array<foundry.data.AmbientLightData['_source']> }>>(
  layer.history
);
expectType<Quadtree<AmbientLight> | null>(layer.quadtree);
expectType<EmbeddedCollection<typeof AmbientLightDocument, foundry.data.SceneData> | null>(layer.documentCollection);
expectType<number>(layer.gridPrecision);
expectType<BasePlaceableHUD<AmbientLight> | null>(layer.hud);
expectType<AmbientLight[]>(layer.placeables);
expectType<AmbientLight[]>(layer.controlled);
expectType<EmbeddedCollection<typeof AmbientLightDocument, foundry.data.SceneData> | AmbientLightDocument[]>(
  layer.getDocuments()
);
expectType<Promise<SomeLightLayer | undefined>>(layer.draw());
expectType<AmbientLight | null>(layer.createObject(new AmbientLightDocument()));
expectError(layer.createObject({}));
expectError(layer.createObject());
expectType<Promise<SomeLightLayer>>(layer.tearDown());
expectType<SomeLightLayer>(layer.activate());
expectType<SomeLightLayer>(layer.deactivate());
expectType<AmbientLight | undefined>(layer.get('id'));
expectType<AmbientLight[]>(layer.controlAll());
expectType<AmbientLight[]>(layer.controlAll({}));
expectType<AmbientLight[]>(layer.controlAll({ releaseOthers: true }));
expectType<number>(layer.releaseAll());
expectType<number>(layer.releaseAll({}));
expectType<number>(layer.releaseAll({ trigger: true }));
expectType<Promise<AmbientLight[]>>(layer.rotateMany());
expectType<Promise<AmbientLight[]>>(layer.rotateMany({}));
expectType<Promise<AmbientLight[]>>(layer.rotateMany({ angle: 10, delta: 20, snap: 20, ids: ['abc', 'def'] }));
expectType<Promise<AmbientLight[]> | undefined>(layer.moveMany());
expectType<Promise<AmbientLight[]> | undefined>(layer.moveMany({}));
expectType<Promise<AmbientLight[]> | undefined>(
  layer.moveMany({ dx: 100, dy: 100, rotate: true, ids: ['abc', 'def'] })
);
expectType<Promise<AmbientLightDocument[]>>(layer.undoHistory());
expectType<Promise<AmbientLightDocument[] | false | null>>(layer.deleteAll());
expectType<void>(layer.storeHistory('create', new AmbientLightDocument().data));
expectType<void>(layer.storeHistory('update', new AmbientLightDocument().data));
expectType<void>(layer.storeHistory('delete', new AmbientLightDocument().data));
expectError(layer.storeHistory('new', new AmbientLightDocument().data));
expectType<AmbientLight[]>(layer.copyObjects());
expectType<Promise<AmbientLightDocument[]>>(layer.pasteObjects({ x: 10, y: 10 }));
expectType<Promise<AmbientLightDocument[]>>(layer.pasteObjects({ x: 10, y: 10 }, { hidden: true, snap: false }));
expectType<Promise<AmbientLightDocument[]>>(layer.pasteObjects({ x: 10, y: 10 }, { hidden: false }));
expectType<Promise<AmbientLightDocument[]>>(layer.pasteObjects({ x: 10, y: 10 }, { snap: true }));
expectType<boolean>(layer.selectObjects());
expectType<boolean>(layer.selectObjects({}));
expectType<boolean>(
  layer.selectObjects({
    x: 10,
    y: 10,
    width: 100,
    height: 200,
    releaseOptions: { trigger: true },
    controlOptions: { releaseOthers: true }
  })
);

declare function transformer(doc: AmbientLight): Partial<foundry.data.AmbientLightData>;
declare function filter(doc: AmbientLight): boolean;
expectType<Promise<AmbientLightDocument[]>>(layer.updateAll({ x: 10, y: 20 }));
expectType<Promise<AmbientLightDocument[]>>(layer.updateAll({ x: 10, y: 20 }, null, {}));
expectType<Promise<AmbientLightDocument[]>>(layer.updateAll({ x: 10, y: 20 }, filter));
expectType<Promise<AmbientLightDocument[]>>(layer.updateAll({ x: 10, y: 20 }, filter, { diff: false, noHook: false }));
expectType<Promise<AmbientLightDocument[]>>(layer.updateAll(transformer));
expectType<Promise<AmbientLightDocument[]>>(layer.updateAll(transformer, null, {}));
expectType<Promise<AmbientLightDocument[]>>(layer.updateAll(transformer, filter));
expectType<Promise<AmbientLightDocument[]>>(layer.updateAll(transformer, filter, { diff: true, noHook: true }));
expectError(layer.updateAll({ no_light_data: 0 }));
