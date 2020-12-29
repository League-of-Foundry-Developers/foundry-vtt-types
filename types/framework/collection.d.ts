/**
 * A reusable storage concept which blends the functionality of an Array with the efficient key-based lookup of a Map.
 * This concept is reused throughout Foundry VTT where a collection of uniquely identified elements is required.
 * @extends {Map}
 */
declare class Collection<T extends Entity> extends Map<string, T> {
	constructor(entries: T);

	/**
	 * When iterating over a Collection, we should iterate over its values instead of over its entries
	 * @returns IterableIterator<T> - Typescript doesn't allow this
	 */
	[Symbol.iterator](): any;

	/**
	 * Return an Array of all the entry values in the Collection
	 * @remarks
	 * This is an accessor in the original Javascript
	 * @returns Array<T> - Typescript doesn't allow this
	 */
	entries(): any;

	/**
	 * Find an entry in the Map using an functional condition.
	 * @see {Array#find}
	 *
	 * @param condition  The functional condition to test
	 * @return The value, if found, otherwise null
	 *
	 * @example
	 * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
	 * let a = c.find(entry => entry === "A");
	 */
	find(condition: (entity: T) => boolean): T | null;

	/**
	 * Filter the Collection, returning an Array of entries which match a functional condition.
	 * @see {Array#filter}
	 * @param condition  The functional condition to test
	 * @return An Array of matched values
	 *
	 * @example
	 * let c = new Collection([["a", "AA"], ["b", "AB"], ["c", "CC"]]);
	 * let hasA = c.filters(entry => entry.slice(0) === "A");
	 */
	filter(condition: (entity: T) => boolean): Array<T>;

	/**
	 * Get an element from the Collection by its key.
	 * @param key     The key of the entry to retrieve
	 * @param strict  Throw an Error if the requested id does not exist, otherwise return null. Default false
	 * @return The retrieved entry value, if the key exists, otherwise null
	 *
	 * @example
	 * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
	 * c.get("a"); // "A"
	 * c.get("d"); // null
	 * c.get("d", {strict: true}); // throws Error
	 */
	get(key: string, { strict }?: { strict?: boolean }): T | undefined;

	/**
	 * Get an entry from the Collection by name.
	 * Use of this method assumes that the objects stored in the collection have a "name" attribute.
	 * @param name    The name of the entry to retrieve
	 * @param strict  Throw an Error if the requested id does not exist, otherwise return null. Default false.
	 * @return The retrieved Entity, if one was found, otherwise null;
	 */
	getName(name: string, { strict }?: { strict?: boolean }): T | null;

	/**
	 * Transform each element of the Collection into a new form, returning an Array of transformed values
	 * @param transformer  The transformation function to apply to each entry value
	 * @return An Array of transformed values
	 */
	map<U>(transformer: (entity: T) => U): Array<U>;

	/**
	 * Reduce the Collection by applying an evaluator function and accumulating entries
	 * @see {Array#reduce}
	 * @param {Function} evaluator    A function which mutates the accumulator each iteration
	 * @param {any} initial           An initial value which accumulates with each iteration
	 * @return {any}                  The accumulated result
	 *
	 * @example
	 * let c = new Collection([["a", "A"], ["b", "B"], ["c", "C"]]);
	 * let letters = c.reduce((s, l) => {
	 *   return s + l;
	 * }, ""); // "ABC"
	 */
	reduce<U>(evaluator: (accumulator: U, entity: T) => U, initial: U): U;
}
