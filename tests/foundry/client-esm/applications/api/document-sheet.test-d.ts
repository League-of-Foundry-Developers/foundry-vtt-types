import { expectTypeOf } from "vitest";
import type { default as DocSheetV2Namespace } from "../../../../../src/foundry/client-esm/applications/api/document-sheet.d.mts";
import type { DeepPartial } from "fvtt-types/utils";

const { DocumentSheetV2 } = foundry.applications.api;

declare const documentSheetV2: InstanceType<typeof DocumentSheetV2>;

expectTypeOf(documentSheetV2.document).toEqualTypeOf<foundry.abstract.Document.Any>();
expectTypeOf(documentSheetV2.title).toEqualTypeOf<string>();
expectTypeOf(documentSheetV2.isVisible).toEqualTypeOf<boolean>();
expectTypeOf(documentSheetV2.isEditable).toEqualTypeOf<boolean>();

declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;
expectTypeOf(documentSheetV2._processFormData(event, form, formData)).toEqualTypeOf<object>();
expectTypeOf(documentSheetV2._processSubmitData(event, form, formData)).toEqualTypeOf<Promise<void>>();
expectTypeOf(documentSheetV2.submit()).toEqualTypeOf<Promise<void>>();

expectTypeOf(DocumentSheetV2.DEFAULT_OPTIONS).toEqualTypeOf<DeepPartial<DocSheetV2Namespace.Configuration> & object>();
