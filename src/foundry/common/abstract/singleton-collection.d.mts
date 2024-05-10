import type { DocumentConstructor } from "../../../types/helperTypes.d.mts";
import EmbeddedCollection from "./embedded-collection.mjs";

/**
 * This class provides a {@link Collection} wrapper around a singleton embedded Document so that it can be interacted
 * with via a common interface.
 */
export default class SingletonEmbeddedCollection<D extends DocumentConstructor, P> extends EmbeddedCollection<D, P> {}
