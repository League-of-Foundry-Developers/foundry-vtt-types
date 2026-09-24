import type { Canvas } from "#client/canvas/_module.d.mts";
import Token = foundry.canvas.placeables.Token;
import Ruler = foundry.canvas.interaction.Ruler;
import WorldCollection = foundry.documents.abstract.WorldCollection;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

/* eslint-disable @typescript-eslint/no-unused-vars */
// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

// eslint-disable-next-line import-x/export
export * from "#common/_types.mjs";

type ActorTrackableAttributes = CONFIG.Actor.TrackableAttribute;

type HotReloadData = Hooks.HotReloadData;

type RulerWaypoint = Ruler.Waypoint;

type TokenMeasureMovementPathOptions = Token.MeasureMovementPathOptions;

type TokenConstrainMovementPathOptions = Token.ConstrainMovementPathOptions;

type TokenCreateTerrainMovementPathOptions = Token.CreateTerrainMovementPathOptions;

type TokenFindMovementPathOptions = Token.FindMovementPathOptions;

type TokenFindMovementPathJob = Token.FindMovementPathJob;

type TokenRulerData = foundry.canvas.placeables.tokens.TokenRuler.Data;

type TokenPlannedMovementWaypoint = Token.PlannedMovementWaypoint;

type TokenPlannedMovement = Token.PlannedMovement;

type TokenRulerWaypoint = foundry.canvas.placeables.tokens.TokenRuler.Waypoint;

type TokenDragContext = Token.DragContext;

type TokenAnimationData = Token.AnimationData;

type TokenAnimationContext = Token.AnimationContext;

type TokenAnimationOptions = Token.AnimateOptions;

type TokenAnimationTransition = Token.AnimationTransition;

type TokenPanningOptions = TokenDocument.PanningOptions;

type TokenMovementActionCostFunction = CONFIG.Token.Movement.MovementActionCostFunction;

type TokenMovementActionConfigDescriptor = CONFIG.Token.Movement.ActionConfigDescriptor;

type TokenMovementActionConfig = CONFIG.Token.Movement.ActionConfig;

type CanvasViewPosition = Canvas.ViewPosition;

type CanvasAnimationPanOptions = Canvas.AnimatePanOptions;

type CanvasVisibilityTest = foundry.canvas.groups.CanvasVisibility.Test;

type CanvasVisibilityTestConfiguration = foundry.canvas.groups.CanvasVisibility.TestConfig;

type CanvasVisibilityTextureConfiguration = foundry.canvas.groups.CanvasVisibility.TextureConfiguration;

type ReticuleOptions = Token.ReticuleOptions;

type ActivityData = User.ActivityData;

type CanvasPerformanceSettings = Canvas.PerformanceSettings;

type CanvasSupportedComponents = Canvas.SupportedComponents;

type CanvasDimensions = Canvas.Dimensions;

type JournalEntryPageHeading = JournalEntryPage.Heading;

type SearchableField = foundry.data.fields.DataField.Any | Record<string, foundry.data.fields.DataField.Any>;

type FromCompendiumOptions = WorldCollection.FromCompendiumOptions;

type ToCompendiumOptions = ClientDocument.ToCompendiumOptions;

type ManageCompendiumRequest = CompendiumCollection.ManageCompendiumRequest;

type ManageCompendiumResponse = CompendiumCollection.ManageCompendiumResponse;

type WorldCompendiumPackConfiguration = foundry.documents.collections.CompendiumCollection.Configuration;

type WorldCompendiumConfiguration = foundry.documents.collections.CompendiumCollection.SettingData;

type SettingConfig = foundry.helpers.ClientSettings.SettingConfig;

type SettingSubmenuConfig = foundry.helpers.ClientSettings.SettingSubmenuConfig;

type KeybindingActionConfig = foundry.helpers.interaction.ClientKeybindings.StoredKeybindingActionConfig;

type KeybindingActionBinding = foundry.helpers.interaction.ClientKeybindings.StoredKeybindingActionBinding;

type KeybindingAction = foundry.helpers.interaction.ClientKeybindings.KeybindingAction;

type KeyboardEventContext = foundry.helpers.interaction.KeyboardManager.KeyboardEventContext;

type ConnectedGamepad = foundry.helpers.interaction.GamepadManager.ConnectedGamepad;

type ClipperPoint = PIXI.Polygon.ClipperPoint;

type CanvasTearDownOptions = Canvas.TearDownOptions;
