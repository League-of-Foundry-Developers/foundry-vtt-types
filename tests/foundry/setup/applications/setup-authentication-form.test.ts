import { describe, expect, expectTypeOf, test } from "vitest";

import SetupAuthenticationForm = foundry.setup.applications.SetupAuthenticationForm;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

// Setup apps are never rendered here: the tests run inside a world.
describe("SetupAuthenticationForm Tests", () => {
  test("Runtime", () => {
    expect(SetupAuthenticationForm.prototype).toBeInstanceOf(ApplicationV2);
    expect(SetupAuthenticationForm.DEFAULT_OPTIONS.id).toBe("setup-authentication");
    expect(Object.keys(SetupAuthenticationForm.PARTS)).toEqual(["form"]);

    const app = new SetupAuthenticationForm();
    expect(app.id).toBe("setup-authentication");
  });

  test("Types", () => {
    const app = new SetupAuthenticationForm();

    expectTypeOf(app).toEqualTypeOf<SetupAuthenticationForm>();
    expectTypeOf(app).toExtend<ApplicationV2.Any>();
    expectTypeOf<SetupAuthenticationForm["render"]>().toBeCallableWith({ force: true });
    expectTypeOf<SetupAuthenticationForm["render"]>().returns.toEqualTypeOf<Promise<SetupAuthenticationForm>>();
    expectTypeOf<SetupAuthenticationForm.RenderContext["usernameRequired"]>().toEqualTypeOf<boolean>();
  });
});
