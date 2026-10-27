import { expectTypeOf, test } from "vitest";

import SetupAuthenticationForm = foundry.setup.applications.SetupAuthenticationForm;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

test("foundry/setup/applications/setup-authentication-form", () => {
  const app = new SetupAuthenticationForm();

  expectTypeOf(app).toEqualTypeOf<SetupAuthenticationForm>();
  expectTypeOf(app).toExtend<ApplicationV2.Any>();
  expectTypeOf(app.render({ force: true })).toEqualTypeOf<Promise<SetupAuthenticationForm>>();
  expectTypeOf<SetupAuthenticationForm.RenderContext["usernameRequired"]>().toEqualTypeOf<boolean>();
});
