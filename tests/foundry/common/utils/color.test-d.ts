import { expectTypeOf } from "vitest";
// Color doesn't need to be imported as it's a blessed global

// test assignability to number
const _color1: number = new Color(0xffffff);
const _color2: number = Color.from(0xffff00);

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
expectTypeOf(color.toString()).toBeString();
expectTypeOf(color.toJSON()).toEqualTypeOf<string>();
expectTypeOf(color.toHTML()).toEqualTypeOf<string>();

expectTypeOf(color.equals(0xffaedb)).toEqualTypeOf<boolean>();
expectTypeOf(color.equals(Color.from([0.8, 0.2, 0.5]))).toEqualTypeOf<boolean>();

expectTypeOf(color.toRGBA(0.37)).toEqualTypeOf<string>();
expectTypeOf(color.mix(Color.from("#DEFCBA"), 0.4)).toEqualTypeOf<Color>();
expectTypeOf(color.multiply(new Color())).toEqualTypeOf<Color>();
expectTypeOf(color.add(new Color())).toEqualTypeOf<Color>();
expectTypeOf(color.subtract(new Color())).toEqualTypeOf<Color>();
expectTypeOf(color.maximize(new Color())).toEqualTypeOf<Color>();
expectTypeOf(color.minimize(new Color())).toEqualTypeOf<Color>();

for (const channel of color) {
  expectTypeOf(channel).toBeNumber();
}

expectTypeOf(color.applyRGB([128, 52, 236])).toEqualTypeOf<void>();

expectTypeOf(Color.mix(color, 0xbcccda, 0.7)).toEqualTypeOf<number>();
expectTypeOf(Color.multiplyScalar(color, 0x1246fa)).toEqualTypeOf<number>();
expectTypeOf(Color.maximize(color, 0x1246fa)).toEqualTypeOf<number>();
expectTypeOf(Color.maximizeScalar(color, 0x1246fa)).toEqualTypeOf<number>();
expectTypeOf(Color.addScalar(color, 0x1246fa)).toEqualTypeOf<number>();
expectTypeOf(Color.subtract(color, 0x1246fa)).toEqualTypeOf<number>();
expectTypeOf(Color.subtractScalar(color, 0x1246fa)).toEqualTypeOf<number>();
expectTypeOf(Color.minimize(color, 0x1246fa)).toEqualTypeOf<number>();
expectTypeOf(Color.minimizeScalar(color, 0x1246fa)).toEqualTypeOf<number>();
expectTypeOf(Color.applyRGB(color, [])).toEqualTypeOf<void>();

declare const cs: Color.Source;
expectTypeOf(Color.from(cs)).toEqualTypeOf<Color>();

expectTypeOf(Color.fromString("")).toEqualTypeOf<Color>();
expectTypeOf(Color.fromRGB([1, 1, 1])).toEqualTypeOf<Color>();
expectTypeOf(Color.fromRGBvalues(1, 1, 1)).toEqualTypeOf<Color>();
expectTypeOf(Color.fromHSV([1, 1, 1])).toEqualTypeOf<Color>();
expectTypeOf(Color.fromHSL([1, 1, 1])).toEqualTypeOf<Color>();
expectTypeOf(Color.fromLinearRGB([1, 1, 1])).toEqualTypeOf<Color>();
