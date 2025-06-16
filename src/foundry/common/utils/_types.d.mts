/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

export {};

type LineIntersection = foundry.utils.LineIntersection;

type LineCircleIntersection = foundry.utils.LineCircleIntersection;

type ResolvedUUID = foundry.utils.ResolvedUUID;

// type IterableWeakMapHeldValue =

// type IterableWeakMapValue =

type StringTreeNode<Leaf extends object> = foundry.utils.StringTree.Node<Leaf>;

type StringTreeEntryFilter = foundry.utils.StringTree.EntryFilter;

type WordTreeEntry = foundry.utils.WordTree.WordTreeEntry;

type EmittedEventListener = foundry.utils.EventEmitterMixin.EventListener;
