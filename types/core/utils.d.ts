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

/**
 * A cheap data duplication trick, surprisingly relatively performant
 * @param original	Some sort of data
 */
declare function duplicate(original: any): any;

/**
 * Learn the named type of a token - extending the functionality of typeof to recognize some core Object types
 * @param token	Some passed token
 * @return		The named type of the token
 */
declare function getType(token: any): string;

/**
 * Update a source object by replacing its keys and values with those from a target object.
 *
 * @param original		The initial object which should be updated with values from the target
 * @param other			A new object whose values should replace those in the source
 * @param insert		Control whether to insert new parent objects in the structure which did not previously
 *						exist in the source object.
 * @param overwrite		Control whether to replace existing values in the source, or only merge values which
 *						do not exist in the source.
 * @param inplace		Update the values of original inplace? Otherwise duplicate the original and return a
 *						safe copy.
 * @param enforceTypes	Enforce that the type of an inner value in the source object match the type of the
 *                              new value. Default is false for now (for BC), but should be true in the future.
 * @param _d			A privately used parameter to track recursion depth
 *
 * @returns				The original source object including updated, inserted, or overwritten records
 */
declare function mergeObject(original: any, other: any): any;