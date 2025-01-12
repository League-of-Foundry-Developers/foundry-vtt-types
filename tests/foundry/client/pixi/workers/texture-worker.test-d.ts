// eslint-disable-next-line import/extensions
import { FORMATS } from "../../../../../src/types/workers/image-compressor";

const myWorker = new TextureCompressor("foobar", {
  debug: true,
  scripts: ["./foobar"],
  loadPrimitives: true,
  controlHash: true,
});

const myBuffer = new Uint8ClampedArray();

myWorker.compressBufferBase64(myBuffer, 2, 3, {
  debug: true,
  quality: 1,
  type: "image/png",
  readFormat: FORMATS.RED,
});

myWorker.expandBufferRedToBufferRGBA(myBuffer, 2, 3, {
  debug: true,
});
