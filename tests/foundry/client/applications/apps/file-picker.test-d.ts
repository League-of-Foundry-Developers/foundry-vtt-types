import { expectTypeOf } from "vitest";

import FilePicker = foundry.applications.apps.FilePicker;

declare const sourceType: FilePicker.SourceType;

expectTypeOf(sourceType).toEqualTypeOf<"data" | "public" | "s3">();

declare const myFile: File;

const response = await FilePicker.upload("foo", "bar", myFile);

expectTypeOf(response).toEqualTypeOf<FilePicker.UploadReturn>();

const myPicker = new FilePicker();

// eslint-disable-next-line @typescript-eslint/no-deprecated
myPicker.render(true);
myPicker.render({ force: true });

expectTypeOf(FilePicker.LAST_BROWSED_DIRECTORY).toEqualTypeOf<string>();
expectTypeOf(FilePicker.LAST_TILE_SIZE).toEqualTypeOf<number | null>();
expectTypeOf(FilePicker.LAST_DISPLAY_MODE).toEqualTypeOf<FilePicker.DisplayMode>();
expectTypeOf(FilePicker.FILE_TYPES).toEqualTypeOf<FilePicker.Type[]>();
expectTypeOf(FilePicker.fromButton(document.createElement("button"))).toEqualTypeOf<FilePicker.Implementation>();
expectTypeOf(FilePicker.requestTokenImages("someActorId")).toEqualTypeOf<Promise<string[]>>();
expectTypeOf(FilePicker.requestTokenImages("someActorId", { pack: "world.actors" })).toEqualTypeOf<Promise<string[]>>();
expectTypeOf(FilePicker.createDirectory("data", "foo")).toEqualTypeOf<Promise<FilePicker.CreateDirectoryReturn>>();

// `"graphics"` and `"texture"` are new in V14.
declare const graphicsType: "graphics";
declare const textureType: "texture";
expectTypeOf(graphicsType).toExtend<FilePicker.Type>();
expectTypeOf(textureType).toExtend<FilePicker.Type>();

expectTypeOf(myPicker.result).toEqualTypeOf<FilePicker.BrowseReturn>();
expectTypeOf(myPicker.extensions).toEqualTypeOf<string[]>();
expectTypeOf(myPicker.displayMode).toEqualTypeOf<FilePicker.DisplayMode>();
expectTypeOf(myPicker.source).toEqualTypeOf<FilePicker.SourceInfo | FilePicker.S3SourceInfo>();
expectTypeOf(myPicker.canCreateFolder).toEqualTypeOf<boolean>();
expectTypeOf(myPicker.canUpload).toEqualTypeOf<boolean>();

// New protected surface is reachable from a subclass.
class CustomFilePicker extends FilePicker {
  protected override _inferSourceAndTarget(target: string): [FilePicker.SourceType, string] {
    return super._inferSourceAndTarget(target);
  }

  protected override _tearDown(options: foundry.applications.api.ApplicationV2.ClosingOptions): void {
    super._tearDown(options);
  }
}
void CustomFilePicker;
