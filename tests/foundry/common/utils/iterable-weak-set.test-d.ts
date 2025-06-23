import { expectTypeOf } from "vitest";
import IterableWeakSet = foundry.utils.IterableWeakSet;

type ElementType = { x: number };
const element = { x: 20, y: 5 };

const myIWS = new IterableWeakSet<ElementType>([{ x: 4 }, { x: 17 }, { x: 15 }, element]);
const inferredIWS = new IterableWeakSet([{ x: 2 }, { x: 5 }]);

expectTypeOf(inferredIWS).toEqualTypeOf<typeof myIWS>();

expectTypeOf(myIWS.add({ x: 1 })).toEqualTypeOf<IterableWeakSet<ElementType>>();
expectTypeOf(myIWS.add(element)).toEqualTypeOf<IterableWeakSet<ElementType>>();

expectTypeOf(myIWS.delete({ x: 1 })).toEqualTypeOf<boolean>();
expectTypeOf(myIWS.has({ x: 1 })).toEqualTypeOf<boolean>();

expectTypeOf(myIWS.values()).toEqualTypeOf<Generator<ElementType, void, undefined>>();

expectTypeOf(myIWS.clear()).toBeVoid();

for (const el of myIWS) {
  expectTypeOf(el).toEqualTypeOf<ElementType>();
}
