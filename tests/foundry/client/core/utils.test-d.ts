import { assertType } from "vitest";
import type { AnyFunction } from "../../../../src/types/utils.d.mts";

// prove that they are global
assertType<AnyFunction>(saveDataToFile);
assertType<AnyFunction>(readTextFromFile);
