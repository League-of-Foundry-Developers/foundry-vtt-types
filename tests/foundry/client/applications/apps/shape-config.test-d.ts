import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

import ShapeConfig = foundry.applications.apps.ShapeConfig;

declare const shape: foundry.data.BaseShapeData;

const shapeConfig = new ShapeConfig({ shape });

// @ts-expect-error - `shape` is required.
new ShapeConfig({});

expectTypeOf(ShapeConfig.DEFAULT_OPTIONS).toEqualTypeOf<ShapeConfig.DefaultOptions>();
expectTypeOf(shapeConfig.shape).toEqualTypeOf<foundry.data.BaseShapeData>();
expectTypeOf(shapeConfig.document).toEqualTypeOf<foundry.abstract.Document.Any>();
expectTypeOf(shapeConfig.title).toBeString();
expectTypeOf(shapeConfig.options.shape).toEqualTypeOf<foundry.data.BaseShapeData>();

expectTypeOf(ShapeConfig._processShapeData(shape, { origin: null })).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(ShapeConfig._prepareShapeContext({}, shape, shape.schema.fields.type)).toEqualTypeOf<void>();

declare const input: HTMLInputElement;
declare const grid: foundry.grid.BaseGrid;
expectTypeOf(ShapeConfig._onChangeDimension(input, grid)).toEqualTypeOf<void>();
