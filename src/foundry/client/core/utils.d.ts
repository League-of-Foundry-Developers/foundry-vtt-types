import { ClientDocumentMixin } from "../data/abstract/client-document";

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
   * @param uuid     - The uuid of the Entity or Embedded Entity to retrieve
   * @param relative - A document to resolve relative UUIDs against.
   */
  function fromUuid(
    uuid: string,
    relative?: ClientDocumentMixin<foundry.abstract.Document<any, any>>
  ): Promise<foundry.abstract.Document<any, any> | null>;

  /**
   * Retrieve a Document by its Universally Unique Identifier (uuid) synchronously. If the uuid resolves to a compendium
   * document, that document's index entry will be returned instead.
   * @param uuid     - The uuid of the Document to retrieve.
   * @param relative - A document to resolve relative UUIDs against.
   * @returns The Document or its index entry if it resides in a Compendium, otherwise null.
   * @throws If the uuid resolves to a Document that cannot be retrieved synchronously.
   */
  function fromUuidSync(
    uuid: string,
    relative?: ClientDocumentMixin<foundry.abstract.Document<any, any>>
  ): foundry.abstract.Document<any, any> | Record<string, unknown> | null;

  export interface ResolvedUUID {
    /** The parent collection. */
    collection?: DocumentCollection<any, any>;
    /** The parent document. */
    documentId?: string;
    /** An already-resolved document. */
    doc?: ClientDocumentMixin<foundry.abstract.Document<any, any>>;
    /** Any remaining Embedded Document parts. */
    embedded: string;
  }

  /**
   * Parse a UUID into its constituent parts.
   * @param uuid     - The UUID to parse.
   * @param relative - A document to resolve relative UUIDs against.
   * @returns Returns the Collection and the Document ID to resolve the parent document,
   * as well as the remaining Embedded Document parts, if any.
   * @internal
   */
  function _parseUuid(uuid: string, relative?: ClientDocumentMixin<foundry.abstract.Document<any, any>>): ResolvedUUID;

  /**
   * Resolve a series of embedded document UUID parts against a parent Document.
   * @param parent - The parent Document.
   * @param parts  - A series of Embedded Document UUID parts.
   * @returns The resolved Embedded Document.
   * @internal
   */
  function _resolveEmbedded(
    parent: foundry.abstract.Document<any, any>,
    parts: string[]
  ): foundry.abstract.Document<any, any>;

  /**
   * Resolve a UUID relative to another document.
   * The general-purpose algorithm for resolving relative UUIDs is as follows:
   * 1. If the number of parts is odd, remove the first part and resolve it against the current document and update the
   *    current document.
   * 2. If the number of parts is even, resolve embedded documents against the current document.
   * @param uuid     - The UUID to resolve.
   * @param relative - The document to resolve against.
   * @internal
   */
  function _resolveRelativeUuid(
    uuid: string,
    relative: ClientDocumentMixin<foundry.abstract.Document<any, any>>
  ): ResolvedUUID;

  /**
   * Return a reference to the Document class implementation which is configured for use.
   * @param documentName - The canonical Document name, for example "Actor"
   * @returns configured Document class implementation
   */
  function getDocumentClass<DocumentName extends string>(
    documentName: DocumentName
  ): DocumentName extends keyof CONFIG
    ? "documentClass" extends keyof CONFIG[DocumentName]
      ? CONFIG[DocumentName]["documentClass"]
      : undefined
    : undefined;
}
