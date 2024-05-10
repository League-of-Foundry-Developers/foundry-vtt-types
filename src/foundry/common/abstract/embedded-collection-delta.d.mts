import type { DocumentConstructor } from "../../../types/helperTypes.d.mts";
import EmbeddedCollection from "./embedded-collection.mjs";

/**
 * An embedded collection delta contains delta source objects that can be compared against other objects inside a base
 * embedded collection, and generate new embedded Documents by combining them.
 */
export default class EmbeddedCollectionDelta<D extends DocumentConstructor, P> extends EmbeddedCollection<D, P> {}
