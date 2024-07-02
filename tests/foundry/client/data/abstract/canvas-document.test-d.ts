import { assertType, expectTypeOf } from "vitest";
import type {
  ConfiguredLayerClassForName,
  ConfiguredObjectClassForName,
} from "../../../../../src/types/helperTypes.d.mts";

const doc = new AmbientLightDocument();

// Test the inheritance
expectTypeOf(doc.documentName).toEqualTypeOf<"AmbientLight">(); // Document
expectTypeOf(doc.uuid).toEqualTypeOf<string>(); // clientDocumentMixin
expectTypeOf(AmbientLight).toEqualTypeOf<ConfiguredObjectClassForName<"AmbientLight">>(); // proof the following should work
expectTypeOf(doc.object).toEqualTypeOf<AmbientLight | null>(); // canvasDocumentMixin
expectTypeOf(doc.layer).toEqualTypeOf<LightingLayer>(); // canvasDocumentMixin
expectTypeOf(doc.isGlobal).toEqualTypeOf<boolean>(); // class itself
expectTypeOf(doc.compendium).toEqualTypeOf<undefined>(); // TODO: Determine if embedded documents can have this metadata

// Test the inheritance of static members
expectTypeOf(AmbientLightDocument.documentName).toEqualTypeOf<string>(); // Document
expectTypeOf(AmbientLightDocument.createDialog()).toEqualTypeOf<Promise<AmbientLightDocument | null | undefined>>(); // ClientDocumentMixin

// Test the props
assertType<InstanceType<ConfiguredObjectClassForName<"AmbientLight">> | null>(doc.object);
assertType<InstanceType<ConfiguredLayerClassForName<"AmbientLight">> | null>(doc.layer);
expectTypeOf(doc.rendered).toEqualTypeOf<boolean>();
