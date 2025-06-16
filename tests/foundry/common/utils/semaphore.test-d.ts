import { expectTypeOf } from "vitest";
import Semaphore = foundry.utils.Semaphore;

new Semaphore();

const lock = new Semaphore(4);

expectTypeOf(lock.add(async (s: string) => !s, "test")).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(lock.add(async () => false)).toEqualTypeOf<Promise<boolean>>();

// @ts-expect-error - The callback needs one argument.
lock.add(async (s: string) => !s);

// @ts-expect-error - The callback doesn't need any arguments.
lock.add(async () => false, "");

expectTypeOf(lock.remaining).toEqualTypeOf<number>();
expectTypeOf(lock.active).toEqualTypeOf<number>();
expectTypeOf(lock.clear()).toEqualTypeOf<void>();
