import { assertType } from "vitest";

// prove that they are global
assertType<Function>(saveDataToFile);
assertType<Function>(readTextFromFile);
