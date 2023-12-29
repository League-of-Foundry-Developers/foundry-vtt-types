import { expectType } from "tsd";

declare const numArray: DataFieldOptions.Choices<(1 | 2)[]>;
expectType<1 | 2>(numArray);

declare const numArrayFunction: DataFieldOptions.Choices<() => (1 | 2 | 3)[]>;
expectType<1 | 2 | 3>(numArrayFunction);

declare const numRecord: DataFieldOptions.Choices<{ 1: "1"; 2: "2"; 3: "3"; 4: "4" }>;
expectType<1 | 2 | 3 | 4>(numRecord);

declare const numRecordFunction: DataFieldOptions.Choices<() => { 1: "1"; 2: "2"; 3: "3"; 4: "4"; 5: "5" }>;
expectType<1 | 2 | 3 | 4 | 5>(numRecordFunction);

declare const stringArray: DataFieldOptions.Choices<("a" | "b")[]>;
expectType<"a" | "b">(stringArray);

declare const stringArrayFunction: DataFieldOptions.Choices<() => ("a" | "b" | "c")[]>;
expectType<"a" | "b" | "c">(stringArrayFunction);

declare const stringRecord: DataFieldOptions.Choices<{ d: "e"; f: "g"; h: "j" }>;
expectType<"d" | "f" | "h">(stringRecord);

declare const stringRecordFunction: DataFieldOptions.Choices<() => { k: "l"; m: "n"; o: "p" }>;
expectType<"k" | "m" | "o">(stringRecordFunction);
