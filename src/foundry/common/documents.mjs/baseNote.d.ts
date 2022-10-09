import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import { BaseScene } from "./baseScene";
import { BaseUser } from "./baseUser";

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
    { exact }?: { exact?: boolean }
  ): boolean;
}
