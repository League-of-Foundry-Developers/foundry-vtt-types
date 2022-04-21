/**
 * Export data content to be saved to a local file
 * @param data     - Data content converted to a string
 * @param type     - The type of
 * @param filename - The filename of the resulting download
 */
declare function saveDataToFile(data: string, type: string, filename: string): void;

/**
 * Read text data from a user provided File object
 * @param file - A File object
 * @returns A Promise which resolves to the loaded text data
 */
declare function readTextFromFile(file: File): Promise<string>;

/**
 * Retrieve an Entity or Embedded Entity by its Universally Unique Identifier (uuid).
 * @param uuid - The uuid of the Entity or Embedded Entity to retrieve
 */
declare function fromUuid(uuid: string): Promise<foundry.abstract.Document<any, any> | null>;

/**
 * Return a reference to the Document class implementation which is configured for use.
 * @param documentName - The canonical Document name, for example "Actor"
 * @returns configured Document class implementation
 */
declare function getDocumentClass<DocumentName extends string>(
  documentName: DocumentName
): DocumentName extends keyof CONFIG
  ? 'documentClass' extends keyof CONFIG[DocumentName]
    ? CONFIG[DocumentName]['documentClass']
    : undefined
  : undefined;
