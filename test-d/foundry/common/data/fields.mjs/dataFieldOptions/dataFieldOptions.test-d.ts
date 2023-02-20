import { expectType } from "tsd";

interface BothFalseOptions extends DataFieldOptions<number> {
  nullable: false;
  required: false;
}
declare const bothFalse: Required<BothFalseOptions>;
expectType<number | undefined | ((initialData: any) => number | undefined)>(bothFalse.initial);

interface BothTrueOptions extends DataFieldOptions<number> {
  nullable: true;
  required: true;
}
declare const bothTrue: Required<BothTrueOptions>;
expectType<number | null | ((initialData: any) => number | null)>(bothTrue.initial);

interface NullableTrueOptions extends DataFieldOptions<number> {
  nullable: true;
  required: false;
}
declare const nullableTrue: Required<NullableTrueOptions>;
expectType<number | null | undefined | ((initialData: any) => number | null | undefined)>(nullableTrue.initial);

interface RequiredTrueOptions extends DataFieldOptions<number> {
  nullable: false;
  required: true;
}
declare const requiredTrue: Required<RequiredTrueOptions>;
expectType<number | ((initialData: any) => number)>(requiredTrue.initial);
