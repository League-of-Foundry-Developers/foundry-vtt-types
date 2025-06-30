/* eslint-disable @typescript-eslint/no-unused-vars */
// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

// eslint-disable-next-line import-x/export
export * from "#common/_types.mjs";

type HotReloadData = Hooks.HotReloadData;

type RulerWaypoint = unknown;

type TokenFindMovementPathWaypoint = unknown;

type TokenConstrainMovementPathWaypoint = unknown;

type TokenConstrainMovementPathOptions = unknown;

type TokenFindMovementPathOptions = unknown;

type TokenFindMovementPathJob = unknown;

type TokenGEtTerrainMovementPathWaypoint = unknown;

type TokenTerrainMovementWaypoint = unknown;

type TokenRulerData = foundry.canvas.placeables.tokens.TokenRuler.Data;

type TokenPlannedMovement = unknown;

type TokenRulerWaypointData = foundry.canvas.placeables.tokens.TokenRuler.WaypointData;

type TokenRulerWaypoint = foundry.canvas.placeables.tokens.TokenRuler.Waypoint;

type TokenDragContext = unknown;

type TokenAnimationData = unknown;

type TokenAnimationContext = unknown;

type TokenAnimationOptions = unknown;

type TokenAnimationTransition = unknown;

type TokenMovementActionCostFunction = unknown;

type TokenMovementActionConfig = unknown;

type CanvasViewPosition = unknown;

type CanvasVisibilityTest = foundry.canvas.groups.CanvasVisibility.Test;

type CanvasVisibilityTestConfiguration = foundry.canvas.groups.CanvasVisibility.TestConfig;

type CanvasVisibilityTextureConfiguration = foundry.canvas.groups.CanvasVisibility.TextureConfiguration;

type ReticuleOptions = unknown;

type ActivityData = unknown;

type CanvasPerformanceSettings = unknown;

type CanvasSupportedComponents = unknown;

type CanvasDimensions = unknown;

type JournalEntryPageHeading = unknown;

type SearchableField = foundry.data.fields.DataField.Any | Record<string, foundry.data.fields.DataField.Any>;

type FromCompendiumOptions = unknown;

type RollTableHTMLEmbedConfig = unknown;

type ManageCompendiumRequest = unknown;

type ManageCompendiumResponse = unknown;

type WorldCompendiumPackConfiguration = unknown;

type WorldCompendiumConfiguration = Record<string, WorldCompendiumPackConfiguration>;

type SettingConfig = foundry.helpers.ClientSettings.SettingConfig;

type SettingSubmenuConfig = foundry.helpers.ClientSettings.SettingSubmenuConfig;

type KeybindingActionConfig = foundry.helpers.interaction.ClientKeybindings.StoredKeybindingActionConfig;

type KeybindingActionBinding = foundry.helpers.interaction.ClientKeybindings.StoredKeybindingActionBinding;

type KeybindingAction = foundry.helpers.interaction.ClientKeybindings.KeybindingAction;

type KeyboardEventContext = foundry.helpers.interaction.KeyboardManager.KeyboardEventContext;

type ConnectedGamepad = foundry.helpers.interaction.GamepadManager.ConnectedGamepad;
