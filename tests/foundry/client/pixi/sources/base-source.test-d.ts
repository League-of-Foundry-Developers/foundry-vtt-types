import { expectTypeOf } from "vitest";

class MyBaseSource extends PointSource {
  _refresh() {}

  _destroy() {}
}

const myBaseSource = new MyBaseSource();

expectTypeOf(myBaseSource.initialize()).toEqualTypeOf<MyBaseSource>();
