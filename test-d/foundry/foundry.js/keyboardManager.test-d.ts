import { expectType } from 'tsd';

expectType<number>(KeyboardManager.MOUSE_WHEEL_RATE_LIMIT);
expectType<['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']>(KeyboardManager.DIGIT_KEYS);
expectType<{
  w: ['up'];
  a: ['left'];
  s: ['down'];
  d: ['right'];
  W: ['up'];
  A: ['left'];
  S: ['down'];
  D: ['right'];
  ArrowUp: ['up'];
  ArrowRight: ['right'];
  ArrowDown: ['down'];
  ArrowLeft: ['left'];
  Numpad1: ['down', 'left'];
  Numpad2: ['down'];
  Numpad3: ['down', 'right'];
  Numpad4: ['left'];
  Numpad6: ['right'];
  Numpad7: ['up', 'left'];
  Numpad8: ['up'];
  Numpad9: ['up', 'right'];
}>(KeyboardManager.MOVEMENT_KEYS);
expectType<{
  PageUp: 'in';
  PageDown: 'out';
  NumpadAdd: 'in';
  NumpadSubtract: 'out';
}>(KeyboardManager.ZOOM_KEYS);

declare const event: Event;
declare const interactionEvent: PIXI.InteractionEvent;
declare const keyboardEvent: KeyboardEvent;

const manager = new KeyboardManager();
expectType<boolean>(manager.isDown('1'));
expectType<boolean>(manager.isCtrl(event));
expectType<boolean>(manager.isCtrl(interactionEvent));
expectType<string>(manager.getKey(keyboardEvent));
expectType<typeof KeyboardManager.MOVEMENT_KEYS>(manager.moveKeys);
expectType<typeof KeyboardManager.DIGIT_KEYS>(manager.digitKeys);
expectType<typeof KeyboardManager.ZOOM_KEYS>(manager.zoomKeys);
expectType<boolean>(manager.hasFocus);
