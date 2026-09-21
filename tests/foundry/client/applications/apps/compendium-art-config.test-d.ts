import { expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import CompendiumArtConfig = foundry.applications.apps.CompendiumArtConfig;

test("foundry/client/applications/apps/compendium-art-config", () => {
  const artConfig = new CompendiumArtConfig();

  expectTypeOf(CompendiumArtConfig.DEFAULT_OPTIONS).toEqualTypeOf<CompendiumArtConfig.DefaultOptions>();

  // @ts-expect-error `_prepareContext` is protected
  void artConfig._prepareContext({ isFirstRender: true });

  class CustomArtConfig extends CompendiumArtConfig {
    protected override async _prepareContext(
      options: DeepPartial<CompendiumArtConfig.RenderOptions> & { isFirstRender: boolean },
    ): Promise<CompendiumArtConfig.RenderContext> {
      const context = await super._prepareContext(options);
      expectTypeOf(context.config).toEqualTypeOf<foundry.helpers.media.CompendiumArt.Descriptor[]>();
      return context;
    }
  }

  expectTypeOf(CustomArtConfig).toExtend<CompendiumArtConfig.AnyConstructor>();
});
