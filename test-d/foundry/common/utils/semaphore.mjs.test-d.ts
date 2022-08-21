import { expectError, expectType } from "tsd";
import "../../index";

declare const lock: Semaphore;

expectType<Promise<boolean>>(lock.add(async (s: string) => !s, "test"));
expectType<Promise<boolean>>(lock.add(async () => false));

expectError(lock.add(async (s: string) => !s));
expectError(lock.add(async () => false, ""));
