import { assertType } from "vitest";
import type { AnyFunction } from "fvtt-types/utils";

// prove that they are global
assertType<AnyFunction>(saveDataToFile);
assertType<AnyFunction>(readTextFromFile);
