import { assertType, expectTypeOf } from "vitest";
import type * as data from "../../../../../src/foundry/common/data/data.mjs/index.d.mts";

const doc = new AmbientLightDocument();

// Test the inheritance
expectTypeOf(doc.documentName).toEqualTypeOf<"AmbientLight">(); // Document
expectTypeOf(doc.uuid).toEqualTypeOf<string>(); // clientDocumentMixin
// TODO: change to <InstanceType<ObjectClass<AmbientLightDocument>> | null>  once the circular reference problem has been solved
expectTypeOf(doc.object).toEqualTypeOf<PlaceableObject | null>(); // canvasDocumentMixin
expectTypeOf(doc.isGlobal).toEqualTypeOf<boolean>(); // class itself

// Test the inheritance of static members
expectTypeOf(AmbientLightDocument.documentName).toEqualTypeOf<string>(); // Document
expectTypeOf(AmbientLightDocument.schema).toEqualTypeOf<typeof data.AmbientLightData>(); // Base-Document
expectTypeOf(AmbientLightDocument.createDialog()).toEqualTypeOf<Promise<AmbientLightDocument | null | undefined>>(); // ClientDocumentMixin

// Test the props
// TODO: change to <InstanceType<ObjectClass<AmbientLightDocument>> | null>  once the circular reference problem has been solved
assertType<PlaceableObject | null>(doc.object);
// TODO: change to <InstanceType<LayerClass<AmbientLightDocument>> | null>  once the circular reference problem has been solved
assertType<CanvasLayer | null>(doc.layer);
expectTypeOf(doc.rendered).toEqualTypeOf<boolean>();
