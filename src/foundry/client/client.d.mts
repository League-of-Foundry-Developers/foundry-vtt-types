// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

import "#common/primitives/_module.mjs";
import * as _CONST from "#common/constants.mjs";
import * as _abstract from "#common/abstract/_module.mjs";
import * as _documents from "#common/documents/_module.mjs";
import * as _packages from "#client/packages/_module.mjs";
// utils is exported here in the foundry file
import * as _config from "#common/config.mjs";
import * as _prosemirror from "#common/prosemirror/_module.mjs";
import * as _grid from "#common/grid/_module.mjs";
import _Game from "./game.mjs";

// TODO: Refactor to use _module.d.mts
// client
import * as _appv1 from "./appv1/_module.mjs";
import * as _applications from "./applications/_module.mjs";
import * as _av from "./av/_module.mjs";
import * as _audio from "./audio/_module.mjs";
import * as _canvas from "./canvas/_module.mjs";
import * as _helpers from "./helpers/_module.mjs";
import * as _data from "./data/_module.mjs";
import * as _dice from "./dice/_module.mjs";
import * as _nue from "./nue/_module.mjs";
import * as _utils from "./utils/_module.mjs"; // moved here to match other client exports

/**
 * Constant definitions used throughout the Foundry Virtual Tabletop framework.
 */
export * as CONST from "#common/constants.mjs";

/**
 * Abstract class definitions for fundamental concepts used throughout the Foundry Virtual Tabletop framework.
 */
export * as abstract from "#common/abstract/_module.mjs";

/**
 * Application configuration options
 */
export * as config from "#common/config.mjs";

/**
 * Document definitions used throughout the Foundry Virtual Tabletop framework.
 */
export * as documents from "#common/documents/_module.mjs";

/**
 * Package data definitions, validations, and schema.
 */
export * as packages from "#common/packages/_module.mjs";

/**
 * Utility functions providing helpful functionality.
 */
export * as utils from "#common/utils/_module.mjs";

/**
 * A library for providing rich text editing using ProseMirror within the Foundry Virtual Tabletop game client.
 */
export * as prosemirror from "#common/prosemirror/_module.mjs";

/**
 * Grid classes.
 */
export * as grid from "#common/grid/_module.mjs";

export * as appv1 from "./appv1/_module.mjs";

/**
 * A library for rendering and managing HTML user interface elements within the Foundry Virtual Tabletop game client.
 */
export * as applications from "./applications/_module.mjs";

/**
 * A library for controlling audio playback within the Foundry Virtual Tabletop game client.
 */
export * as audio from "./audio/_module.mjs";

/**
 * A submodule defining concepts related to canvas rendering.
 */
export * as canvas from "./canvas/_module.mjs";

/**
 * A submodule containing core helper classes.
 */
export * as helpers from "./helpers/_module.mjs";

/**
 * A module which defines data architecture components.
 */
export * as data from "./data/_module.mjs";

/**
 * A module for parsing and executing dice roll syntax.
 */
export * as dice from "./dice/_module.mjs";

export * as nue from "./nue/_module.mjs";

/**
 * Shared importable types.
 */
// export * as types from "./types.mjs";

declare global {
  namespace foundry {
    export import Game = _Game;

    /**
     * Constant definitions used throughout the Foundry Virtual Tabletop framework.
     */
    export import CONST = _CONST;

    /**
     * Abstract class definitions for fundamental concepts used throughout the Foundry Virtual Tabletop framework.
     */
    export import abstract = _abstract;

    /**
     * Application configuration options
     */
    export import config = _config;

    /**
     * Document definitions used throughout the Foundry Virtual Tabletop framework.
     */
    export import documents = _documents;

    /**
     * Package data definitions, validations, and schema.
     */
    export import packages = _packages;

    /**
     * Utility functions providing helpful functionality.
     */
    export import utils = _utils;

    /**
     * A library for providing rich text editing using ProseMirror within the Foundry Virtual Tabletop game client.
     */
    export import prosemirror = _prosemirror;

    /**
     * Grid classes.
     */
    export import grid = _grid;

    export import appv1 = _appv1;

    /**
     * A library for rendering and managing HTML user interface elements within the Foundry Virtual Tabletop game client.
     */
    export import applications = _applications;

    /**
     * Audio/video over WebRTC.
     */
    export import av = _av;

    /**
     * A library for controlling audio playback within the Foundry Virtual Tabletop game client.
     */
    export import audio = _audio;

    /**
     * A submodule defining concepts related to canvas rendering.
     */
    export import canvas = _canvas;

    /**
     * A submodule containing core helper classes.
     */
    export import helpers = _helpers;

    /**
     * A module which defines data architecture components.
     */
    export import data = _data;

    /**
     * A module for parsing and executing dice roll syntax.
     */
    export import dice = _dice;

    export import nue = _nue;
  }

  /**
   * Constant definitions used throughout the Foundry Virtual Tabletop framework.
   */
  export import CONST = _CONST;

  // Blessed globals - will remain global without deprecation

  // Color is currently handled in src/foundry/client/head.d.mts

  export import Collection = _utils.Collection;

  export import Roll = _dice.Roll;

  export import fromUuid = foundry.utils.fromUuid;
  export import fromUuidSync = foundry.utils.fromUuidSync;
  export import getDocumentClass = foundry.utils.getDocumentClass;
  // Hooks are a blessed global
  // export import Hooks = foundry.helpers.Hooks;

  // Programmatic foundry deprecations
  // While Foundry has the benefit of applying deprecations purely programmatically,
  // We must list them one by one. This is that section, organized as best can be.

  /**
   * @deprecated "You are accessing the global {@linkcode Application} which is now namespaced under {@linkcode foundry.appv1.api.Application}"
   * (since v13 will be removed in v16)
   */
  export import Application = foundry.appv1.api.Application;

  /**
   * @deprecated "You are accessing the global {@linkcode Dialog} which is now namespaced under {@linkcode foundry.appv1.api.Dialog}"
   * (since v13 will be removed in v16)
   */
  export import Dialog = foundry.appv1.api.Dialog;

  /**
   * @deprecated "You are accessing the global {@linkcode FormApplication} which is now namespaced under {@linkcode foundry.appv1.api.FormApplication}"
   * (since v13 will be removed in v16)
   */
  export import FormApplication = foundry.appv1.api.FormApplication;

  /**
   * @deprecated "You are accessing the global {@linkcode DocumentSheet} which is now namespaced under {@linkcode foundry.appv1.api.DocumentSheet}"
   * (since v13 will be removed in v16)
   */
  export import DocumentSheet = foundry.appv1.api.DocumentSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode Game} which is now namespaced under {@linkcode foundry.Game}"
   * (since v13 will be removed in v15)
   */
  export import Game = foundry.Game;

  /**
   * @deprecated "You are accessing the global {@linkcode _appId} which is now namespaced under {@linkcode foundry.applications.api.ApplicationV2._appId}"
   * (since v13 will be removed in v15)
   */
  export import _appId = foundry.applications.api.ApplicationV2._appId;

  /**
   * @deprecated "You are accessing the global {@linkcode _maxZ} which is now namespaced under {@linkcode foundry.applications.api.ApplicationV2._maxZ}"
   * (since v13 will be removed in v15)
   */
  export import _maxZ = foundry.applications.api.ApplicationV2._maxZ;

  /**
   * @deprecated "You are accessing the global {@linkcode HandlebarsHelpers} which is now namespaced under {@linkcode foundry.applications.handlebars}"
   * (since v13 will be removed in v15)
   */
  export import HandlebarsHelpers = foundry.applications.handlebars;

  /**
   * @deprecated "You are accessing the global {@linkcode getTemplate} which is now namespaced under {@linkcode foundry.applications.handlebars.getTemplate}"
   * (since v13 will be removed in v15)
   */
  export import getTemplate = foundry.applications.handlebars.getTemplate;

  /**
   * @deprecated "You are accessing the global {@linkcode loadTemplates} which is now namespaced under {@linkcode foundry.applications.handlebars.loadTemplates}"
   * (since v13 will be removed in v15)
   */
  export import loadTemplates = foundry.applications.handlebars.loadTemplates;

  /**
   * @deprecated "You are accessing the global {@linkcode renderTemplate} which is now namespaced under {@linkcode foundry.applications.handlebars.renderTemplate}"
   * (since v13 will be removed in v15)
   */
  export import renderTemplate = foundry.applications.handlebars.renderTemplate;

  /**
   * @deprecated "You are accessing the global {@linkcode CombatTrackerConfig} which is now namespaced under {@linkcode foundry.applications.apps.CombatTrackerConfig}"
   * (since v13 will be removed in v15)
   */
  export import CombatTrackerConfig = foundry.applications.apps.CombatTrackerConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode DocumentSheetConfig} which is now namespaced under {@linkcode foundry.applications.apps.DocumentSheetConfig}"
   * (since v13 will be removed in v15)
   */
  export import DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode FilePicker} which is now namespaced under {@linkcode foundry.applications.apps.FilePicker.implementation}"
   * (since v13 will be removed in v15)
   */
  // export import FilePicker = foundry.applications.apps.FilePicker.implementation;

  /**
   * @deprecated "You are accessing the global {@linkcode GridConfig} which is now namespaced under {@linkcode foundry.applications.apps.GridConfig}"
   * (since v13 will be removed in v15)
   */
  export import GridConfig = foundry.applications.apps.GridConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode ImagePopout} which is now namespaced under {@linkcode foundry.applications.apps.ImagePopout}"
   * (since v13 will be removed in v15)
   */
  export import ImagePopout = foundry.applications.apps.ImagePopout;

  /**
   * @deprecated "You are accessing the global {@linkcode DocumentOwnershipConfig} which is now namespaced under {@linkcode foundry.applications.apps.DocumentOwnershipConfig}"
   * (since v13 will be removed in v15)
   */
  export import DocumentOwnershipConfig = foundry.applications.apps.DocumentOwnershipConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode Hotbar} which is now namespaced under {@linkcode foundry.applications.ui.Hotbar}"
   * (since v13 will be removed in v15)
   */
  export import Hotbar = foundry.applications.ui.Hotbar;

  /**
   * @deprecated "You are accessing the global {@linkcode Pause} which is now namespaced under {@linkcode foundry.applications.ui.GamePause}"
   * (since v13 will be removed in v15)
   */
  export import Pause = foundry.applications.ui.GamePause;

  /**
   * @deprecated "You are accessing the global {@linkcode SceneControls} which is now namespaced under {@linkcode foundry.applications.ui.SceneControls}"
   * (since v13 will be removed in v15)
   */
  export import SceneControls = foundry.applications.ui.SceneControls;

  /**
   * @deprecated "You are accessing the global {@linkcode SceneNavigation} which is now namespaced under {@linkcode foundry.applications.ui.SceneNavigation}"
   * (since v13 will be removed in v15)
   */
  export import SceneNavigation = foundry.applications.ui.SceneNavigation;

  /**
   * @deprecated "You are accessing the global {@linkcode Players} which is now namespaced under {@linkcode foundry.applications.ui.Players}"
   * (since v13 will be removed in v15)
   */
  export import Players = foundry.applications.ui.Players;

  /**
   * @deprecated "You are accessing the global {@linkcode MainMenu} which is now namespaced under {@linkcode foundry.applications.ui.MainMenu}"
   * (since v13 will be removed in v15)
   */
  export import MainMenu = foundry.applications.ui.MainMenu;

  /**
   * @deprecated "You are accessing the global {@linkcode Notifications} which is now namespaced under {@linkcode foundry.applications.ui.Notifications}"
   * (since v13 will be removed in v15)
   */
  export import Notifications = foundry.applications.ui.Notifications;

  /**
   * @deprecated "You are accessing the global {@linkcode ActiveEffectConfig} which is now namespaced under {@linkcode foundry.applications.sheets.ActiveEffectConfig}"
   * (since v13 will be removed in v15)
   */
  export import ActiveEffectConfig = foundry.applications.sheets.ActiveEffectConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode AdventureExporter} which is now namespaced under {@linkcode foundry.applications.sheets.AdventureExporter}"
   * (since v13 will be removed in v15)
   */
  export import AdventureExporter = foundry.applications.sheets.AdventureExporter;

  /**
   * @deprecated "You are accessing the global {@linkcode BaseSheet} which is now namespaced under {@linkcode foundry.applications.sheets.BaseSheet}"
   * (since v13 will be removed in v15)
   */
  export import BaseSheet = foundry.applications.sheets.BaseSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode CardConfig} which is now namespaced under {@linkcode foundry.applications.sheets.CardConfig}"
   * (since v13 will be removed in v15)
   */
  export import CardConfig = foundry.applications.sheets.CardConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode CardHand} which is now namespaced under {@linkcode foundry.applications.sheets.CardHandConfig}"
   * (since v13 will be removed in v15)
   */
  export import CardHand = foundry.applications.sheets.CardHandConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode CardPile} which is now namespaced under {@linkcode foundry.applications.sheets.CardPileConfig}"
   * (since v13 will be removed in v15)
   */
  export import CardPile = foundry.applications.sheets.CardPileConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode CardsConfig} which is now namespaced under {@linkcode foundry.applications.sheets.CardDeckConfig}"
   * (since v13 will be removed in v15)
   */
  export import CardsConfig = foundry.applications.sheets.CardDeckConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode CombatantConfig} which is now namespaced under {@linkcode foundry.applications.sheets.CombatantConfig}"
   * (since v13 will be removed in v15)
   */
  export import CombatantConfig = foundry.applications.sheets.CombatantConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode DrawingConfig} which is now namespaced under {@linkcode foundry.applications.sheets.DrawingConfig}"
   * (since v13 will be removed in v15)
   */
  export import DrawingConfig = foundry.applications.sheets.DrawingConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode FolderConfig} which is now namespaced under {@linkcode foundry.applications.sheets.FolderConfig}"
   * (since v13 will be removed in v15)
   */
  export import FolderConfig = foundry.applications.sheets.FolderConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode MeasuredTemplateConfig} which is now namespaced under {@linkcode foundry.applications.sheets.MeasuredTemplateConfig}"
   * (since v13 will be removed in v15)
   */
  export import MeasuredTemplateConfig = foundry.applications.sheets.MeasuredTemplateConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode MacroConfig} which is now namespaced under {@linkcode foundry.applications.sheets.MacroConfig}"
   * (since v13 will be removed in v15)
   */
  export import MacroConfig = foundry.applications.sheets.MacroConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode NoteConfig} which is now namespaced under {@linkcode foundry.applications.sheets.NoteConfig}"
   * (since v13 will be removed in v15)
   */
  export import NoteConfig = foundry.applications.sheets.NoteConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode PlaylistConfig} which is now namespaced under {@linkcode foundry.applications.sheets.PlaylistConfig}"
   * (since v13 will be removed in v15)
   */
  export import PlaylistConfig = foundry.applications.sheets.PlaylistConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode PlaylistSoundConfig} which is now namespaced under {@linkcode foundry.applications.sheets.PlaylistSoundConfig}"
   * (since v13 will be removed in v15)
   */
  export import PlaylistSoundConfig = foundry.applications.sheets.PlaylistSoundConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode RollTableConfig} which is now namespaced under {@linkcode foundry.applications.sheets.RollTableSheet}"
   * (since v13 will be removed in v15)
   */
  export import RollTableConfig = foundry.applications.sheets.RollTableSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode SceneConfig} which is now namespaced under {@linkcode foundry.applications.sheets.SceneConfig}"
   * (since v13 will be removed in v15)
   */
  export import SceneConfig = foundry.applications.sheets.SceneConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode TileConfig} which is now namespaced under {@linkcode foundry.applications.sheets.TileConfig}"
   * (since v13 will be removed in v15)
   */
  export import TileConfig = foundry.applications.sheets.TileConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode TokenConfig} which is now namespaced under {@linkcode foundry.applications.sheets.TokenConfig}"
   * (since v13 will be removed in v15)
   */
  export import TokenConfig = foundry.applications.sheets.TokenConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode WallConfig} which is now namespaced under {@linkcode foundry.applications.sheets.WallConfig}"
   * (since v13 will be removed in v15)
   */
  export import WallConfig = foundry.applications.sheets.WallConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode JournalImagePageSheet} which is now namespaced under {@linkcode foundry.applications.sheets.journal.JournalEntryPageImageSheet}"
   * (since v13 will be removed in v15)
   */
  export import JournalImagePageSheet = foundry.applications.sheets.journal.JournalEntryPageImageSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode JournalPDFPageSheet} which is now namespaced under {@linkcode foundry.applications.sheets.journal.JournalEntryPagePDFSheet}"
   * (since v13 will be removed in v15)
   */
  export import JournalPDFPageSheet = foundry.applications.sheets.journal.JournalEntryPagePDFSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode JournalVideoPageSheet} which is now namespaced under {@linkcode foundry.applications.sheets.journal.JournalEntryPageVideoSheet}"
   * (since v13 will be removed in v15)
   */
  export import JournalVideoPageSheet = foundry.applications.sheets.journal.JournalEntryPageVideoSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode MarkdownJournalPageSheet} which is now namespaced under {@linkcode foundry.applications.sheets.journal.JournalEntryPageMarkdownSheet}"
   * (since v13 will be removed in v15)
   */
  export import MarkdownJournalPageSheet = foundry.applications.sheets.journal.JournalEntryPageMarkdownSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode Sidebar} which is now namespaced under {@linkcode foundry.applications.sidebar.Sidebar}"
   * (since v13 will be removed in v15)
   */
  export import Sidebar = foundry.applications.sidebar.Sidebar;

  /**
   * @deprecated "You are accessing the global {@linkcode ActorDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.ActorDirectory}"
   * (since v13 will be removed in v15)
   */
  export import ActorDirectory = foundry.applications.sidebar.tabs.ActorDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode CardsDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.CardsDirectory}"
   * (since v13 will be removed in v15)
   */
  export import CardsDirectory = foundry.applications.sidebar.tabs.CardsDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode ChatLog} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.ChatLog}"
   * (since v13 will be removed in v15)
   */
  export import ChatLog = foundry.applications.sidebar.tabs.ChatLog;

  /**
   * @deprecated "You are accessing the global {@linkcode CombatTracker} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.CombatTracker}"
   * (since v13 will be removed in v15)
   */
  export import CombatTracker = foundry.applications.sidebar.tabs.CombatTracker;

  /**
   * @deprecated "You are accessing the global {@linkcode CompendiumDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.CompendiumDirectory}"
   * (since v13 will be removed in v15)
   */
  export import CompendiumDirectory = foundry.applications.sidebar.tabs.CompendiumDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode ItemDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.ItemDirectory}"
   * (since v13 will be removed in v15)
   */
  export import ItemDirectory = foundry.applications.sidebar.tabs.ItemDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode JournalDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.JournalDirectory}"
   * (since v13 will be removed in v15)
   */
  export import JournalDirectory = foundry.applications.sidebar.tabs.JournalDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode MacroDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.MacroDirectory}"
   * (since v13 will be removed in v15)
   */
  export import MacroDirectory = foundry.applications.sidebar.tabs.MacroDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode PlaylistDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.PlaylistDirectory}"
   * (since v13 will be removed in v15)
   */
  export import PlaylistDirectory = foundry.applications.sidebar.tabs.PlaylistDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode RollTableDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.RollTableDirectory}"
   * (since v13 will be removed in v15)
   */
  export import RollTableDirectory = foundry.applications.sidebar.tabs.RollTableDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode SceneDirectory} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.SceneDirectory}"
   * (since v13 will be removed in v15)
   */
  export import SceneDirectory = foundry.applications.sidebar.tabs.SceneDirectory;

  /**
   * @deprecated "You are accessing the global {@linkcode Compendium} which is now namespaced under {@linkcode foundry.applications.sidebar.apps.Compendium}"
   * (since v13 will be removed in v15)
   */
  export import Compendium = foundry.applications.sidebar.apps.Compendium;

  /**
   * @deprecated "You are accessing the global {@linkcode InvitationLinks} which is now namespaced under {@linkcode foundry.applications.sidebar.apps.InvitationLinks}"
   * (since v13 will be removed in v15)
   */
  export import InvitationLinks = foundry.applications.sidebar.apps.InvitationLinks;

  /**
   * @deprecated "You are accessing the global {@linkcode KeybindingsConfig} which is now namespaced under {@linkcode foundry.applications.sidebar.apps.ControlsConfig}"
   * (since v13 will be removed in v15)
   */
  export import KeybindingsConfig = foundry.applications.sidebar.apps.ControlsConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode Settings} which is now namespaced under {@linkcode foundry.applications.sidebar.tabs.Settings}"
   * (since v13 will be removed in v15)
   */
  export import Settings = foundry.applications.sidebar.tabs.Settings;

  /**
   * @deprecated "You are accessing the global {@linkcode SupportDetails} which is now namespaced under {@linkcode foundry.applications.sidebar.apps.SupportDetails}"
   * (since v13 will be removed in v15)
   */
  export import SupportDetails = foundry.applications.sidebar.apps.SupportDetails;

  /**
   * @deprecated "You are accessing the global {@linkcode ModuleManagement} which is now namespaced under {@linkcode foundry.applications.sidebar.apps.ModuleManagement}"
   * (since v13 will be removed in v15)
   */
  export import ModuleManagement = foundry.applications.sidebar.apps.ModuleManagement;

  /**
   * @deprecated "You are accessing the global {@linkcode ToursManagement} which is now namespaced under {@linkcode foundry.applications.sidebar.apps.ToursManagement}"
   * (since v13 will be removed in v15)
   */
  export import ToursManagement = foundry.applications.sidebar.apps.ToursManagement;

  /**
   * @deprecated "You are accessing the global {@linkcode BasePlaceableHUD} which is now namespaced under {@linkcode foundry.applications.hud.BasePlaceableHUD}"
   * (since v13 will be removed in v15)
   */
  export import BasePlaceableHUD = foundry.applications.hud.BasePlaceableHUD;

  /**
   * @deprecated "You are accessing the global {@linkcode DrawingHUD} which is now namespaced under {@linkcode foundry.applications.hud.DrawingHUD}"
   * (since v13 will be removed in v15)
   */
  export import DrawingHUD = foundry.applications.hud.DrawingHUD;

  /**
   * @deprecated "You are accessing the global {@linkcode TileHUD} which is now namespaced under {@linkcode foundry.applications.hud.TileHUD}"
   * (since v13 will be removed in v15)
   */
  export import TileHUD = foundry.applications.hud.TileHUD;

  /**
   * @deprecated "You are accessing the global {@linkcode TokenHUD} which is now namespaced under {@linkcode foundry.applications.hud.TokenHUD}"
   * (since v13 will be removed in v15)
   */
  export import TokenHUD = foundry.applications.hud.TokenHUD;

  /**
   * @deprecated "You are accessing the global {@linkcode CameraViews} which is now namespaced under {@linkcode foundry.applications.apps.av.CameraViews}"
   * (since v13 will be removed in v15)
   */
  export import CameraViews = foundry.applications.apps.av.CameraViews;

  /**
   * @deprecated "You are accessing the global {@linkcode CameraPopoutAppWrapper} which is now namespaced under {@linkcode foundry.applications.apps.av.CameraPopout}"
   * (since v13 will be removed in v15)
   */
  export import CameraPopoutAppWrapper = foundry.applications.apps.av.CameraPopout;

  /**
   * @deprecated "You are accessing the global {@linkcode AVClient} which is now namespaced under {@linkcode foundry.av.AVClient}"
   * (since v13 will be removed in v15)
   */
  export import AVClient = foundry.av.AVClient;

  /**
   * @deprecated "You are accessing the global {@linkcode AVMaster} which is now namespaced under {@linkcode foundry.av.AVMaster}"
   * (since v13 will be removed in v15)
   */
  export import AVMaster = foundry.av.AVMaster;

  /**
   * @deprecated "You are accessing the global {@linkcode AVSettings} which is now namespaced under {@linkcode foundry.av.AVSettings}"
   * (since v13 will be removed in v15)
   */
  export import AVSettings = foundry.av.AVSettings;

  /**
   * @deprecated "You are accessing the global {@linkcode SimplePeerAVClient} which is now namespaced under {@linkcode foundry.av.clients.SimplePeerAVClient}"
   * (since v13 will be removed in v15)
   */
  export import SimplePeerAVClient = foundry.av.clients.SimplePeerAVClient;

  /**
   * @deprecated "You are accessing the global {@linkcode AVConfig} which is now namespaced under {@linkcode foundry.applications.settings.menus.AVConfig}"
   * (since v13 will be removed in v15)
   */
  export import AVConfig = foundry.applications.settings.menus.AVConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode DefaultSheetsConfig} which is now namespaced under {@linkcode foundry.applications.settings.menus.DefaultSheetsConfig}"
   * (since v13 will be removed in v15)
   */
  export import DefaultSheetsConfig = foundry.applications.settings.menus.DefaultSheetsConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode DiceConfig} which is now namespaced under {@linkcode foundry.applications.settings.menus.DiceConfig}"
   * (since v13 will be removed in v15)
   */
  export import DiceConfig = foundry.applications.settings.menus.DiceConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode FontConfig} which is now namespaced under {@linkcode foundry.applications.settings.menus.FontConfig}"
   * (since v13 will be removed in v15)
   */
  export import FontConfig = foundry.applications.settings.menus.FontConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode SettingsConfig} which is now namespaced under {@linkcode foundry.applications.settings.SettingsConfig}"
   * (since v13 will be removed in v15)
   */
  export import SettingsConfig = foundry.applications.settings.SettingsConfig;

  /**
   * @deprecated "You are accessing the global {@linkcode DependencyResolution} which is now namespaced under {@linkcode foundry.applications.settings.DependencyResolution}"
   * (since v13 will be removed in v15)
   */
  export import DependencyResolution = foundry.applications.settings.DependencyResolution;

  /**
   * @deprecated "You are accessing the global {@linkcode ContextMenu} which is now namespaced under {@linkcode foundry.applications.ux.ContextMenu.implementation}"
   * (since v13 will be removed in v15)
   * @privateRemarks TODO: This should return the configured class
   */
  export import ContextMenu = foundry.applications.ux.ContextMenu;

  /**
   * @deprecated "You are accessing the global {@linkcode DragDrop} which is now namespaced under {@linkcode foundry.applications.ux.DragDrop.implementation}"
   * (since v13 will be removed in v15)
   * @privateRemarks TODO: This should return the configured class
   */
  // export import DragDrop = foundry.applications.ux.DragDrop;

  /**
   * @deprecated "You are accessing the global {@linkcode Draggable} which is now namespaced under {@linkcode foundry.applications.ux.Draggable.implementation}"
   * (since v13 will be removed in v15)
   * @privateRemarks TODO: This should return the configured class
   */
  // export import Draggable = foundry.applications.ux.Draggable;

  /**
   * @deprecated "You are accessing the global {@linkcode FormDataExtended} which is now namespaced under {@linkcode foundry.applications.ux.FormDataExtended}"
   * (since v13 will be removed in v15)
   */
  // export import FormDataExtended = foundry.applications.ux.FormDataExtended;

  /**
   * @deprecated "You are accessing the global {@linkcode HTMLSecret} which is now namespaced under {@linkcode foundry.applications.ux.HTMLSecret}"
   * (since v13 will be removed in v15)
   */
  // export import HTMLSecret = foundry.applications.ux.HTMLSecret;

  /**
   * @deprecated "You are accessing the global {@linkcode ProseMirrorEditor} which is now namespaced under {@linkcode foundry.applications.ux.ProseMirrorEditor}"
   * (since v13 will be removed in v15)
   */
  // export import ProseMirrorEditor = foundry.applications.ux.ProseMirrorEditor;

  /**
   * @deprecated "You are accessing the global {@linkcode SearchFilter} which is now namespaced under {@linkcode foundry.applications.ux.SearchFilter}"
   * (since v13 will be removed in v15)
   */
  // export import SearchFilter = foundry.applications.ux.SearchFilter;

  /**
   * @deprecated "You are accessing the global {@linkcode Tabs} which is now namespaced under {@linkcode foundry.applications.ux.Tabs}"
   * (since v13 will be removed in v15)
   */
  // export import Tabs = foundry.applications.ux.Tabs;

  /**
   * @deprecated "You are accessing the global {@linkcode TextEditor} which is now namespaced under {@linkcode foundry.applications.ux.TextEditor.implementation}"
   * (since v13 will be removed in v15)
   * @privateRemarks TODO: This should return the configured class
   */
  // export import TextEditor = foundry.applications.ux.TextEditor;

  /**
   * @deprecated "You are accessing the global {@linkcode ActorSheet} which is now namespaced under {@linkcode foundry.appv1.sheets.ActorSheet}"
   * (since v13 will be removed in v15)
   */
  export import ActorSheet = foundry.appv1.sheets.ActorSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode AdventureImporter} which is now namespaced under {@linkcode foundry.appv1.sheets.AdventureImporter}"
   * (since v13 will be removed in v15)
   */
  export import AdventureImporter = foundry.appv1.sheets.AdventureImporter;

  /**
   * @deprecated "You are accessing the global {@linkcode ItemSheet} which is now namespaced under {@linkcode foundry.appv1.sheets.ItemSheet}"
   * (since v13 will be removed in v15)
   */
  export import ItemSheet = foundry.appv1.sheets.ItemSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode JournalSheet} which is now namespaced under {@linkcode foundry.appv1.sheets.JournalSheet}"
   * (since v13 will be removed in v15)
   */
  export import JournalSheet = foundry.appv1.sheets.JournalSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode JournalPageSheet} which is now namespaced under {@linkcode foundry.appv1.sheets.JournalPageSheet}"
   * (since v13 will be removed in v15)
   */
  export import JournalPageSheet = foundry.appv1.sheets.JournalPageSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode JournalTextPageSheet} which is now namespaced under {@linkcode foundry.appv1.sheets.JournalTextPageSheet}"
   * (since v13 will be removed in v15)
   */
  export import JournalTextPageSheet = foundry.appv1.sheets.JournalTextPageSheet;

  /**
   * @deprecated "You are accessing the global {@linkcode JournalTextTinyMCESheet} which is now namespaced under {@linkcode foundry.appv1.sheets.JournalTextTinyMCESheet}"
   * (since v13 will be removed in v15)
   */
  export import JournalTextTinyMCESheet = foundry.appv1.sheets.JournalTextTinyMCESheet;

  /**
   * @deprecated "You are accessing the global {@linkcode Canvas} which is now namespaced under {@linkcode foundry.canvas.Canvas}"
   * (since v13 will be removed in v15)
   */
  export import Canvas = foundry.canvas.Canvas;

  /**
   * @deprecated "You are accessing the global {@linkcode FramebufferSnapshot} which is now namespaced under {@linkcode foundry.canvas.FramebufferSnapshot}"
   * (since v13 will be removed in v15)
   */
  export import FramebufferSnapshot = foundry.canvas.FramebufferSnapshot;

  /**
   * @deprecated "You are accessing the global {@linkcode TextureExtractor} which is now namespaced under {@linkcode foundry.canvas.TextureExtractor}"
   * (since v13 will be removed in v15)
   */
  export import TextureExtractor = foundry.canvas.TextureExtractor;

  /**
   * @deprecated "You are accessing the global {@linkcode TextureLoader} which is now namespaced under {@linkcode foundry.canvas.TextureLoader}"
   * (since v13 will be removed in v15)
   */
  export import TextureLoader = foundry.canvas.TextureLoader;

  /**
   * @deprecated "You are accessing the global {@linkcode getTexture} which is now namespaced under {@linkcode foundry.canvas.getTexture}"
   * (since v13 will be removed in v15)
   */
  export import getTexture = foundry.canvas.getTexture;

  /**
   * @deprecated "You are accessing the global {@linkcode loadTexture} which is now namespaced under {@linkcode foundry.canvas.loadTexture}"
   * (since v13 will be removed in v15)
   */
  export import loadTexture = foundry.canvas.loadTexture;

  /**
   * @deprecated "You are accessing the global {@linkcode srcExists} which is now namespaced under {@linkcode foundry.canvas.srcExists}"
   * (since v13 will be removed in v15)
   */
  export import srcExists = foundry.canvas.srcExists;

  /**
   * @deprecated "You are accessing the global {@linkcode SMAAFilter} which is now namespaced under {@linkcode foundry.canvas.rendering.filters.SMAAFilter}"
   * (since v13 will be removed in v15)
   */
  export import SMAAFilter = foundry.canvas.rendering.filters.SMAAFilter;

  /**
   * @deprecated "You are accessing the global {@linkcode BatchRenderer} which is now namespaced under {@linkcode foundry.canvas.rendering.batching.BatchRenderer}"
   * (since v13 will be removed in v15)
   */
  export import BatchRenderer = foundry.canvas.rendering.batching.BatchRenderer;

  /**
   * @deprecated "You are accessing the global {@linkcode BatchShaderGenerator} which is now namespaced under {@linkcode foundry.canvas.rendering.batching.BatchShaderGenerator}"
   * (since v13 will be removed in v15)
   */
  export import BatchShaderGenerator = foundry.canvas.rendering.batching.BatchShaderGenerator;

  /**
   * @deprecated "You are accessing the global {@linkcode BaseShaderMixin} which is now namespaced under {@linkcode foundry.canvas.rendering.mixins.BaseShaderMixin}"
   * (since v13 will be removed in v15)
   */
  export import BaseShaderMixin = foundry.canvas.rendering.mixins.BaseShaderMixin;

  /**
   * @deprecated "You are accessing the global {@linkcode AdaptiveFragmentChannelMixin} which is now namespaced under {@linkcode foundry.canvas.rendering.mixins.AdaptiveFragmentChannelMixin}"
   * (since v13 will be removed in v15)
   */
  export import AdaptiveFragmentChannelMixin = foundry.canvas.rendering.mixins.AdaptiveFragmentChannelMixin;

  /**
   * @deprecated "You are accessing the global {@linkcode AbstractBaseShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AbstractBaseShader}"
   * (since v13 will be removed in v15)
   */
  export import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

  /**
   * @deprecated "You are accessing the global {@linkcode GridShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.GridShader}"
   * (since v13 will be removed in v15)
   */
  export import GridShader = foundry.canvas.rendering.shaders.GridShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AdaptiveLightingShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AdaptiveLightingShader}"
   * (since v13 will be removed in v15)
   */
  export import AdaptiveLightingShader = foundry.canvas.rendering.shaders.AdaptiveLightingShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AdaptiveBackgroundShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AdaptiveBackgroundShader}"
   * (since v13 will be removed in v15)
   */
  export import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AdaptiveColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AdaptiveColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import AdaptiveColorationShader = foundry.canvas.rendering.shaders.AdaptiveColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AdaptiveDarknessShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AdaptiveDarknessShader}"
   * (since v13 will be removed in v15)
   */
  export import AdaptiveDarknessShader = foundry.canvas.rendering.shaders.AdaptiveDarknessShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AdaptiveIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AdaptiveIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import AdaptiveIlluminationShader = foundry.canvas.rendering.shaders.AdaptiveIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode BewitchingWaveColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.BewitchingWaveColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import BewitchingWaveColorationShader = foundry.canvas.rendering.shaders.BewitchingWaveColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode BewitchingWaveIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.BewitchingWaveIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import BewitchingWaveIlluminationShader = foundry.canvas.rendering.shaders.BewitchingWaveIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode BlackHoleDarknessShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.BlackHoleDarknessShader}"
   * (since v13 will be removed in v15)
   */
  export import BlackHoleDarknessShader = foundry.canvas.rendering.shaders.BlackHoleDarknessShader;

  /**
   * @deprecated "You are accessing the global {@linkcode ChromaColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.ChromaColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import ChromaColorationShader = foundry.canvas.rendering.shaders.ChromaColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode EmanationColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.EmanationColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import EmanationColorationShader = foundry.canvas.rendering.shaders.EmanationColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode EnergyFieldColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.EnergyFieldColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import EnergyFieldColorationShader = foundry.canvas.rendering.shaders.EnergyFieldColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode FairyLightColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.FairyLightColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import FairyLightColorationShader = foundry.canvas.rendering.shaders.FairyLightColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode FairyLightIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.FairyLightIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import FairyLightIlluminationShader = foundry.canvas.rendering.shaders.FairyLightIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode FlameColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.FlameColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import FlameColorationShader = foundry.canvas.rendering.shaders.FlameColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode FlameIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.FlameIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import FlameIlluminationShader = foundry.canvas.rendering.shaders.FlameIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode FogColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.FogColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import FogColorationShader = foundry.canvas.rendering.shaders.FogColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode ForceGridColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.ForceGridColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import ForceGridColorationShader = foundry.canvas.rendering.shaders.ForceGridColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode GhostLightColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.GhostLightColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import GhostLightColorationShader = foundry.canvas.rendering.shaders.GhostLightColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode GhostLightIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.GhostLightIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import GhostLightIlluminationShader = foundry.canvas.rendering.shaders.GhostLightIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode HexaDomeColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.HexaDomeColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import HexaDomeColorationShader = foundry.canvas.rendering.shaders.HexaDomeColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode LightDomeColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.LightDomeColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import LightDomeColorationShader = foundry.canvas.rendering.shaders.LightDomeColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode MagicalGloomDarknessShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.MagicalGloomDarknessShader}"
   * (since v13 will be removed in v15)
   */
  export import MagicalGloomDarknessShader = foundry.canvas.rendering.shaders.MagicalGloomDarknessShader;

  /**
   * @deprecated "You are accessing the global {@linkcode PulseColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.PulseColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import PulseColorationShader = foundry.canvas.rendering.shaders.PulseColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode PulseIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.PulseIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import PulseIlluminationShader = foundry.canvas.rendering.shaders.PulseIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode RadialRainbowColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.RadialRainbowColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import RadialRainbowColorationShader = foundry.canvas.rendering.shaders.RadialRainbowColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode RevolvingColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.RevolvingColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import RevolvingColorationShader = foundry.canvas.rendering.shaders.RevolvingColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode RoilingDarknessShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.RoilingDarknessShader}"
   * (since v13 will be removed in v15)
   */
  export import RoilingDarknessShader = foundry.canvas.rendering.shaders.RoilingDarknessShader;

  /**
   * @deprecated "You are accessing the global {@linkcode SirenColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.SirenColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import SirenColorationShader = foundry.canvas.rendering.shaders.SirenColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode SirenIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.SirenIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import SirenIlluminationShader = foundry.canvas.rendering.shaders.SirenIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode SmokePatchColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.SmokePatchColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import SmokePatchColorationShader = foundry.canvas.rendering.shaders.SmokePatchColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode SmokePatchIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.SmokePatchIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import SmokePatchIlluminationShader = foundry.canvas.rendering.shaders.SmokePatchIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode StarLightColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.StarLightColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import StarLightColorationShader = foundry.canvas.rendering.shaders.StarLightColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode SunburstColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.SunburstColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import SunburstColorationShader = foundry.canvas.rendering.shaders.SunburstColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode SunburstIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.SunburstIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import SunburstIlluminationShader = foundry.canvas.rendering.shaders.SunburstIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode SwirlingRainbowColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.SwirlingRainbowColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import SwirlingRainbowColorationShader = foundry.canvas.rendering.shaders.SwirlingRainbowColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode TorchColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.TorchColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import TorchColorationShader = foundry.canvas.rendering.shaders.TorchColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode TorchIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.TorchIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import TorchIlluminationShader = foundry.canvas.rendering.shaders.TorchIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode VortexColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.VortexColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import VortexColorationShader = foundry.canvas.rendering.shaders.VortexColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode VortexIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.VortexIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import VortexIlluminationShader = foundry.canvas.rendering.shaders.VortexIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode WaveColorationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.WaveColorationShader}"
   * (since v13 will be removed in v15)
   */
  export import WaveColorationShader = foundry.canvas.rendering.shaders.WaveColorationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode WaveIlluminationShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.WaveIlluminationShader}"
   * (since v13 will be removed in v15)
   */
  export import WaveIlluminationShader = foundry.canvas.rendering.shaders.WaveIlluminationShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AdaptiveVisionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AdaptiveVisionShader}"
   * (since v13 will be removed in v15)
   */
  export import AdaptiveVisionShader = foundry.canvas.rendering.shaders.AdaptiveVisionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode BackgroundVisionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.BackgroundVisionShader}"
   * (since v13 will be removed in v15)
   */
  export import BackgroundVisionShader = foundry.canvas.rendering.shaders.BackgroundVisionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode ColorationVisionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.ColorationVisionShader}"
   * (since v13 will be removed in v15)
   */
  export import ColorationVisionShader = foundry.canvas.rendering.shaders.ColorationVisionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode IlluminationVisionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.IlluminationVisionShader}"
   * (since v13 will be removed in v15)
   */
  export import IlluminationVisionShader = foundry.canvas.rendering.shaders.IlluminationVisionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AmplificationBackgroundVisionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AmplificationBackgroundVisionShader}"
   * (since v13 will be removed in v15)
   */
  export import AmplificationBackgroundVisionShader = foundry.canvas.rendering.shaders.AmplificationBackgroundVisionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode WaveBackgroundVisionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.WaveBackgroundVisionShader}"
   * (since v13 will be removed in v15)
   */
  export import WaveBackgroundVisionShader = foundry.canvas.rendering.shaders.WaveBackgroundVisionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode WaveColorationVisionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.WaveColorationVisionShader}"
   * (since v13 will be removed in v15)
   */
  export import WaveColorationVisionShader = foundry.canvas.rendering.shaders.WaveColorationVisionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode RegionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.RegionShader}"
   * (since v13 will be removed in v15)
   */
  export import RegionShader = foundry.canvas.rendering.shaders.RegionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode HighlightRegionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.HighlightRegionShader}"
   * (since v13 will be removed in v15)
   */
  export import HighlightRegionShader = foundry.canvas.rendering.shaders.HighlightRegionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AbstractDarknessLevelRegionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AbstractDarknessLevelRegionShader}"
   * (since v13 will be removed in v15)
   */
  export import AbstractDarknessLevelRegionShader = foundry.canvas.rendering.shaders.AbstractDarknessLevelRegionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AdjustDarknessLevelRegionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AdjustDarknessLevelRegionShader}"
   * (since v13 will be removed in v15)
   */
  export import AdjustDarknessLevelRegionShader = foundry.canvas.rendering.shaders.AdjustDarknessLevelRegionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode IlluminationDarknessLevelRegionShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.IlluminationDarknessLevelRegionShader}"
   * (since v13 will be removed in v15)
   */
  export import IlluminationDarknessLevelRegionShader = foundry.canvas.rendering.shaders.IlluminationDarknessLevelRegionShader;

  /**
   * @deprecated "You are accessing the global {@linkcode BaseSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.BaseSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import BaseSamplerShader = foundry.canvas.rendering.shaders.BaseSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode BaselineIlluminationSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.BaselineIlluminationSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import BaselineIlluminationSamplerShader = foundry.canvas.rendering.shaders.BaselineIlluminationSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode ColorAdjustmentsSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.ColorAdjustmentsSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import ColorAdjustmentsSamplerShader = foundry.canvas.rendering.shaders.ColorAdjustmentsSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AmplificationSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AmplificationSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import AmplificationSamplerShader = foundry.canvas.rendering.shaders.AmplificationSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode FogSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.FogSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import FogSamplerShader = foundry.canvas.rendering.shaders.FogSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode OccludableSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.OccludableSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import OccludableSamplerShader = foundry.canvas.rendering.shaders.OccludableSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode DepthSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.DepthSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import DepthSamplerShader = foundry.canvas.rendering.shaders.DepthSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode PrimaryBaseSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.PrimaryBaseSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import PrimaryBaseSamplerShader = foundry.canvas.rendering.shaders.PrimaryBaseSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode TokenRingSamplerShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.TokenRingSamplerShader}"
   * (since v13 will be removed in v15)
   */
  export import TokenRingSamplerShader = foundry.canvas.rendering.shaders.TokenRingSamplerShader;

  /**
   * @deprecated "You are accessing the global {@linkcode AbstractWeatherShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.AbstractWeatherShader}"
   * (since v13 will be removed in v15)
   */
  export import AbstractWeatherShader = foundry.canvas.rendering.shaders.AbstractWeatherShader;

  /**
   * @deprecated "You are accessing the global {@linkcode WeatherShaderEffect} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.WeatherShaderEffect}"
   * (since v13 will be removed in v15)
   */
  export import WeatherShaderEffect = foundry.canvas.rendering.shaders.WeatherShaderEffect;

  /**
   * @deprecated "You are accessing the global {@linkcode FogShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.FogShader}"
   * (since v13 will be removed in v15)
   */
  export import FogShader = foundry.canvas.rendering.shaders.FogShader;

  /**
   * @deprecated "You are accessing the global {@linkcode RainShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.RainShader}"
   * (since v13 will be removed in v15)
   */
  export import RainShader = foundry.canvas.rendering.shaders.RainShader;

  /**
   * @deprecated "You are accessing the global {@linkcode SnowShader} which is now namespaced under {@linkcode foundry.canvas.rendering.shaders.SnowShader}"
   * (since v13 will be removed in v15)
   */
  export import SnowShader = foundry.canvas.rendering.shaders.SnowShader;

  /**
   * @deprecated "You are accessing the global {@linkcode BLEND_MODES} which is now namespaced under {@linkcode foundry.canvas.rendering.BLEND_MODES}"
   * (since v13 will be removed in v15)
   */
  export import BLEND_MODES = foundry.canvas.rendering.BLEND_MODES;

  /**
   * @deprecated "You are accessing the global {@linkcode TextureCompressor} which is now namespaced under {@linkcode foundry.canvas.workers.TextureCompressor}"
   * (since v13 will be removed in v15)
   */
  export import TextureCompressor = foundry.canvas.workers.TextureCompressor;

  /**
   * @deprecated "You are accessing the global {@linkcode AsyncWorker} which is now namespaced under {@linkcode foundry.helpers.AsyncWorker}"
   * (since v13 will be removed in v15)
   */
  export import AsyncWorker = foundry.helpers.AsyncWorker;

  /**
   * @deprecated "You are accessing the global {@linkcode ClientIssues} which is now namespaced under {@linkcode foundry.helpers.ClientIssues}"
   * (since v13 will be removed in v15)
   */
  export import ClientIssues = foundry.helpers.ClientIssues;

  /**
   * @deprecated "You are accessing the global {@linkcode ClientKeybindings} which is now namespaced under {@linkcode foundry.helpers.interaction.ClientKeybindings}"
   * (since v13 will be removed in v15)
   */
  export import ClientKeybindings = foundry.helpers.interaction.ClientKeybindings;

  /**
   * @deprecated "You are accessing the global {@linkcode ClientSettings} which is now namespaced under {@linkcode foundry.helpers.ClientSettings}"
   * (since v13 will be removed in v15)
   */
  export import ClientSettings = foundry.helpers.ClientSettings;

  /**
   * @deprecated "You are accessing the global {@linkcode ClipboardHelper} which is now namespaced under {@linkcode foundry.helpers.interaction.ClipboardHelper}"
   * (since v13 will be removed in v15)
   */
  export import ClipboardHelper = foundry.helpers.interaction.ClipboardHelper;

  /**
   * @deprecated "You are accessing the global {@linkcode DocumentIndex} which is now namespaced under {@linkcode foundry.helpers.DocumentIndex}"
   * (since v13 will be removed in v15)
   */
  export import DocumentIndex = foundry.helpers.DocumentIndex;

  /**
   * @deprecated "You are accessing the global {@linkcode GameTime} which is now namespaced under {@linkcode foundry.helpers.GameTime}"
   * (since v13 will be removed in v15)
   */
  export import GameTime = foundry.helpers.GameTime;

  /**
   * @deprecated "You are accessing the global {@linkcode GamepadManager} which is now namespaced under {@linkcode foundry.helpers.interaction.GamepadManager}"
   * (since v13 will be removed in v15)
   */
  export import GamepadManager = foundry.helpers.interaction.GamepadManager;

  /**
   * @deprecated "You are accessing the global {@linkcode ImageHelper} which is now namespaced under {@linkcode foundry.helpers.media.ImageHelper}"
   * (since v13 will be removed in v15)
   */
  export import ImageHelper = foundry.helpers.media.ImageHelper;

  /**
   * @deprecated "You are accessing the global {@linkcode KeyboardManager} which is now namespaced under {@linkcode foundry.helpers.interaction.KeyboardManager}"
   * (since v13 will be removed in v15)
   */
  export import KeyboardManager = foundry.helpers.interaction.KeyboardManager;

  /**
   * @deprecated "You are accessing the global {@linkcode Localization} which is now namespaced under {@linkcode foundry.helpers.Localization}"
   * (since v13 will be removed in v15)
   */
  export import Localization = foundry.helpers.Localization;

  /**
   * @deprecated "You are accessing the global {@linkcode MouseManager} which is now namespaced under {@linkcode foundry.helpers.interaction.MouseManager}"
   * (since v13 will be removed in v15)
   */
  export import MouseManager = foundry.helpers.interaction.MouseManager;

  /**
   * @deprecated "You are accessing the global {@linkcode SocketInterface} which is now namespaced under {@linkcode foundry.helpers.SocketInterface}"
   * (since v13 will be removed in v15)
   */
  export import SocketInterface = foundry.helpers.SocketInterface;

  /**
   * @deprecated "You are accessing the global {@linkcode TooltipManager} which is now namespaced under {@linkcode foundry.helpers.interaction.TooltipManager.implementation}"
   * (since v13 will be removed in v15)
   * @privateRemarks TODO: This should return the configured class
   */
  export import TooltipManager = foundry.helpers.interaction.TooltipManager;

  /**
   * @deprecated "You are accessing the global {@linkcode VideoHelper} which is now namespaced under {@linkcode foundry.helpers.media.VideoHelper}"
   * (since v13 will be removed in v15)
   */
  export import VideoHelper = foundry.helpers.media.VideoHelper;

  /**
   * @deprecated "You are accessing the global {@linkcode WorkerManager} which is now namespaced under {@linkcode foundry.helpers.WorkerManager}"
   * (since v13 will be removed in v15)
   */
  export import WorkerManager = foundry.helpers.WorkerManager;

  /**
   * @deprecated "You are accessing the global {@linkcode SortingHelpers} which is now namespaced under {@linkcode foundry.utils.SortingHelpers}"
   * (since v13 will be removed in v15)
   */
  export import SortingHelpers = foundry.utils.SortingHelpers;

  /**
   * @deprecated "You are accessing the global {@linkcode saveDataToFile} which is now namespaced under {@linkcode foundry.utils.saveDataToFile}"
   * (since v13 will be removed in v15)
   */
  export import saveDataToFile = foundry.utils.saveDataToFile;

  /**
   * @deprecated "You are accessing the global {@linkcode readTextFromFile} which is now namespaced under {@linkcode foundry.utils.readTextFromFile}"
   * (since v13 will be removed in v15)
   */
  export import readTextFromFile = foundry.utils.readTextFromFile;

  /**
   * @deprecated "You are accessing the global {@linkcode NewUserExperience} which is now namespaced under {@linkcode foundry.nue.NewUserExperienceManager}"
   * (since v13 will be removed in v15)
   */
  export import NewUserExperience = foundry.nue.NewUserExperienceManager;

  /**
   * @deprecated "You are accessing the global {@linkcode Tours} which is now namespaced under {@linkcode foundry.nue.ToursCollection}"
   * (since v13 will be removed in v15)
   */
  export import Tours = foundry.nue.ToursCollection;

  /**
   * @deprecated "You are accessing the global {@linkcode Tour} which is now namespaced under {@linkcode foundry.nue.Tour}"
   * (since v13 will be removed in v15)
   */
  export import Tour = foundry.nue.Tour;

  /**
   * @deprecated "You are accessing the global {@linkcode CanvasTour} which is now namespaced under {@linkcode foundry.nue.tours.CanvasTour}"
   * (since v13 will be removed in v15)
   */
  export import CanvasTour = foundry.nue.tours.CanvasTour;

  /**
   * @deprecated "You are accessing the global {@linkcode SetupTour} which is now namespaced under {@linkcode foundry.nue.tours.SetupTour}"
   * (since v13 will be removed in v15)
   */
  export import SetupTour = foundry.nue.tours.SetupTour;

  /**
   * @deprecated "You are accessing the global {@linkcode SidebarTour} which is now namespaced under {@linkcode foundry.nue.tours.SidebarTour}"
   * (since v13 will be removed in v15)
   */
  export import SidebarTour = foundry.nue.tours.SidebarTour;

  /**
   * @deprecated "You are accessing the global {@linkcode ClientPackageMixin} which is now namespaced under {@linkcode foundry.packages.ClientPackageMixin}"
   * (since v13 will be removed in v15)
   */
  export import ClientPackageMixin = foundry.packages.ClientPackageMixin;

  /**
   * @deprecated The ClientPackage namespace has been adjusted to ClientPackageMixin
   */
  export import ClientPackage = foundry.packages.ClientPackageMixin;

  /**
   * @deprecated "You are accessing the global {@linkcode Module} which is now namespaced under {@linkcode foundry.packages.Module}"
   * (since v13 will be removed in v15)
   */
  export import Module = foundry.packages.Module;

  /**
   * @deprecated "You are accessing the global {@linkcode System} which is now namespaced under {@linkcode foundry.packages.System}"
   * (since v13 will be removed in v15)
   */
  export import System = foundry.packages.System;

  /**
   * @deprecated "You are accessing the global {@linkcode World} which is now namespaced under {@linkcode foundry.packages.World}"
   * (since v13 will be removed in v15)
   */
  export import World = foundry.packages.World;

  /**
   * @deprecated "You are accessing the global {@linkcode PACKAGE_TYPES} which is now namespaced under {@linkcode foundry.packages.PACKAGE_TYPES}"
   * (since v13 will be removed in v15)
   */
  export import PACKAGE_TYPES = foundry.packages.PACKAGE_TYPES;

  // v12 deprecations

  /** @deprecated since v12 will be removed in v14 */
  export import Semaphore = _utils.Semaphore;

  /** @deprecated since v12 will be removed in v14 */
  export import IterableWeakMap = _utils.IterableWeakMap;

  /** @deprecated since v12 will be removed in v14 */
  export import IterableWeakSet = _utils.IterableWeakSet;

  /* --- geometry --- */

  /** @deprecated since v12 will be removed in v14 */
  export import orient2dFast = _utils.orient2dFast;

  /** @deprecated since v12 will be removed in v14 */
  export import lineSegmentIntersects = _utils.lineSegmentIntersects;

  /** @deprecated since v12 will be removed in v14 */
  export import lineLineIntersection = _utils.lineLineIntersection;

  /** @deprecated since v12 will be removed in v14 */
  export import lineSegmentIntersection = _utils.lineSegmentIntersection;

  /** @deprecated since v12 will be removed in v14 */
  export import lineCircleIntersection = _utils.lineCircleIntersection;

  /** @deprecated since v12 will be removed in v14 */
  export import closestPointToSegment = _utils.closestPointToSegment;

  /** @deprecated since v12 will be removed in v14 */
  export import quadraticIntersection = _utils.quadraticIntersection;

  /* --- helpers --- */

  /** @deprecated since v12 will be removed in v14 */
  export import benchmark = _utils.benchmark;

  /** @deprecated since v12 will be removed in v14 */
  export import threadLock = _utils.threadLock;

  /** @deprecated since v12 will be removed in v14 */
  export import debounce = _utils.debounce;

  /** @deprecated since v12 will be removed in v14 */
  export import debouncedReload = _utils.debouncedReload;

  /** @deprecated since v12 will be removed in v14 */
  export import deepClone = _utils.deepClone;

  /** @deprecated since v12 will be removed in v14 */
  export import diffObject = _utils.diffObject;

  /** @deprecated since v12 will be removed in v14 */
  export import objectsEqual = _utils.objectsEqual;

  /** @deprecated since v12 will be removed in v14 */
  export import duplicate = _utils.duplicate;

  /** @deprecated since v12 will be removed in v14 */
  export import isSubclass = _utils.isSubclass;

  /** @deprecated since v12 will be removed in v14 */
  export import getDefiningClass = _utils.getDefiningClass;

  /** @deprecated since v12 will be removed in v14 */
  export import encodeURL = _utils.encodeURL;

  /** @deprecated since v12 will be removed in v14 */
  export import expandObject = _utils.expandObject;

  /** @deprecated since v12 will be removed in v14 */
  export import filterObject = _utils.filterObject;

  /** @deprecated since v12 will be removed in v14 */
  export import flattenObject = _utils.flattenObject;

  /** @deprecated since v12 will be removed in v14 */
  export import getParentClasses = _utils.getParentClasses;

  /** @deprecated since v12 will be removed in v14 */
  export import getRoute = _utils.getRoute;

  /** @deprecated since v12 will be removed in v14 */
  export import getType = _utils.getType;

  /** @deprecated since v12 will be removed in v14 */
  export import hasProperty = _utils.hasProperty;

  /** @deprecated since v12 will be removed in v14 */
  export import getProperty = _utils.getProperty;

  /** @deprecated since v12 will be removed in v14 */
  export import setProperty = _utils.setProperty;

  /** @deprecated since v12 will be removed in v14 */
  export import invertObject = _utils.invertObject;

  /** @deprecated since v12 will be removed in v14 */
  export import isEmpty = _utils.isEmpty;

  /** @deprecated since v12 will be removed in v14 */
  export import mergeObject = _utils.mergeObject;

  /** @deprecated since v12 will be removed in v14 */
  export import parseS3URL = _utils.parseS3URL;

  /** @deprecated since v12 will be removed in v14 */
  export import randomID = _utils.randomID;

  /** @deprecated since v12 will be removed in v14 */
  export import timeSince = _utils.timeSince;

  /** @deprecated since v12 will be removed in v14 */
  export import formatFileSize = _utils.formatFileSize;

  /** @deprecated since v12 will be removed in v14 */
  export import parseUuid = _utils.parseUuid;

  /* --- http --- */

  /** @deprecated since v12 will be removed in v14 */
  export import fetchWithTimeout = _utils.fetchWithTimeout;

  /** @deprecated since v12 will be removed in v14 */
  export import fetchJsonWithTimeout = _utils.fetchJsonWithTimeout;

  /* --- logging --- */

  /** @deprecated since v12 will be removed in v14 */
  export import logCompatibilityWarning = _utils.logCompatibilityWarning;
}
