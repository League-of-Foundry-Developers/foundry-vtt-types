import type { ConfiguredDocumentClass } from "../../../types/helperTypes.mts";
import type { Merge } from "../../../types/utils.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type * as data from "../data/data.mjs/index.mts";
import type { BaseScene } from "./baseScene.mts";
import type { BaseUser } from "./baseUser.mts";

type NoteMetadata = Merge<
  DocumentMetadata,
  {
    name: "Note";
    collection: "notes";
    label: "DOCUMENT.Note";
    labelPlural: "DOCUMENT.Notes";
    isEmbedded: true;
    permissions: {
      create: "NOTE_CREATE";
    };
  }
>;

/**
 * The base Note model definition which defines common behavior of an Note document between both client and server.
 */
export declare class BaseNote extends Document<
  data.NoteData,
  InstanceType<ConfiguredDocumentClass<typeof BaseScene>>,
  NoteMetadata
> {
  static override get schema(): typeof data.NoteData;

  static override get metadata(): NoteMetadata;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }?: { exact?: boolean },
  ): boolean;
}
