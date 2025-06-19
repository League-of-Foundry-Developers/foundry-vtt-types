import { expectTypeOf } from "vitest";
import IterableWeakMap = foundry.utils.IterableWeakMap;

type KeyType = { x: number };
type ValueType = { y: string };

const satisfiesKey = { x: 1, foo: "bar" };
const satisfiesValue = { y: "baz", fizz: 42 };

const myIWM = new IterableWeakMap<KeyType, ValueType>([
  [{ x: 12 }, { y: "hi there" }],
  [satisfiesKey, satisfiesValue],
]);
const inferredIWM = new IterableWeakMap([[{ x: 70002 }, { y: "goodbye" }]]);

expectTypeOf(inferredIWM).toEqualTypeOf<typeof myIWM>();

expectTypeOf(myIWM.delete({ x: 1 })).toEqualTypeOf<boolean>();
expectTypeOf(myIWM.get({ x: 1 })).toEqualTypeOf<ValueType | undefined>();
expectTypeOf(myIWM.set({ x: 1 }, { y: "2" })).toEqualTypeOf<IterableWeakMap<KeyType, ValueType>>();
expectTypeOf(myIWM.clear()).toBeVoid();

for (const [k, v] of myIWM) {
  expectTypeOf(k).toEqualTypeOf<KeyType>();
  expectTypeOf(v).toEqualTypeOf<ValueType>();
}

// Note(LukeAbby): This is broken without the usage of `branded` because in fvtt-types the addition of `Array#partition` and `Array#equals` cause
// tuples to not be considered equal under Vitest.
expectTypeOf(myIWM.entries()).branded.toEqualTypeOf<Generator<[{ x: number }, { y: string }], void, undefined>>();
expectTypeOf(myIWM.keys()).toEqualTypeOf<Generator<{ x: number }, void, undefined>>();
expectTypeOf(myIWM.values()).toEqualTypeOf<Generator<{ y: string }, void, undefined>>();
