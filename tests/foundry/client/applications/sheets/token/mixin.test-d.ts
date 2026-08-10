import { expectTypeOf } from "vitest";
import type { DeepPartial, RemoveIndexSignatures } from "fvtt-types/utils";

// Foundry does not re-export the mixin from `sheets/_module.mjs`, so it is imported directly.
import TokenApplicationMixin from "#client/applications/sheets/token/mixin.mjs";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import FormDataExtended = foundry.applications.ux.FormDataExtended;
import TokenConfig = foundry.applications.sheets.TokenConfig;
import PrototypeToken = foundry.data.PrototypeToken;

class CustomTokenApplication extends TokenApplicationMixin(ApplicationV2) {}

expectTypeOf(CustomTokenApplication).toExtend<TokenApplicationMixin.AnyMixedConstructor>();

declare const sheet: TokenConfig;

expectTypeOf<TokenApplicationMixin.Token>().toEqualTypeOf<TokenDocument.Implementation | PrototypeToken>();

expectTypeOf(TokenConfig.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();
expectTypeOf(TokenConfig.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

// The localized-label caches are keyed by the CONST value, not by its name.
expectTypeOf(TokenConfig.DISPLAY_MODES).toEqualTypeOf<Record<CONST.TOKEN_DISPLAY_MODES, string>>();
expectTypeOf(TokenConfig.TOKEN_DISPOSITIONS).toEqualTypeOf<Record<CONST.TOKEN_DISPOSITIONS, string>>();
expectTypeOf(TokenConfig.TURN_MARKER_MODES).toEqualTypeOf<Record<CONST.TOKEN_TURN_MARKER_MODES, string>>();
expectTypeOf(TokenConfig.TOKEN_SHAPES).toEqualTypeOf<Record<CONST.TOKEN_SHAPES, string>>();

expectTypeOf(sheet.isPrototype).toBeBoolean();
expectTypeOf(sheet.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(sheet["_fields"]).toEqualTypeOf<TokenDocument.Schema>();

declare const renderOptions: DeepPartial<TokenConfig.RenderOptions>;
declare const renderContext: TokenConfig.RenderContext;

expectTypeOf(sheet["_prepareContext"]({ ...renderOptions, isFirstRender: true })).toEqualTypeOf<
  Promise<TokenConfig.RenderContext>
>();
expectTypeOf(sheet["_preparePartContext"]("identity", renderContext, renderOptions)).toEqualTypeOf<
  Promise<TokenConfig.RenderContext>
>();

declare const formConfig: ApplicationV2.FormConfiguration;
declare const changeEvent: Event;
expectTypeOf(sheet["_onChangeForm"](formConfig, changeEvent)).toBeVoid();

declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;
expectTypeOf(sheet["_processFormData"](event, form, formData)).toEqualTypeOf<TokenApplicationMixin.SubmitData>();
expectTypeOf(sheet["_processFormData"](null, form, formData)).toEqualTypeOf<TokenApplicationMixin.SubmitData>();

expectTypeOf(sheet["_prepareIdentityTab"]()).toEqualTypeOf<TokenApplicationMixin.IdentityTabContext>();
expectTypeOf(sheet["_prepareVisionTab"]()).toEqualTypeOf<Promise<TokenApplicationMixin.VisionTabContext>>();
expectTypeOf(sheet["_prepareLightTab"]()).toEqualTypeOf<Promise<TokenApplicationMixin.LightTabContext>>();
expectTypeOf(sheet["_prepareResourcesTab"]()).toEqualTypeOf<Promise<TokenApplicationMixin.ResourcesTabContext>>();
expectTypeOf(sheet["_prepareButtons"]()).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

declare const submitData: TokenApplicationMixin.SubmitData;
expectTypeOf(sheet["_processChanges"](submitData)).toBeVoid();

// The form-only fields `_processChanges` folds into `texture` and then deletes.
expectTypeOf<TokenApplicationMixin.SubmitData["scale"]>().toEqualTypeOf<number | undefined>();
expectTypeOf<TokenApplicationMixin.SubmitData["mirrorX"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<TokenApplicationMixin.SubmitData["mirrorY"]>().toEqualTypeOf<boolean | undefined>();

/* Identity tab */

declare const identity: TokenApplicationMixin.IdentityTabContext;
expectTypeOf(identity.isGM).toBeBoolean();
expectTypeOf(identity.actors).toEqualTypeOf<TokenApplicationMixin.ActorChoice[]>();
expectTypeOf(identity.defaultMovementActionLabel).toBeString();
expectTypeOf(identity.movementActions).toEqualTypeOf<Record<string, string>>();
expectTypeOf(identity.dispositions).toEqualTypeOf<Record<CONST.TOKEN_DISPOSITIONS, string>>();

/* Appearance tab */

declare const appearance: TokenApplicationMixin.AppearanceTabContext;

// `undefined` for a PrototypeToken, which has no shape to configure.
expectTypeOf(appearance.shapes).toEqualTypeOf<Record<CONST.TOKEN_SHAPES, string> | undefined>();
expectTypeOf(appearance.hasAlternates).toBeBoolean();
expectTypeOf(appearance.alternateImages).toEqualTypeOf<Record<string, string>>();
expectTypeOf(appearance.colorationTechniques).toEqualTypeOf<
  typeof foundry.canvas.rendering.shaders.AdaptiveLightingShader.SHADER_TECHNIQUES
>();
expectTypeOf(appearance.randomImgEnabled).toBeBoolean();
expectTypeOf(appearance.scale).toBeNumber();
expectTypeOf(appearance.mirrorX).toBeBoolean();
expectTypeOf(appearance.mirrorY).toBeBoolean();
expectTypeOf(appearance.textureFitModes).toEqualTypeOf<Record<CONST.TEXTURE_DATA_FIT_MODES, string>>();
expectTypeOf(appearance.ringEffectsInput).toEqualTypeOf<TokenApplicationMixin.RingEffectsInput>();

// The ring subject texture path when enabled, `null` when none is configured, or `false` when disabled.
expectTypeOf(appearance.usingSubject).toEqualTypeOf<string | null | false>();

expectTypeOf<Parameters<TokenApplicationMixin.RingEffectsInput>[0]>().toEqualTypeOf<foundry.data.fields.NumberField>();
expectTypeOf<Parameters<TokenApplicationMixin.RingEffectsInput>[1]>().toEqualTypeOf<
  foundry.applications.fields.FormInputConfig<number>
>();
expectTypeOf<
  ReturnType<TokenApplicationMixin.RingEffectsInput>
>().toEqualTypeOf<foundry.applications.elements.HTMLMultiCheckboxElement>();

/* Vision tab */

declare const vision: TokenApplicationMixin.VisionTabContext;
expectTypeOf(vision.visionModes).toEqualTypeOf<Record<string, string>>();
expectTypeOf(vision.detectionModes).toEqualTypeOf<TokenApplicationMixin.DetectionModeContext[]>();

declare const detectionMode: TokenApplicationMixin.DetectionModeContext;
expectTypeOf(detectionMode.id).toBeString();

// `null` stands in for an infinite range.
expectTypeOf(detectionMode.range).toEqualTypeOf<number | null>();
expectTypeOf(detectionMode.source).toBeBoolean();
expectTypeOf(detectionMode.enabled).toBeBoolean();

/* Light tab */

declare const light: TokenApplicationMixin.LightTabContext;
expectTypeOf(light.lightAnimations).toEqualTypeOf<
  RemoveIndexSignatures<CONFIG.Canvas.LightAnimations> | RemoveIndexSignatures<CONFIG.Canvas.DarknessAnimations>
>();

/* Resources tab */

declare const resources: TokenApplicationMixin.ResourcesTabContext;
expectTypeOf(resources.barAttributes).toEqualTypeOf<TokenDocument.TrackedAttributesChoice[]>();

// `undefined` for a PrototypeToken, which does not implement `getBarAttribute`.
expectTypeOf(resources.bar1).toEqualTypeOf<TokenDocument.GetBarAttributeReturn | undefined>();
expectTypeOf(resources.bar2).toEqualTypeOf<TokenDocument.GetBarAttributeReturn | undefined>();
expectTypeOf(resources.turnMarkerAnimations).toEqualTypeOf<{ value: string; label: string }[]>();

/* Render context */

declare const mixinContext: TokenApplicationMixin.RenderContext<TokenDocument.Implementation>;
expectTypeOf(mixinContext.tabClasses).toBeString();
expectTypeOf(mixinContext.isPrototype).toBeBoolean();
expectTypeOf(mixinContext.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

// Tab members are only set for the part that consumes them.
expectTypeOf(mixinContext.tab).toEqualTypeOf<ApplicationV2.Tab | undefined>();
expectTypeOf(mixinContext.detectionModes).toEqualTypeOf<TokenApplicationMixin.DetectionModeContext[] | undefined>();
expectTypeOf<TokenApplicationMixin.PreparePartContext["detectionModes"]>().toEqualTypeOf<
  TokenApplicationMixin.DetectionModeContext[]
>();
