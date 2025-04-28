import { expectTypeOf } from "vitest";

import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import Document = foundry.abstract.Document;

declare const documentSheetV2: DocumentSheetV2<Document.Any>;

expectTypeOf(documentSheetV2.document).toEqualTypeOf<Document.Any>();
expectTypeOf(documentSheetV2.title).toEqualTypeOf<string>();
expectTypeOf(documentSheetV2.isVisible).toEqualTypeOf<boolean>();
expectTypeOf(documentSheetV2.isEditable).toEqualTypeOf<boolean>();

declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;
expectTypeOf(documentSheetV2._processFormData(event, form, formData)).toEqualTypeOf<object>();
expectTypeOf(documentSheetV2._processSubmitData(event, form, formData)).toEqualTypeOf<Promise<void>>();
expectTypeOf(documentSheetV2.submit()).toEqualTypeOf<Promise<void>>();

expectTypeOf(DocumentSheetV2.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
