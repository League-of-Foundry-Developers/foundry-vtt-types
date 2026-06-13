import { describe, expectTypeOf, test } from "vitest";

import TokenTurnMarker = foundry.canvas.placeables.tokens.TokenTurnMarker;
import Token = foundry.canvas.placeables.Token;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

// can't be runtime until we have a canonical test Token
declare const token: Token.Implementation;

describe("TokenTurnMarker Tests", async () => {
  test("Construction", () => {
    expectTypeOf(new TokenTurnMarker(token)).toEqualTypeOf<TokenTurnMarker>();
  });

  const ttm = new TokenTurnMarker(token);

  test("Miscellaneous", async () => {
    expectTypeOf(ttm.token).toEqualTypeOf<typeof token>();
    expectTypeOf(ttm.mesh).toEqualTypeOf<SpriteMesh | undefined>();
    expectTypeOf(ttm.animation.pulse.min).toBeNumber();
    expectTypeOf(await ttm.draw()).toBeVoid();
    expectTypeOf(ttm.animate(1437)).toBeVoid();
  });
});
