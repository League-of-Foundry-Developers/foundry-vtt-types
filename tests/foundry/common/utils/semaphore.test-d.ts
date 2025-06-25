import { expectTypeOf } from "vitest";
import Semaphore = foundry.utils.Semaphore;

new Semaphore();

const lock = new Semaphore(4);

expectTypeOf(lock.max).toBeNumber();
lock.max = 1; // writeable

expectTypeOf(lock.remaining).toEqualTypeOf<number>();
// @ts-expect-error This getter has no setter
lock.remaining = 7;

expectTypeOf(lock.active).toEqualTypeOf<number>();
// @ts-expect-error This getter has no setter
lock.active = 42;

expectTypeOf(lock.add(async (s: string) => !s, "test")).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(lock.add(async () => false)).toEqualTypeOf<Promise<boolean>>();

declare function foo(): Promise<string | number | null>;
expectTypeOf(await lock.add(foo)).toEqualTypeOf<string | number | null>();

// @ts-expect-error - The callback needs one argument.
lock.add(async (s: string) => !s);

// @ts-expect-error - The callback doesn't need any arguments.
lock.add(async () => false, "");

expectTypeOf(lock.clear()).toEqualTypeOf<void>();
