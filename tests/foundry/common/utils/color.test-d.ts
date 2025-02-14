import { expectTypeOf } from "vitest";

const color = new Color();

expectTypeOf(color.valid).toEqualTypeOf<boolean>();
expectTypeOf(color.css).toEqualTypeOf<string>();
expectTypeOf(color.rgb).toEqualTypeOf<Color.RGBColorVector>();
expectTypeOf(color.r).toEqualTypeOf<number>();
expectTypeOf(color.g).toEqualTypeOf<number>();
expectTypeOf(color.b).toEqualTypeOf<number>();
expectTypeOf(color.maximum).toEqualTypeOf<number>();
expectTypeOf(color.minimum).toEqualTypeOf<number>();
expectTypeOf(color.littleEndian).toEqualTypeOf<number>();
expectTypeOf(color.hsv).toEqualTypeOf<Color.HSVColorVector>();
expectTypeOf(color.hsl).toEqualTypeOf<Color.HSLColorVector>();
expectTypeOf(color.linear).toEqualTypeOf<Color.RGBColorVector>();
expectTypeOf(color.toJSON()).toEqualTypeOf<string>();
expectTypeOf(color.toHTML()).toEqualTypeOf<string>();
expectTypeOf(color.equals(4)).toEqualTypeOf<boolean>();
expectTypeOf(color.toRGBA(5)).toEqualTypeOf<string>();
expectTypeOf(color.mix(new Color(), 4)).toEqualTypeOf<Color>();
expectTypeOf(color.multiply(new Color())).toEqualTypeOf<Color>();
expectTypeOf(color.add(new Color())).toEqualTypeOf<Color>();
expectTypeOf(color.subtract(new Color())).toEqualTypeOf<Color>();
expectTypeOf(color.maximize(new Color())).toEqualTypeOf<Color>();
expectTypeOf(color.applyRGB([])).toEqualTypeOf<void>();

expectTypeOf(Color.mix(1, 2, 3)).toEqualTypeOf<number>();
expectTypeOf(Color.multiplyScalar(1, 2)).toEqualTypeOf<number>();
expectTypeOf(Color.maximize(1, 3)).toEqualTypeOf<number>();
expectTypeOf(Color.maximizeScalar(1, 3)).toEqualTypeOf<number>();
expectTypeOf(Color.addScalar(1, 3)).toEqualTypeOf<number>();
expectTypeOf(Color.subtract(1, 3)).toEqualTypeOf<number>();
expectTypeOf(Color.subtractScalar(1, 3)).toEqualTypeOf<number>();
expectTypeOf(Color.minimize(1, 3)).toEqualTypeOf<number>();
expectTypeOf(Color.minimizeScalar(1, 3)).toEqualTypeOf<number>();
expectTypeOf(Color.applyRGB(1, [])).toEqualTypeOf<void>();

declare const cs: foundry.utils.Color.Source;
expectTypeOf(Color.from(cs)).toEqualTypeOf<Color>();

expectTypeOf(Color.fromString("")).toEqualTypeOf<Color>();
expectTypeOf(Color.fromRGB([1, 1, 1])).toEqualTypeOf<Color>();
expectTypeOf(Color.fromRGBvalues(1, 1, 1)).toEqualTypeOf<Color>();
expectTypeOf(Color.fromHSV([1, 1, 1])).toEqualTypeOf<Color>();
expectTypeOf(Color.fromHSL([1, 1, 1])).toEqualTypeOf<Color>();
expectTypeOf(Color.fromLinearRGB([1, 1, 1])).toEqualTypeOf<Color>();
