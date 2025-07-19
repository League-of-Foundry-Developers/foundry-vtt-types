import { describe, expectTypeOf, test } from "vitest";

import GridMesh = foundry.canvas.containers.GridMesh;
import GridShader = foundry.canvas.rendering.shaders.GridShader;

describe("GridMesh Tests", () => {
  test("Construction", () => {
    new GridMesh();
    new GridMesh(GridShader);
  });

  const myGridMesh = new GridMesh(GridShader);

  const myGridMeshData = {
    type: CONST.GRID_TYPES.HEXEVENQ,
    width: 100,
    height: 100,
    size: 128,
    thickness: 7,
    alpha: 0.72,
  };

  const myGridMeshDataInexact = {
    type: undefined,
    width: undefined,
    height: undefined,
    size: undefined,
    thickness: undefined,
    alpha: undefined,
  };

  test("Uncategorized", () => {
    expectTypeOf(myGridMesh.data).toEqualTypeOf<GridMesh.MeshData>();

    expectTypeOf(myGridMesh.initialize(myGridMeshData)).toEqualTypeOf<typeof myGridMesh>();
    expectTypeOf(myGridMesh.initialize(myGridMeshDataInexact)).toEqualTypeOf<typeof myGridMesh>();
    expectTypeOf(myGridMesh["_initialize"](myGridMeshData)).toBeVoid();
    expectTypeOf(myGridMesh["_initialize"](myGridMeshDataInexact)).toBeVoid();
  });
});
