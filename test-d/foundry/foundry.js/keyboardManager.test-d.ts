import { expectType } from 'tsd';

type DigitKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
interface MovementKeys {
  W: ['up'];
  A: ['left'];
  S: ['down'];
  D: ['right'];
  ARROWUP: ['up'];
  ARROWRIGHT: ['right'];
  ARROWDOWN: ['down'];
  ARROWLEFT: ['left'];
  NUMPAD1: ['down', 'left'];
  NUMPAD2: ['down'];
  NUMPAD3: ['down', 'right'];
  NUMPAD4: ['left'];
  NUMPAD6: ['right'];
  NUMPAD7: ['up', 'left'];
  NUMPAD8: ['up'];
  NUMPAD9: ['up', 'right'];
}
interface ZoomKeys {
  PAGEUP: 'in';
  PAGEDOWN: 'out';
  NUMPADADD: 'in';
  NUMPADSUBTRACT: 'out';
}

expectType<DigitKeys>(KeyboardManager.DIGIT_KEYS);
expectType<MovementKeys>(KeyboardManager.MOVEMENT_KEYS);
expectType<ZoomKeys>(KeyboardManager.ZOOM_KEYS);

declare const event: Event;
declare const interactionEvent: PIXI.InteractionEvent;

const manager = new KeyboardManager();
expectType<boolean>(manager.isDown('1'));
expectType<boolean>(manager.isCtrl(event));
expectType<boolean>(manager.isCtrl(interactionEvent));
expectType<KeybindingActionBinding[]>(manager.moveKeys);
expectType<DigitKeys>(manager.digitKeys);
expectType<KeybindingActionBinding[]>(manager.zoomKeys);
expectType<boolean>(manager.hasFocus);
