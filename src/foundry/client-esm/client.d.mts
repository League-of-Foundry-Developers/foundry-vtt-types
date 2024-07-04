import * as _applications from "./applications/_module.mts";
import * as _audio from "./audio/_module.mts";
import * as _canvas from "./canvas/_module.mts";
// import * as _data from "./data/_module.mts";
import * as _dice from "./dice/_module.mts";

declare global {
  namespace foundry {
    export import applications = _applications;
    export import audio = _audio;
    export import canvas = _canvas;
    // TODO: Handle the merge
    // export import data = _data;
    export import dice = _dice;
  }
}
