import { expectType } from 'tsd';
import { ConstructorArgFromDocumentField as ConstrArg } from '../../src/types/helperTypes';

interface BaseStringField extends DocumentField<string> {
  type: typeof String;
}
interface PermissiveBooleanField extends DocumentField<boolean> {
  type: typeof Boolean;
  required: false;
  nullable: true;
  default: false;
}
interface Optional {
  required: false;
}
interface Required {
  required: true;
}
interface NonNull {
  nullable: false;
}
interface Null {
  nullable: true;
}
interface Default {
  default: 'some string';
}
interface NoDefault {
  default: undefined;
}

expectType<string | null | undefined>({} as ConstrArg<BaseStringField>);
expectType<boolean | null | undefined>({} as ConstrArg<PermissiveBooleanField>);
expectType<string | null | undefined>({} as ConstrArg<BaseStringField & { type: object }>);

expectType<string | null | undefined>({} as ConstrArg<BaseStringField & Default & Optional & Null>);
expectType<string | null | undefined>({} as ConstrArg<BaseStringField & Default & Optional & NonNull>);
expectType<string | null | undefined>({} as ConstrArg<BaseStringField & Default & Required & Null>);
expectType<string | null | undefined>({} as ConstrArg<BaseStringField & Default & Required & NonNull>);
expectType<string | null | undefined>({} as ConstrArg<BaseStringField & NoDefault & Optional & Null>);
expectType<string | null | undefined>({} as ConstrArg<BaseStringField & NoDefault & Optional & NonNull>);
expectType<string | null>({} as ConstrArg<BaseStringField & NoDefault & Required & Null>);
expectType<string>({} as ConstrArg<BaseStringField & NoDefault & Required & NonNull>);
