import { expectTypeOf } from "vitest";

interface SortingStructure {
  target: number;
  update: {
    sortKey: number;
  };
}

declare const input: SortingStructure;
expectTypeOf(SortingHelpers.performIntegerSort(input, {})).toEqualTypeOf<
  Array<{ target: SortingStructure; update: { sort: number } }>
>();
