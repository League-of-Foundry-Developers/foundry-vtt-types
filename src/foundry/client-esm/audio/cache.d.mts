import type { Identity } from "../../../utils/index.d.mts";

/**
 * A specialized cache used for audio buffers.
 * This is an LRU cache which expires buffers from the cache once the maximum cache size is exceeded.
 */
declare class AudioBufferCache extends Map {
  /**
   * Construct an AudioBufferCache providing a maximum disk size beyond which entries are expired.
   * @param cacheSize - The maximum cache size in bytes. 1GB by default.
   */
  constructor(cacheSize?: number);

  /**
   * A string representation of the current cache utilization.
   */
  get usage(): AudioBufferCache.Usage;

  /**
   * Retrieve an AudioBuffer from the cache.
   * @param src - The audio buffer source path
   * @returns The cached audio buffer, or undefined
   */
  getBuffer(src: string): AudioBuffer | undefined;

  /**
   * Insert an AudioBuffer into the buffers cache.
   * @param src    - The audio buffer source path
   * @param buffer - The audio buffer to insert
   */
  setBuffer(src: string, buffer: AudioBuffer): this;

  /**
   * Delete an entry from the cache.
   * @param src - The audio buffer source path
   * @returns Was the buffer deleted from the cache?
   */
  delete(src: string): boolean;

  /**
   * Lock a buffer, preventing it from being expired even if it is least-recently-used.
   * @param src    - The audio buffer source path
   * @param locked - Lock the buffer, preventing its expiration?
   */
  // locked: not null (put directly into an Entry)
  lock(src: string, locked?: boolean): void;

  override toString(): string;
}

declare namespace AudioBufferCache {
  interface Any extends AnyAudioBufferCache {}
  interface AnyConstructor extends Identity<typeof AnyAudioBufferCache> {}

  interface Entry {
    src: string;
    buffer: AudioBuffer;
    size: number;
    locked?: boolean;
    next?: Entry;
    previous?: Entry;
  }

  /** Return type of {@link AudioBufferCache.usage | `AudioBufferCache#usage`} */
  interface Usage {
    current: number;
    max: number;
    pct: number;
    currentString: string;
    maxString: string;
    pctString: string;
  }
}

export default AudioBufferCache;

declare abstract class AnyAudioBufferCache extends AudioBufferCache {
  constructor(...args: never);
}
