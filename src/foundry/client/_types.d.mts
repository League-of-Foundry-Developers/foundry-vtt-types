/* eslint-disable @typescript-eslint/no-unused-vars */
// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

// eslint-disable-next-line import-x/export
export * from "#common/_types.mjs";

// type HotReloadData =

// type RulerWaypoint =

// type GridMeasurePathResultWaypoint =

// type TokenFindMovementPathWaypoint =

// type TokenConstrainMovementPathWaypoint =

// type TokenConstrainMovementPathOptions =

// type TokenFindMovementPathOptions =

// type TokenFindMovementPathJob =

// type TokenGEtTerrainMovementPathWaypoint =

// type TokenTerrainMovementWaypoint =

// type TokenRulerData =

// type TokenPlannedMovement =

// type TokenRulerWaypointData =

// type TokenRulerWaypoint =

// type TokenDragContext =

// type TokenAnimationData =

// type TokenAnimationContext =

// type TokenAnimationOptions =

// type TokenAnimationTransition =

// type TokenMovementActionCostFunction =

// type TokenMovementActionConfig =

// type CanvasViewPosition =

type CanvasVisibilityTest = foundry.canvas.groups.CanvasVisibility.Test;

type CanvasVisibilityTestConfiguration = foundry.canvas.groups.CanvasVisibility.TestConfig;

type CanvasVisibilityTextureConfiguration = foundry.canvas.groups.CanvasVisibility.TextureConfiguration;

// type ReticuleOptions =

// type ActivityData =

// type CanvasPerformanceSettings =

// type CanvasSupportedComponents =

// type CanvasDimensions =

// type JournalEntryPageHeading =

type SearchableField = foundry.data.fields.DataField.Any | Record<string, foundry.data.fields.DataField.Any>;

// type FromCompendiumOptions =

// type RollTableHTMLEmbedConfig =

// type ManageCompendiumRequest =

// type ManageCompendiumResponse =

type WorldCompendiumPackConfiguration = unknown;

type WorldCompendiumConfiguration = Record<string, WorldCompendiumPackConfiguration>;

type SettingConfig = foundry.helpers.ClientSettings.SettingConfig;

type SettingSubmenuConfig = foundry.helpers.ClientSettings.SettingSubmenuConfig;

type KeybindingActionConfig = foundry.helpers.interaction.ClientKeybindings.KeybindingActionConfig;

type KeybindingActionBinding = foundry.helpers.interaction.ClientKeybindings.KeybindingActionBinding;

type KeybindingAction = foundry.helpers.interaction.ClientKeybindings.KeybindingAction;

type KeyboardEventContext = foundry.helpers.interaction.KeyboardManager.KeyboardEventContext;

type ConnectedGamepad = foundry.helpers.interaction.GamepadManager.ConnectedGamepad;
