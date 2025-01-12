// eslint-disable-next-line import/extensions
import * as worker from "../../../../types/workers/image-compressor";

declare global {
  // TYPES:

  export import FORMATS = worker.FORMATS;
  export import Debug = worker.Debug;

  export import ProcessBufferToBase64Options = worker.ProcessBufferToBase64Options;
  export import ProcessBufferRedtoBufferRGBAOptions = worker.ProcessBufferRedtoBufferRGBAOptions;

  export import ProcessBufferToBase64Return = worker.ProcessBufferToBase64Return;
  export import ProcessBufferRedToBufferRGBAReturn = worker.ProcessBufferRedToBufferRGBAReturn;

  // FUNCTIONS:

  export import processBufferToBase64 = worker.processBufferToBase64;

  export import processBufferRedToBufferRGBA = worker.processBufferRedToBufferRGBA;

  export import controlHashes = worker.controlHashes;

  export import pixelsToOffscreenCanvas = worker.pixelsToOffscreenCanvas;

  export import offscreenToBase64 = worker.offscreenToBase64;

  export import blobToBase64 = worker.blobToBase64;

  export import expandBuffer = worker.expandBuffer;

  export import reduceBuffer = worker.reduceBuffer;
}
