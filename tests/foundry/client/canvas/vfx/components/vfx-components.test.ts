import { describe, expectTypeOf, test } from "vitest";

import VFXShakeComponent = foundry.canvas.vfx.components.VFXShakeComponent;
import VFXScrollingTextComponent = foundry.canvas.vfx.components.VFXScrollingTextComponent;
import VFXPositionalSoundComponent = foundry.canvas.vfx.components.VFXPositionalSoundComponent;
import VFXParticleGeneratorComponent = foundry.canvas.vfx.components.VFXParticleGeneratorComponent;
import VFXSingleImpactComponent = foundry.canvas.vfx.components.VFXSingleImpactComponent;
import VFXSingleAttackComponent = foundry.canvas.vfx.components.VFXSingleAttackComponent;
import VFXComponent = foundry.canvas.vfx.VFXComponent;
import VFXPath = foundry.canvas.vfx.VFXPath;

import fields = foundry.data.fields;

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

  test("content remains required through the reference-field wrapper", () => {
    // @ts-expect-error content is required by the wrapped StringField
    const missingContent: VFXScrollingTextComponent.CreateData = {
      type: "scrollingText",
      origin: { x: 0, y: 0 },
    };
    expectTypeOf(missingContent).toEqualTypeOf<VFXScrollingTextComponent.CreateData>();
  });
});

describe("VFXPositionalSoundComponent", () => {
  test("TYPE literal", () => {
    expectTypeOf(VFXPositionalSoundComponent.TYPE).toEqualTypeOf<"positionalSound">();
  });

  test("initialized `type` narrows to the literal", () => {
    const comp = new VFXPositionalSoundComponent({ type: "positionalSound", src: "boom.ogg", x: 0, y: 0 });
    expectTypeOf(comp.type).toEqualTypeOf<"positionalSound">();
  });

  test("shared sound data is used by attack and impact components", () => {
    expectTypeOf<
      fields.SchemaField.InitializedData<VFXSingleAttackComponent.SoundSchema>
    >().toEqualTypeOf<VFXPositionalSoundComponent.PositionalSoundData>();
    expectTypeOf<
      fields.SchemaField.InitializedData<VFXSingleImpactComponent.SoundSchema>
    >().toEqualTypeOf<VFXPositionalSoundComponent.PositionalSoundData>();
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

  test("STEPS is an array of step names", () => {
    expectTypeOf(VFXSingleAttackComponent.STEPS).toEqualTypeOf<VFXSingleAttackComponent.StepName[]>();
    expectTypeOf<VFXSingleAttackComponent.StepName>().toEqualTypeOf<"charge" | "projectile" | "impact">();
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
    expectTypeOf<VFXSingleAttackComponent>().not.toHaveProperty("flightPath");
  });

  test("origin and destination are undefined before drawing", () => {
    expectTypeOf<VFXSingleAttackComponent["origin"]>().toEqualTypeOf<VFXPath.BasePathPoint | undefined>();
    expectTypeOf<VFXSingleAttackComponent["destination"]>().toEqualTypeOf<VFXPath.BasePathPoint | undefined>();
  });
});
