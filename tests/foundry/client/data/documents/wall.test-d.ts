import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

declare const scene: Scene;

// @ts-expect-error requires 'c'
new WallDocument();

// @ts-expect-error requires 'c'
new WallDocument({});

new WallDocument({ c: [0, 0, 0, 0] });
new WallDocument({ c: [0, 0, 0, 0] }, { parent: scene });

// TODO: Delete, reimplement in a class that makes more sense like Scene
// @LukeAbby The actual implementation here is nonsense for the available document types, but it shows narrowing BUT it also shows that the CreateData is odd.
class MyWallDocument extends WallDocument {
  protected override _preCreateDescendantDocuments<
    DescendantDocumentType extends typeof WallDocument | typeof AmbientLightDocument,
    Parent extends Document.Any,
    CreateData extends Document.CreateDataFor<DescendantDocumentType>,
    Temporary extends boolean | undefined,
    Operation extends foundry.abstract.types.DatabaseCreateOperation<CreateData, Parent, Temporary>,
  >(
    parent: Parent,
    collection: DescendantDocumentType["metadata"]["collection"],
    data: CreateData[],
    options: Document.Database.CreateOptions<Operation>,
    userId: string,
  ): void {
    super._preCreateDescendantDocuments(parent, collection, data, options, userId);

    switch (collection) {
      case "walls":
        for (const d of data) {
          expectTypeOf(d.sound).toEqualTypeOf<CONST.WALL_SENSE_TYPES>();
        }
        break;
      // @ts-expect-error "doors" is not a valid collection
      case "doors":
        break;
    }
  }
}

declare const _myWall: MyWallDocument;
