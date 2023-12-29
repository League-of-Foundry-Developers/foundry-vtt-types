import { expectType } from "tsd";

declare const bothFalse: DataFieldOptions.InitialReturnType<number, false, false>;
expectType<number | undefined>(bothFalse);

declare const bothTrue: DataFieldOptions.InitialReturnType<number, true, true>;
expectType<number | null>(bothTrue);

declare const nullableTrue: DataFieldOptions.InitialReturnType<number, true, false>;
expectType<number | null | undefined>(nullableTrue);

declare const requiredTrue: DataFieldOptions.InitialReturnType<number, false, true>;
expectType<number>(requiredTrue);
