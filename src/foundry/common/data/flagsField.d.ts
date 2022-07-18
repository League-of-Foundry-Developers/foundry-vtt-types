// Note: This field and file does not in reality exist inside of Foundry. `flags` is simply defined as `new ObjectField()`.
// However within these types we would like to assign it a more concrete type than `Record<string, unknown>` just giving us this thin wrapper around ObjectField.

import { DataField, ObjectField } from './fields.mjs';
import { DocumentType } from '../../../types/helperTypes';

export declare namespace FlagsField {
  export type DefaultOptionsValue = ObjectField.DefaultOptionsValue;

  export type ExtraOptions = ObjectField.ExtraOptions;

  export type ExtendsOptions<DocumentName extends FlagsDocuments> = SimpleMerge<
    ObjectField.ExtendsOptions,
    { SourceType: FlagsType<DocumentName>; InitializedType: FlagsType<DocumentName> }
  >;

  type GetFlagsConfigProp<T, K> = K extends keyof T ? T[K] : {};

  type Coalesce<T, C, D> = Equals<Required<T>, Required<C>> extends true ? D : T;

  type FlagsType<DocumentName extends FlagsDocuments> = Coalesce<
    GetFlagsConfigProp<FlagConfig, DocumentName> & GetFlagsConfigProp<CoreFlags, DocumentName>,
    {},
    Record<string, unknown>
  >;

  interface CoreFlags {
    ActiveEffect: {
      core?: { statusId?: string; overlay?: boolean };
    };
  }
}

type FlagsDocuments = Exclude<DocumentType, 'Setting'> | ValueOf<typeof CONST.PACKAGE_TYPES> | 'package';

export declare class FlagsField<
  DocumentName extends FlagsDocuments,
  Options extends DataField.Options<ExtendsOptions>,
  ExtendsOptions extends DataField.AnyExtendsOptions = FlagsField.ExtendsOptions<DocumentName>
> extends ObjectField<Options, ExtendsOptions> {}
