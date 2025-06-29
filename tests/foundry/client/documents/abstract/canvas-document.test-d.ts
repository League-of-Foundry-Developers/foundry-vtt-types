import { expectTypeOf } from "vitest";
import type { AmbientLight } from "#client/canvas/placeables/_module.d.mts";

import LightingLayer = foundry.canvas.layers.LightingLayer;

const doc = new AmbientLightDocument.implementation();

// Test the inheritance
expectTypeOf(doc.documentName).toEqualTypeOf<"AmbientLight">(); // Document
expectTypeOf(doc.uuid).toEqualTypeOf<string>(); // clientDocumentMixin
expectTypeOf(CONFIG.AmbientLight.objectClass).toEqualTypeOf<AmbientLight.ImplementationClass>(); // proof the following should work
expectTypeOf(doc.object).toEqualTypeOf<AmbientLight.Implementation | null>(); // canvasDocumentMixin
expectTypeOf(doc.layer).toEqualTypeOf<LightingLayer>(); // canvasDocumentMixin
expectTypeOf(doc.isGlobal).toEqualTypeOf<boolean>(); // class itself
expectTypeOf(doc.compendium).toEqualTypeOf<undefined>(); // TODO: Determine if embedded documents can have this metadata

// Test the inheritance of static members
expectTypeOf(AmbientLightDocument.documentName).toEqualTypeOf<"AmbientLight">(); // Document
expectTypeOf(
  AmbientLightDocument.createDialog({}, { parent: new Scene.implementation({ name: "Scene" }) }),
).toEqualTypeOf<Promise<AmbientLightDocument.Stored | null | undefined>>(); // ClientDocumentMixin

// Test the props
expectTypeOf(doc.object).toEqualTypeOf<AmbientLight.Implementation | null>();
expectTypeOf(doc.layer).toEqualTypeOf<LightingLayer.Any>();
expectTypeOf(doc.rendered).toEqualTypeOf<boolean>();
