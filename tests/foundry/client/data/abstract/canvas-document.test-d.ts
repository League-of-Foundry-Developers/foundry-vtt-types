import { assertType, expectTypeOf } from "vitest";
import type { FixedInstanceType } from "fvtt-types/utils";

import Document = foundry.abstract.Document;

const doc = new AmbientLightDocument.implementation();

// Test the inheritance
expectTypeOf(doc.documentName).toEqualTypeOf<"AmbientLight">(); // Document
expectTypeOf(doc.uuid).toEqualTypeOf<string>(); // clientDocumentMixin
expectTypeOf(CONFIG.AmbientLight.objectClass).toEqualTypeOf<Document.ConfiguredObjectClassForName<"AmbientLight">>(); // proof the following should work
expectTypeOf(doc.object).toEqualTypeOf<AmbientLight.Object | null>(); // canvasDocumentMixin
expectTypeOf(doc.layer).toEqualTypeOf<LightingLayer>(); // canvasDocumentMixin
expectTypeOf(doc.isGlobal).toEqualTypeOf<boolean>(); // class itself
expectTypeOf(doc.compendium).toEqualTypeOf<undefined>(); // TODO: Determine if embedded documents can have this metadata

// Test the inheritance of static members
expectTypeOf(AmbientLightDocument.documentName).toEqualTypeOf<string>(); // Document
expectTypeOf(AmbientLightDocument.createDialog()).toEqualTypeOf<
  Promise<AmbientLightDocument.Implementation | null | undefined>
>(); // ClientDocumentMixin

// Test the props
assertType<FixedInstanceType<Document.ConfiguredObjectClassForName<"AmbientLight">> | null>(doc.object);
assertType<FixedInstanceType<PlaceablesLayer.ImplementationClassFor<"AmbientLight">> | null>(doc.layer);
expectTypeOf(doc.rendered).toEqualTypeOf<boolean>();
