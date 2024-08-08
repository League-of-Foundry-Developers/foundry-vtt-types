import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../src/types/utils.d.mts";

const filepicker = new FilePicker();
expectTypeOf(filepicker).toEqualTypeOf<FilePicker>();

expectTypeOf(filepicker.request).toEqualTypeOf<string | undefined>();
expectTypeOf(filepicker.sources).toEqualTypeOf<FilePicker.Sources>();
expectTypeOf(filepicker.activeSource).toEqualTypeOf<FilePicker.SourceType>();

expectTypeOf(filepicker.callback).toEqualTypeOf<FilePicker.Callback | undefined>();
expectTypeOf(filepicker.results).toEqualTypeOf<{}>();
expectTypeOf(filepicker.type).toEqualTypeOf<FilePicker.Type>();
expectTypeOf(filepicker.field).toEqualTypeOf<HTMLElement | undefined>();
expectTypeOf(filepicker.button).toEqualTypeOf<HTMLElement | undefined>();
expectTypeOf(filepicker.displayMode).toEqualTypeOf<FilePicker.DisplayMode>();
expectTypeOf(filepicker.extensions).toEqualTypeOf<string[] | undefined>();

expectTypeOf(FilePicker.FILE_TYPES).toEqualTypeOf<string[]>();
expectTypeOf(FilePicker.LAST_BROWSED_DIRECTORY).toEqualTypeOf<string>();
expectTypeOf(FilePicker.LAST_TILE_SIZE).toEqualTypeOf<number | null>();
expectTypeOf(FilePicker.LAST_DISPLAY_MODE).toEqualTypeOf<FilePicker.DisplayMode>();

expectTypeOf(FilePicker.DISPLAY_MODES).toEqualTypeOf<["list", "thumbs", "tiles", "images"]>();
expectTypeOf(FilePicker.S3_BUCKETS).toEqualTypeOf<string[] | null>();
expectTypeOf(FilePicker.favorites).toEqualTypeOf<Record<string, FilePicker.FavoriteFolder>>();
expectTypeOf(FilePicker.setFavorite("", "")).toEqualTypeOf<Promise<void>>();
expectTypeOf(FilePicker.setFavorite("", "")).toEqualTypeOf<Promise<void>>();
expectTypeOf(FilePicker.defaultOptions).toEqualTypeOf<FilePickerOptions>();
expectTypeOf(FilePicker.matchS3URL("")).toEqualTypeOf<RegExpMatchArray | null>();

expectTypeOf(filepicker.title).toEqualTypeOf<string>();
expectTypeOf(filepicker.source).toEqualTypeOf<FilePicker.Source>();
expectTypeOf(filepicker.target).toEqualTypeOf<string>();
expectTypeOf(filepicker.canUpload).toEqualTypeOf<boolean>();
expectTypeOf(filepicker.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(filepicker.setPosition()).toEqualTypeOf<void | (Application.Position & { height: number })>();
expectTypeOf(filepicker.browse("")).toEqualTypeOf<Promise<FilePicker.BrowseResult>>();

expectTypeOf(FilePicker.browse("data", "")).toEqualTypeOf<Promise<FilePicker.BrowseResult>>();
expectTypeOf(FilePicker.configurePath("data", "")).toEqualTypeOf<Promise<FilePicker.ConfigurePathResult>>();
expectTypeOf(FilePicker.createDirectory("data", "")).toEqualTypeOf<Promise<string>>();

const file = new File([], "testfile");
expectTypeOf(FilePicker.upload("data", "", file)).toEqualTypeOf<Promise<FilePicker.UploadResult | false | void | {}>>();

expectTypeOf(FilePicker.uploadPersistent("", "", file)).toEqualTypeOf<
  Promise<FilePicker.UploadResult | false | void | {}>
>();

expectTypeOf(filepicker.render()).toEqualTypeOf<FilePicker>();
expectTypeOf(filepicker.activateListeners(jQuery("document"))).toEqualTypeOf<void>();

expectTypeOf(FilePicker.fromButton(new HTMLButtonElement())).toEqualTypeOf<FilePicker>();
