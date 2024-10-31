declare namespace AudioBufferCache {
  interface Entry {
    src: string;
    buffer: AudioBuffer;
    size: number;
    locked?: boolean;
    next?: Entry;
    previous?: Entry;
  }
}

/**
 * A specialized cache used for audio buffers.
 * This is an LRU cache which expires buffers from the cache once the maximum cache size is exceeded.
 */
declare class AudioBufferCache extends Map {}

export default AudioBufferCache;
