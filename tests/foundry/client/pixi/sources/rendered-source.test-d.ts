import { expectTypeOf } from "vitest";

const myRenderedSource = new RenderedPointSource();

expectTypeOf(myRenderedSource.initialize()).toEqualTypeOf<RenderedPointSource>();

expectTypeOf(myRenderedSource.layers.background.shader).toEqualTypeOf<AdaptiveLightingShader | undefined>();
