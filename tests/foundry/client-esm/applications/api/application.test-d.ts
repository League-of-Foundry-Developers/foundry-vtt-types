const { ApplicationV2 } = foundry.applications.api;

// Regression test for issue where synchronous actions were not being allowed.
// Reported by @ethaks on Discord, see https://discord.com/channels/732325252788387980/793933527065690184/1266523231188422727.
class _TestApp extends ApplicationV2 {
  static override DEFAULT_OPTIONS = {
    actions: {
      someAction: this.someAction,
    },
  };

  static someAction(): void {
    return;
  }
}

// Regression test for `DEFAULT_OPTIONS` not being overrideable with unrelated options.
class _UnrelatedOptions extends ApplicationV2 {
  static override DEFAULT_OPTIONS = { dragDrop: [] };
}

// Regression test for `DeepPartial` not making interfaces partial.
class _DeeplyOptional extends ApplicationV2 {
  static override DEFAULT_OPTIONS = {
    window: {
      minimizable: true,
    },
  };
}
