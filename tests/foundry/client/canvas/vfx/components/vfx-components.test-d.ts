import { describe, expectTypeOf, test } from "vitest";

import VFXShakeComponent = foundry.canvas.vfx.components.VFXShakeComponent;
import VFXScrollingTextComponent = foundry.canvas.vfx.components.VFXScrollingTextComponent;
import VFXPositionalSoundComponent = foundry.canvas.vfx.components.VFXPositionalSoundComponent;
import VFXParticleGeneratorComponent = foundry.canvas.vfx.components.VFXParticleGeneratorComponent;
import VFXSingleImpactComponent = foundry.canvas.vfx.components.VFXSingleImpactComponent;
import VFXSingleAttackComponent = foundry.canvas.vfx.components.VFXSingleAttackComponent;
import VFXComponent = foundry.canvas.vfx.VFXComponent;

const impactData = {
  type: "singleImpact",
  position: { reference: "target", deltas: { sort: 1 } },
  texture: "impact.png",
} satisfies VFXSingleImpactComponent.CreateData;

describe("VFXShakeComponent", () => {
  test("TYPE literal", () => {
    expectTypeOf(VFXShakeComponent.TYPE).toEqualTypeOf<"shake">();
  });

  test("extends VFXComponent", () => {
    const comp = new VFXShakeComponent({
      type: "shake",
      duration: 800,
      maxDisplacement: 18,
      returnSpeed: 0.1,
      smoothness: 0.5,
      target: "stage",
    });
    expectTypeOf(comp).toExtend<VFXComponent>();
  });

  test("defaulted schema fields can be omitted from construction data", () => {
    const comp = new VFXShakeComponent({ type: "shake" });
    expectTypeOf(comp).toExtend<VFXComponent>();
  });
});

describe("VFXScrollingTextComponent", () => {
  test("TYPE literal", () => {
    expectTypeOf(VFXScrollingTextComponent.TYPE).toEqualTypeOf<"scrollingText">();
  });
});

describe("VFXPositionalSoundComponent", () => {
  test("TYPE literal", () => {
    expectTypeOf(VFXPositionalSoundComponent.TYPE).toEqualTypeOf<"positionalSound">();
  });

  test("PositionalSoundData interface shape", () => {
    const data: VFXPositionalSoundComponent.PositionalSoundData = {
      src: "sounds/boom.ogg",
      align: 3,
      volume: 0.8,
      radius: 60,
      easing: true,
      walls: true,
    };
    expectTypeOf(data.src).toEqualTypeOf<string>();
  });
});

describe("VFXParticleGeneratorComponent", () => {
  test("TYPE literal", () => {
    expectTypeOf(VFXParticleGeneratorComponent.TYPE).toEqualTypeOf<"particleGenerator">();
  });
});

describe("VFXSingleImpactComponent", () => {
  test("TYPE literal", () => {
    expectTypeOf(VFXSingleImpactComponent.TYPE).toEqualTypeOf<"singleImpact">();
  });

  test("accepts object references with deltas in create data", () => {
    expectTypeOf(impactData.position).toEqualTypeOf<{ reference: string; deltas: { sort: number } }>();
  });
});

describe("VFXSingleAttackComponent", () => {
  test("TYPE literal", () => {
    expectTypeOf(VFXSingleAttackComponent.TYPE).toEqualTypeOf<"singleAttack">();
  });

  test("STEPS is the correct tuple", () => {
    expectTypeOf(VFXSingleAttackComponent.STEPS).toEqualTypeOf<["charge", "projectile", "impact"]>();
  });

  test("protected animation hooks are overridable", () => {
    class CustomAttackComponent extends VFXSingleAttackComponent {
      protected override _animateCharge(timings: VFXSingleAttackComponent.ChargeTimings): void {
        timings.chargeStart;
      }

      protected override _animateProjectile(timings: VFXSingleAttackComponent.ProjectileTimings): void {
        timings.projectileStart;
      }

      protected override _animateImpact(timings: VFXSingleAttackComponent.ImpactTimings): void {
        timings.impactStart;
      }

      protected override _getTimings(): VFXSingleAttackComponent.Timings {
        return super._getTimings();
      }

      protected override _destroy(): void {
        super._destroy();
      }
    }

    expectTypeOf<CustomAttackComponent>().toExtend<VFXSingleAttackComponent>();
  });

  test("flightPath is not public", () => {
    const component = null as unknown as VFXSingleAttackComponent;
    // @ts-expect-error flightPath is a runtime private field with no public accessor.
    component.flightPath;
  });
});
