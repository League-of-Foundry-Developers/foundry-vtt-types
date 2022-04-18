import { expectType } from 'tsd';

expectType<WallsLayer | undefined>(WallsLayer.instance);
expectType<typeof Wall>(WallsLayer.layerOptions.objectClass);

const layer = new WallsLayer();
expectType<typeof Wall>(layer.options.objectClass);
expectType<WallsLayer.LayerOptions>(layer.options);
expectType<'walls'>(layer.options.name);

expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 })));
expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: 'move' }));
expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: 'sight' }));
expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: 'sound' }));
expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: 'any' }));

expectType<PolygonVertex | boolean>(
  layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: 'closest' })
);
expectType<PolygonVertex[] | boolean>(
  layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: 'all' })
);

expectType<Promise<WallDocument[]>>(layer.pasteObjects({ x: 900, y: 800 }));
expectType<Promise<WallDocument[]>>(layer.pasteObjects({ x: 900, y: 800 }, {}));
expectType<Promise<WallDocument[]>>(layer.pasteObjects({ x: 900, y: 800 }, { hidden: true, snap: true }));
