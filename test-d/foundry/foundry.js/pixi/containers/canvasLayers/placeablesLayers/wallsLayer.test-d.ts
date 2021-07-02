import { expectType } from 'tsd';

const aWall = new Wall(new foundry.documents.BaseWall());

expectType<'Wall'>(WallsLayer.documentName);
expectType<WallsLayer>(WallsLayer.instance);
expectType<WallsLayer.LayerOptions>(WallsLayer.layerOptions);
expectType<'walls'>(WallsLayer.layerOptions.name);
expectType<ConstructorOf<Wall>>(WallsLayer.layerOptions.objectClass);
expectType<PointArray>(WallsLayer.getClosestEndpoint({ x: 2, y: 3 }, aWall));
expectType<PointArray[]>(WallsLayer.getUniqueEndpoints([aWall]));
expectType<PointArray[]>(WallsLayer.getUniqueEndpoints([aWall], {}));
expectType<PointArray[]>(WallsLayer.getUniqueEndpoints([aWall], { bounds: new NormalizedRectangle(10, 10, 100, 100) }));
expectType<PointArray[]>(WallsLayer.getUniqueEndpoints([aWall], { type: 'movement' }));
expectType<PointArray[]>(WallsLayer.getUniqueEndpoints([aWall], { type: 'sight' }));
expectType<PointArray[]>(WallsLayer.getUniqueEndpoints([aWall], { type: 'sound' }));
expectType<Ray[]>(WallsLayer.castRays(100, 200, 600));
expectType<Ray[]>(WallsLayer.castRays(100, 200, 600), {});
expectType<Ray[]>(
  WallsLayer.castRays(100, 200, 600, { density: 4, endpoints: [[100, 200]], limitAngle: false, aMin: 100, aMax: 100 })
);

const intersection = WallsLayer.testWall(new Ray({ x: 100, y: 100 }, { x: 200, y: 300 }), aWall);
expectType<RayIntersection | null>(intersection);
if (intersection) {
  expectType<RayIntersection | null>(WallsLayer.getClosestCollision([intersection]));
}

const layer = new WallsLayer();
expectType<ConstructorOf<Wall>>(layer.options.objectClass);
expectType<WallsLayer.LayerOptions>(layer.options);
expectType<'walls'>(layer.options.name);

expectType<PIXI.Graphics | null>(layer.chain);

expectType<PointArray[]>(layer.endpoints);

expectType<{ id: string | null; point: PointArray | null }>(layer.last);

expectType<Wall[]>(layer.doors);

expectType<number>(layer.gridPrecision);

expectType<Promise<WallsLayer>>(layer.draw());

expectType<WallsLayer>(layer.deactivate());

expectType<void>(layer.initialize());

expectType<void>(layer.identifyInteriorWalls());

expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 })));
expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: 'movement' }));
expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: 'sight' }));
expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: 'sound' }));
expectType<boolean>(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: 'any' }));

expectType<RayIntersection | null | boolean>(
  layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: 'closest' })
);
expectType<RayIntersection[] | boolean>(
  layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: 'all' })
);

expectType<void>(layer.highlightControlledSegments());

expectType<number>(layer.releaseAll());
expectType<number>(layer.releaseAll({ trigger: true }));

expectType<Promise<foundry.documents.BaseWall>>(layer.pasteObjects({ x: 900, y: 800 }));
expectType<Promise<foundry.documents.BaseWall>>(layer.pasteObjects({ x: 900, y: 800 }, {}));
expectType<Promise<foundry.documents.BaseWall>>(layer.pasteObjects({ x: 900, y: 800 }, { hidden: true, snap: true }));

expectType<{ rays: Ray[]; los: PIXI.Polygon; fox: PIXI.Polygon }>(layer.computePolygon({ x: 100, y: 300 }, 400));
expectType<{ rays: Ray[]; los: PIXI.Polygon; fox: PIXI.Polygon }>(layer.computePolygon({ x: 100, y: 300 }, 400, {}));
expectType<{ rays: Ray[]; los: PIXI.Polygon; fox: PIXI.Polygon }>(
  layer.computePolygon({ x: 100, y: 300 }, 400, { type: 'sight' })
);
expectType<{ rays: Ray[]; los: PIXI.Polygon; fox: PIXI.Polygon }>(
  layer.computePolygon({ x: 100, y: 300 }, 400, { type: 'movement' })
);
expectType<{ rays: Ray[]; los: PIXI.Polygon; fox: PIXI.Polygon }>(
  layer.computePolygon({ x: 100, y: 300 }, 400, { type: 'sound' })
);
expectType<{ rays: Ray[]; los: PIXI.Polygon; fox: PIXI.Polygon }>(
  layer.computePolygon({ x: 100, y: 300 }, 400, { angle: 360, density: 6, rotation: 0, unrestricted: false })
);

expectType<RayIntersection[]>(layer.getRayCollision(new Ray({ x: 100, y: 700 }, { x: 700, y: 100 })));
expectType<RayIntersection[]>(layer.getRayCollision(new Ray({ x: 100, y: 700 }, { x: 700, y: 100 }), {}));
expectType<RayIntersection>(
  layer.getRayCollision(new Ray({ x: 100, y: 700 }, { x: 700, y: 100 }), { mode: 'closest' })
);
expectType<boolean>(layer.getRayCollision(new Ray({ x: 100, y: 700 }, { x: 700, y: 100 }), { mode: 'any' }));
expectType<RayIntersection[]>(
  layer.getRayCollision(new Ray({ x: 100, y: 700 }, { x: 700, y: 100 }), { type: 'movement' })
);
expectType<RayIntersection[]>(
  layer.getRayCollision(new Ray({ x: 100, y: 700 }, { x: 700, y: 100 }), { type: 'sight' })
);
expectType<RayIntersection[]>(
  layer.getRayCollision(new Ray({ x: 100, y: 700 }, { x: 700, y: 100 }), { type: 'sound' })
);
expectType<RayIntersection[]>(
  layer.getRayCollision(new Ray({ x: 100, y: 700 }, { x: 700, y: 100 }), { _performance: { tests: 0 } })
);
