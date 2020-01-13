/**
 * Export data content to be saved to a local file
 * @param data		Data content converted to a string
 * @param type		The type of
 * @param filename	The filename of the resulting download
 */
declare function saveDataToFile(data: string, type: string, filename: string): void;

/**
 * Read text data from a user provided File object
 * @param file	A File object
 * @return		A Promise which resolves to the loaded text data
 */
declare function readTextFromFile(file: File): Promise<string>;