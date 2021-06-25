import { expectError, expectType } from 'tsd';
import EmbeddedCollection from '../../../../../../src/foundry/common/abstract/embedded-collection.mjs';
import { DocumentConstructor } from '../../../../../../src/types/helperTypes';

declare class PlaceableUserDocument extends foundry.abstract.Document<foundry.data.UserData, Scene> {}
declare class PlaceableUser extends PlaceableObject<PlaceableUserDocument> {
  static documentName: 'Users';

  static get placeableClass(): PlaceableUserDocument;

  get bounds(): Rectangle;

  draw(): Promise<this>;

  refresh(): this | void;
}

declare class UserLayer extends PlaceablesLayer<PlaceableUser> {}

expectType<CanvasLayer>(UserLayer.instance);
expectType<PlaceablesLayer.LayerOptions>(UserLayer.layerOptions);
expectType<string>(PlaceablesLayer.documentName);
expectType<DocumentConstructor>(PlaceablesLayer.placeableClass);

const layer = new UserLayer();
expectType<PIXI.Container | null>(layer.objects);
expectType<PIXI.Container | null>(layer.preview);
expectType<Array<{ type: 'create' | 'update' | 'delete'; data: Array<foundry.data.UserData> }>>(layer.history);
expectType<Quadtree<PlaceableUser> | null>(layer.quadtree);
expectType<EmbeddedCollection<typeof PlaceableUserDocument, foundry.data.SceneData> | null>(layer.documentCollection);
expectType<number>(layer.gridPrecision);
expectType<BasePlaceableHUD<PlaceableUser> | null>(layer.hud); // TODO: Specify
expectType<PlaceableUser[]>(layer.placeables);
expectType<PlaceableUser[]>(layer.controlled);
expectType<Iterable<PlaceableUserDocument>>(layer.getDocuments());
expectType<Promise<UserLayer>>(layer.draw());
expectType<PlaceableUser>(layer.createObject(new PlaceableUserDocument({ name: 'Foo' })));
expectError(layer.createObject({}));
expectError(layer.createObject());
expectType<Promise<UserLayer>>(layer.tearDown());
expectType<UserLayer>(layer.activate());
expectType<UserLayer>(layer.deactivate());
expectType<PlaceableUser | undefined>(layer.get('id'));
expectType<PlaceableUser[]>(layer.controlAll());
expectType<PlaceableUser[]>(layer.controlAll({}));
expectType<PlaceableUser[]>(layer.controlAll({ releaseOthers: true }));
expectType<number>(layer.releaseAll());
expectType<number>(layer.releaseAll({}));
expectType<number>(layer.releaseAll({ trigger: true }));
expectType<Promise<PlaceableUser[]>>(layer.rotateMany());
expectType<Promise<PlaceableUser[]>>(layer.rotateMany({}));
expectType<Promise<PlaceableUser[]>>(layer.rotateMany({ angle: 10, delta: 20, snap: 20, ids: ['abc', 'def'] }));
expectType<Promise<PlaceableUser[]> | undefined>(layer.moveMany());
expectType<Promise<PlaceableUser[]> | undefined>(layer.moveMany({}));
expectType<Promise<PlaceableUser[]> | undefined>(
  layer.moveMany({ dx: 100, dy: 100, rotate: true, ids: ['abc', 'def'] })
);
expectType<Promise<PlaceableUserDocument[]>>(layer.undoHistory());
expectType<Promise<PlaceableUserDocument[]>>(layer.deleteAll());
expectType<void>(layer.storeHistory('create', new PlaceableUserDocument().data));
expectType<void>(layer.storeHistory('update', new PlaceableUserDocument().data));
expectType<void>(layer.storeHistory('delete', new PlaceableUserDocument().data));
expectError(layer.storeHistory('new', new PlaceableUserDocument().data));
expectType<PlaceableUser[]>(layer.copyObjects());
expectType<Promise<PlaceableUserDocument[]>>(layer.pasteObjects({ x: 10, y: 10 }));
expectType<Promise<PlaceableUserDocument[]>>(layer.pasteObjects({ x: 10, y: 10 }, { hidden: true, snap: false }));
expectType<Promise<PlaceableUserDocument[]>>(layer.pasteObjects({ x: 10, y: 10 }, { hidden: false }));
expectType<Promise<PlaceableUserDocument[]>>(layer.pasteObjects({ x: 10, y: 10 }, { snap: true }));
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

declare function transformer(doc: PlaceableUser): Partial<foundry.data.UserData>;
declare function filter(doc: PlaceableUser): boolean;
expectType<Promise<PlaceableUserDocument[]>>(layer.updateAll({ name: 'Tom' }));
expectType<Promise<PlaceableUserDocument[]>>(layer.updateAll({ name: 'Tom' }, null, {}));
expectType<Promise<PlaceableUserDocument[]>>(layer.updateAll({ name: 'Tom' }, filter));
expectType<Promise<PlaceableUserDocument[]>>(layer.updateAll({ name: 'Tom' }, filter, { diff: false, noHook: false }));
expectType<Promise<PlaceableUserDocument[]>>(layer.updateAll(transformer));
expectType<Promise<PlaceableUserDocument[]>>(layer.updateAll(transformer, null, {}));
expectType<Promise<PlaceableUserDocument[]>>(layer.updateAll(transformer, filter));
expectType<Promise<PlaceableUserDocument[]>>(layer.updateAll(transformer, filter, { diff: true, noHook: true }));
expectError(layer.updateAll({ no_user_data: 0 }));
