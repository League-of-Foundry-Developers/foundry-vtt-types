import { expectType } from 'tsd';
import '../../../../index';

class NoIcon extends PlaceableObject {
  controlIcon!: null;
  get bounds(): NormalizedRectangle {
    throw new Error('Not implemented');
  }
  async draw() {
    return this;
  }
  refresh() {
    return this;
  }
}
expectType<MouseInteractionManager<NoIcon, NoIcon | ControlIcon> | null>(new NoIcon().mouseInteractionManager);

class HasIcon extends PlaceableObject {
  get bounds(): NormalizedRectangle {
    throw new Error('Not implemented');
  }
  async draw() {
    return this;
  }
  refresh() {
    return this;
  }
}
expectType<MouseInteractionManager<HasIcon, HasIcon | ControlIcon> | null>(new HasIcon().mouseInteractionManager);
