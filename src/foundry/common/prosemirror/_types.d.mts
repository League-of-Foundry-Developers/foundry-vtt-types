import type { ProseMirrorSliceTransformer as _ProseMirrorSliceTransformer } from "./util.d.mts";
import type {
  ProseMirrorMarkOutput as _ProseMirrorMarkOutput,
  ProseMirrorNodeOutput as _ProseMirrorNodeOutput,
} from "./string-serializer.d.mts";
import type ProseMirrorDropDown from "./dropdown.d.mts";
import type ProseMirrorMenu from "./menu.d.mts";
import type ProseMirrorKeyMaps from "./keymaps.d.mts";
import type ProseMirrorContentLinkPlugin from "./content-link-plugin.d.mts";
/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

export {};

type ProseMirrorContentLinkOptions = ProseMirrorContentLinkPlugin.ConstructionOptions;

type ProseMirrorMenuOptions = ProseMirrorMenu.ConstructionOptions;

type ProseMirrorMenuItem = ProseMirrorMenu.Item;

type ProseMirrorDropDownEntry = ProseMirrorDropDown.Entry;

type ProseMirrorDropDownConfig = ProseMirrorDropDown.Config;

type ProseMirrorCommand = ProseMirrorKeyMaps.Command;

type MenuToggleBlockWrapCommand = ProseMirrorMenu.ToggleBlockWrapCommand;

type ProseMirrorNodeOutput = _ProseMirrorNodeOutput;

type ProseMirrorMarkOutput = _ProseMirrorMarkOutput;

type ProseMirrorSliceTransformer = _ProseMirrorSliceTransformer;
