import { expectTypeOf } from "vitest";

import AmbientLight = foundry.canvas.placeables.AmbientLight;

import LightingLayer = foundry.canvas.layers.LightingLayer;

const doc = new AmbientLightDocument.implementation();

// Test the inheritance
expectTypeOf(doc.documentName).toEqualTypeOf<"AmbientLight">(); // Document
expectTypeOf(doc.uuid).toEqualTypeOf<string | null>(); // clientDocumentMixin
expectTypeOf(CONFIG.AmbientLight.objectClass).toEqualTypeOf<AmbientLight.ImplementationClass>(); // proof the following should work
expectTypeOf(doc.object).toEqualTypeOf<AmbientLight.Implementation | null>(); // canvasDocumentMixin
expectTypeOf(doc.layer).toEqualTypeOf<LightingLayer>(); // canvasDocumentMixin
expectTypeOf(doc.isGlobal).toEqualTypeOf<boolean>(); // class itself
expectTypeOf(doc.compendium).toEqualTypeOf<foundry.documents.collections.CompendiumCollection<"Scene"> | null>(); // TODO: Determine if embedded documents can have this metadata

// Test the inheritance of static members
expectTypeOf(AmbientLightDocument.documentName).toEqualTypeOf<"AmbientLight">(); // Document
expectTypeOf(
  AmbientLightDocument.createDialog({}, { parent: new Scene.implementation({ name: "Scene" }) }),
).toEqualTypeOf<Promise<AmbientLightDocument.Stored | null>>(); // ClientDocumentMixin

// Test the props
expectTypeOf(doc.object).toEqualTypeOf<AmbientLight.Implementation | null>();
expectTypeOf(doc.layer).toEqualTypeOf<LightingLayer.Implementation>();
expectTypeOf(doc.rendered).toEqualTypeOf<boolean>();
expectTypeOf(doc.visible).toEqualTypeOf<boolean>();
expectTypeOf(doc.viewed).toEqualTypeOf<boolean>();

declare const level: Level.Implementation;
expectTypeOf(doc.includedInLevel(level)).toEqualTypeOf<boolean>();
expectTypeOf(doc.includedInLevel("someLevelId")).toEqualTypeOf<boolean>();
expectTypeOf(doc.locatedInLevel(level)).toEqualTypeOf<boolean>();
expectTypeOf(doc.locatedInLevel("someLevelId")).toEqualTypeOf<boolean>();

class TestAmbientLightDocument extends AmbientLightDocument {
  protected override async _refreshViewedState(): Promise<void> {
    await super._refreshViewedState();
  }
}

expectTypeOf(new TestAmbientLightDocument().viewed).toEqualTypeOf<boolean>();
