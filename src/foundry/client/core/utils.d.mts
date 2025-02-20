import type { AnyObject, MustBeValidUuid } from "fvtt-types/utils";
import type Document from "../../common/abstract/document.d.mts";

declare const __Unset: unique symbol;

type __UnsetDocument = Document.Any & {
  [__Unset]: true;
};

declare class InvalidUuid extends foundry.abstract.Document<any, any, any> {}

type FromUuid<Uuid extends string> = Uuid extends `${string}.${string}.${infer Rest}`
  ? FromUuid<Rest>
  : Uuid extends `${infer DocumentType extends Document.Type}.${string}`
    ? Document.ImplementationInstanceFor<DocumentType>
    : InvalidUuid;

// TODO(LukeAbby): The usage of `Document.Type` when it's unset will not be necessary once `Document.Any` is more type safe.
type FromUuidValidate<
  ConcreteDocument extends Document.Any,
  Uuid extends string,
> = __UnsetDocument extends ConcreteDocument
  ? MustBeValidUuid<Uuid, Document.Type>
  : string extends Uuid
    ? string
    : MustBeValidUuid<Uuid, ConcreteDocument["documentName"]>;

declare global {
  /**
   * Export data content to be saved to a local file
   * @param data     - Data content converted to a string
   * @param type     - The type of
   * @param filename - The filename of the resulting download
   */
  function saveDataToFile(data: string, type: string, filename: string): void;

  /**
   * Read text data from a user provided File object
   * @param file - A File object
   * @returns A Promise which resolves to the loaded text data
   */
  function readTextFromFile(file: File): Promise<string>;

  /**
   * Retrieve an Entity or Embedded Entity by its Universally Unique Identifier (uuid).
   * @param uuid    - The uuid of the Entity or Embedded Entity to retrieve
   * @param options - Options to configure how a UUID is resolved.
   */
  function fromUuid<ConcreteDocument extends Document.Any = __UnsetDocument, const Uuid extends string = string>(
    uuid: FromUuidValidate<ConcreteDocument, Uuid> | null | undefined,
    options?: {
      /** A Document to resolve relative UUIDs against. */
      relative?: ClientDocument;
      /** Allow retrieving an invalid Document. (default: `false`) */
      invalid?: boolean;
    },
  ): Promise<(__UnsetDocument extends ConcreteDocument ? FromUuid<Uuid> : ConcreteDocument) | null>;

  /**
   * Retrieve a Document by its Universally Unique Identifier (uuid) synchronously. If the uuid resolves to a compendium
   * document, that document's index entry will be returned instead.
   * @param uuid     - The uuid of the Document to retrieve.
   * @param relative - A document to resolve relative UUIDs against.
   * @returns The Document or its index entry if it resides in a Compendium, otherwise null.
   * @throws If the uuid resolves to a Document that cannot be retrieved synchronously.
   */
  function fromUuidSync<ConcreteDocument extends Document.Any = __UnsetDocument, const Uuid extends string = string>(
    uuid: FromUuidValidate<ConcreteDocument, Uuid> | null | undefined,
    options?: {
      /** A Document to resolve relative UUIDs against. */
      relative?: ClientDocument;
      /** Allow retrieving an invalid Document. (default: `false`) */
      invalid?: boolean;
      /** Throw an error if the UUID cannot be resolved synchronously. (default: `true`) */
      strict?: boolean;
    },
  ): (__UnsetDocument extends ConcreteDocument ? FromUuid<Uuid> : ConcreteDocument) | AnyObject | null;

  /**
   * Resolve a series of embedded document UUID parts against a parent Document.
   * @param parent - The parent Document.
   * @param parts  - A series of Embedded Document UUID parts.
   * @returns The resolved Embedded Document.
   * @internal
   */
  function _resolveEmbedded(parent: foundry.abstract.Document.Any, parts: string[]): foundry.abstract.Document.Any;

  /**
   * Return a reference to the Document class implementation which is configured for use.
   * @param documentName - The canonical Document name, for example "Actor"
   * @returns configured Document class implementation
   */
  function getDocumentClass<Name extends Document.Type>(documentName: Name): Document.ImplementationClassFor<Name>;
}
