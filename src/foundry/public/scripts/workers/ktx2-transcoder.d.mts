import * as worker from "../../../../types/workers/ktx2-transcoder.mjs";

declare global {
  export import SupportedKTX2Extensions = worker.SupportedKTX2Extensions;
  export import TranscodeKTX2Options = worker.TranscodeKTX2Options;
  export import TranscodeKTX2Return = worker.TranscodeKTX2Return;

  export import KTX2_IDENTIFIER = worker.KTX2_IDENTIFIER;
  export import ktx = worker.ktx;

  export import initializeKTX2 = worker.initializeKTX2;
  export import transcodeKTX2 = worker.transcodeKTX2;
  export import readKTX2Header = worker.readKTX2Header;
  export import getKTX2TranscodeTarget = worker.getKTX2TranscodeTarget;
}
