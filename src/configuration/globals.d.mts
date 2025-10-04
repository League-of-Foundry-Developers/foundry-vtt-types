// Note(LukeAbby): This exists so that you can do stuff like this:
// ```typescript
// declare module "fvtt-types/configuration" {
//   namespace foundry.dice.terms.RollTerm {
//     interface Options {
//       rollOrder?: number;
//     }
//   }
// }
// ```
// If you try to merge with `declare global` you'll instead completely override the namespace.

// eslint-disable-next-line import-x/no-named-default
import { default as AlphaBlurFilter, AlphaBlurFilterPass } from "#client/canvas/rendering/filters/blur.mjs";
import { ShaderField } from "#client/data/fields.mjs";
import { DarknessLevelContainer } from "#client/canvas/layers/_module.mjs";

// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AVSettings = globalThis.AVSettings;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AbstractBaseFilter = globalThis.AbstractBaseFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AbstractBaseMaskFilter = globalThis.AbstractBaseMaskFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AbstractBaseShader = globalThis.AbstractBaseShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AbstractDarknessLevelRegionShader = globalThis.AbstractDarknessLevelRegionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AbstractWeatherShader = globalThis.AbstractWeatherShader;
export import ActiveEffect = globalThis.ActiveEffect;
export import Actor = globalThis.Actor;
export import ActorDelta = globalThis.ActorDelta;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Actors = globalThis.Actors;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AdaptiveBackgroundShader = globalThis.AdaptiveBackgroundShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AdaptiveColorationShader = globalThis.AdaptiveColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AdaptiveDarknessShader = globalThis.AdaptiveDarknessShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AdaptiveFragmentChannelMixin = globalThis.AdaptiveFragmentChannelMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AdaptiveIlluminationShader = globalThis.AdaptiveIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AdaptiveLightingShader = globalThis.AdaptiveLightingShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AdaptiveVisionShader = globalThis.AdaptiveVisionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AdjustDarknessLevelRegionShader = globalThis.AdjustDarknessLevelRegionShader;
export import Adventure = globalThis.Adventure;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AlertPing = globalThis.AlertPing;

// The two following are (possibly erroneously) not re-exported by their `_module.mjs`, despite being previously global and not `@internal`

/** @deprecated No longer global as of v13.344, nor exported anywhere accessible */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AlphaBlurFilter = AlphaBlurFilter;

/** @deprecated No longer global as of v13.344, nor exported anywhere accessible */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AlphaBlurFilterPass = AlphaBlurFilterPass;

// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AmbientLight = globalThis.AmbientLight;
export import AmbientLightDocument = globalThis.AmbientLightDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AmbientSound = globalThis.AmbientSound;
export import AmbientSoundDocument = globalThis.AmbientSoundDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AmplificationBackgroundVisionShader = globalThis.AmplificationBackgroundVisionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AmplificationSamplerShader = globalThis.AmplificationSamplerShader;
export import Array = globalThis.Array;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ArrowPing = globalThis.ArrowPing;
export import AudioNode = globalThis.AudioNode;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import AutumnLeavesWeatherEffect = globalThis.AutumnLeavesWeatherEffect;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BackgroundVisionShader = globalThis.BackgroundVisionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BaseSamplerShader = globalThis.BaseSamplerShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BaseShaderMixin = globalThis.BaseShaderMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BaselineIlluminationSamplerShader = globalThis.BaselineIlluminationSamplerShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BatchRenderer = globalThis.BatchRenderer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BatchShaderGenerator = globalThis.BatchShaderGenerator;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BewitchingWaveColorationShader = globalThis.BewitchingWaveColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BewitchingWaveIlluminationShader = globalThis.BewitchingWaveIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BlackHoleDarknessShader = globalThis.BlackHoleDarknessShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import BLEND_MODES = globalThis.BLEND_MODES;
export import CONFIG = globalThis.CONFIG;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CachedContainer = globalThis.CachedContainer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Canvas = globalThis.Canvas;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasAnimation = globalThis.CanvasAnimation;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasBackgroundAlterationEffects = globalThis.CanvasBackgroundAlterationEffects;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasColorationEffects = globalThis.CanvasColorationEffects;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasDarknessEffects = globalThis.CanvasDarknessEffects;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasDepthMask = globalThis.CanvasDepthMask;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasGroupMixin = globalThis.CanvasGroupMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasIlluminationEffects = globalThis.CanvasIlluminationEffects;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasLayer = globalThis.CanvasLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasOcclusionMask = globalThis.CanvasOcclusionMask;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasQuadtree = globalThis.CanvasQuadtree;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasTransformMixin = globalThis.CanvasTransformMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasVisibility = globalThis.CanvasVisibility;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CanvasVisionMask = globalThis.CanvasVisionMask;
export import Card = globalThis.Card;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CardStacks = globalThis.CardStacks;
export import Cards = globalThis.Cards;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ChatBubbles = globalThis.ChatBubbles;
export import ChatMessage = globalThis.ChatMessage;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ChevronPing = globalThis.ChevronPing;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ChromaColorationShader = globalThis.ChromaColorationShader;
export import ClientDocument = globalThis.ClientDocument;
export import ClipperLib = globalThis.ClipperLib;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ClockwiseSweepPolygon = globalThis.ClockwiseSweepPolygon;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ColorAdjustmentsSamplerShader = globalThis.ColorAdjustmentsSamplerShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ColorationVisionShader = globalThis.ColorationVisionShader;
export import Combat = globalThis.Combat;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CombatEncounters = globalThis.CombatEncounters;
export import Combatant = globalThis.Combatant;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CompendiumCollection = globalThis.CompendiumCollection;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import CompendiumPacks = globalThis.CompendiumPacks;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ControlIcon = globalThis.ControlIcon;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ControlsLayer = globalThis.ControlsLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Cursor = globalThis.Cursor;

/** @deprecated No longer global as of 13.345, nor exported anywhere accessible */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DarknessLevelContainer = DarknessLevelContainer;

// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DepthSamplerShader = globalThis.DepthSamplerShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DetectionMode = globalThis.DetectionMode;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DetectionModeAll = globalThis.DetectionModeAll;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DetectionModeLightPerception = globalThis.DetectionModeLightPerception;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DetectionModeInvisibility = globalThis.DetectionModeInvisibility;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DetectionModeBasicSight = globalThis.DetectionModeBasicSight;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DetectionModeTremor = globalThis.DetectionModeTremor;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DirectoryCollectionMixin = globalThis.DirectoryCollectionMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DocumentCollection = globalThis.DocumentCollection;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DoorControl = globalThis.DoorControl;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Drawing = globalThis.Drawing;
export import DrawingDocument = globalThis.DrawingDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DrawingsLayer = globalThis.DrawingsLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import DynamicRingData = globalThis.DynamicRingData;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import EffectsCanvasGroup = globalThis.EffectsCanvasGroup;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import EmanationColorationShader = globalThis.EmanationColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import EnergyFieldColorationShader = globalThis.EnergyFieldColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import EnvironmentCanvasGroup = globalThis.EnvironmentCanvasGroup;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FairyLightColorationShader = globalThis.FairyLightColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FairyLightIlluminationShader = globalThis.FairyLightIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FlameColorationShader = globalThis.FlameColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FlameIlluminationShader = globalThis.FlameIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FogColorationShader = globalThis.FogColorationShader;
export import FogExploration = globalThis.FogExploration;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FogExplorations = globalThis.FogExplorations;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FogManager = globalThis.FogManager;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FogSamplerShader = globalThis.FogSamplerShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FogShader = globalThis.FogShader;
export import Folder = globalThis.Folder;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Folders = globalThis.Folders;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ForceGridColorationShader = globalThis.ForceGridColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FramebufferSnapshot = globalThis.FramebufferSnapshot;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import FullCanvasObjectMixin = globalThis.FullCanvasObjectMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import GhostLightColorationShader = globalThis.GhostLightColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import GhostLightIlluminationShader = globalThis.GhostLightIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import GlowOverlayFilter = globalThis.GlowOverlayFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import GridLayer = globalThis.GridLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import GridMesh = globalThis.GridMesh;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import GridHighlight = globalThis.GridHighlight;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import GridShader = globalThis.GridShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import HexaDomeColorationShader = globalThis.HexaDomeColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import HiddenCanvasGroup = globalThis.HiddenCanvasGroup;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import HighlightRegionShader = globalThis.HighlightRegionShader;
export import Hooks = globalThis.Hooks;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import IlluminationDarknessLevelRegionShader = globalThis.IlluminationDarknessLevelRegionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import IlluminationVisionShader = globalThis.IlluminationVisionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import InteractionLayer = globalThis.InteractionLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import InterfaceCanvasGroup = globalThis.InterfaceCanvasGroup;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import InvisibilityFilter = globalThis.InvisibilityFilter;
export import Item = globalThis.Item;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Items = globalThis.Items;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Journal = globalThis.Journal;
export import JournalEntry = globalThis.JournalEntry;
export import JournalEntryPage = globalThis.JournalEntryPage;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import LightDomeColorationShader = globalThis.LightDomeColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import LightingLayer = globalThis.LightingLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import LimitedAnglePolygon = globalThis.LimitedAnglePolygon;
export import LoadTexture = globalThis.LoadTexture;
export import Macro = globalThis.Macro;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Macros = globalThis.Macros;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import MagicalGloomDarknessShader = globalThis.MagicalGloomDarknessShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import MeasuredTemplate = globalThis.MeasuredTemplate;
export import MeasuredTemplateDocument = globalThis.MeasuredTemplateDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Messages = globalThis.Messages;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import MouseInteractionManager = globalThis.MouseInteractionManager;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Note = globalThis.Note;
export import NoteDocument = globalThis.NoteDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import NotesLayer = globalThis.NotesLayer;

/** @deprecated No deprecated global provided by foundry as of 13.345 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ObservableTransform = foundry.canvas.geometry.ObservableTransform;

// eslint-disable-next-line @typescript-eslint/no-deprecated
export import OccludableSamplerShader = globalThis.OccludableSamplerShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import OutlineOverlayFilter = globalThis.OutlineOverlayFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import OverlayCanvasGroup = globalThis.OverlayCanvasGroup;
export import PIXI = globalThis.PIXI;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ParticleEffect = globalThis.ParticleEffect;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PerceptionManager = globalThis.PerceptionManager;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Ping = globalThis.Ping;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PlaceableObject = globalThis.PlaceableObject;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PlaceablesLayer = globalThis.PlaceablesLayer;
export import Playlist = globalThis.Playlist;
export import PlaylistSound = globalThis.PlaylistSound;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Playlists = globalThis.Playlists;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PolygonMesher = globalThis.PolygonMesher;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PointSourcePolygon = globalThis.PointSourcePolygon;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PointSourceMesh = globalThis.PointSourceMesh;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PreciseText = globalThis.PreciseText;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimaryBaseSamplerShader = globalThis.PrimaryBaseSamplerShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimaryCanvasGroup = globalThis.PrimaryCanvasGroup;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimaryCanvasContainer = globalThis.PrimaryCanvasContainer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimaryCanvasGroupAmbienceFilter = globalThis.PrimaryCanvasGroupAmbienceFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimaryCanvasObjectMixin = globalThis.PrimaryCanvasObjectMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimaryGraphics = globalThis.PrimaryGraphics;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimaryOccludableObjectMixin = globalThis.PrimaryOccludableObjectMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimaryParticleEffect = globalThis.PrimaryParticleEffect;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PrimarySpriteMesh = globalThis.PrimarySpriteMesh;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PulseColorationShader = globalThis.PulseColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PulseIlluminationShader = globalThis.PulseIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import PulsePing = globalThis.PulsePing;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Quadtree = globalThis.Quadtree;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import QuadMesh = globalThis.QuadMesh;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RadialRainbowColorationShader = globalThis.RadialRainbowColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RainShader = globalThis.RainShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Ray = globalThis.Ray;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Region = globalThis.Region;
export import RegionBehavior = globalThis.RegionBehavior;
export import RegionDocument = globalThis.RegionDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RegionGeometry = globalThis.RegionGeometry;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RegionLayer = globalThis.RegionLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RegionPolygonTree = globalThis.RegionPolygonTree;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RegionShader = globalThis.RegionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RegionShape = globalThis.RegionShape;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RegionMesh = globalThis.RegionMesh;

/** @deprecated Use {@linkcode foundry.canvas.interaction.RenderFlag} instead */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RenderFlag = foundry.canvas.interaction.RenderFlag;

// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RenderFlagsMixin = globalThis.RenderFlagsMixin;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RenderFlags = globalThis.RenderFlags;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RenderedCanvasGroup = globalThis.RenderedCanvasGroup;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ResizeHandle = globalThis.ResizeHandle;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RevolvingColorationShader = globalThis.RevolvingColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RoilingDarknessShader = globalThis.RoilingDarknessShader;
export import RollTable = globalThis.RollTable;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import RollTables = globalThis.RollTables;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Ruler = globalThis.Ruler;
export import Scene = globalThis.Scene;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SceneManager = globalThis.SceneManager;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Scenes = globalThis.Scenes;
export import Setting = globalThis.Setting;

/** @deprecated No longer global as of 13.345, nor exported anywhere accessible */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import ShaderField = ShaderField;

export import SimplePeer = globalThis.SimplePeer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SirenColorationShader = globalThis.SirenColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SirenIlluminationShader = globalThis.SirenIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SMAAFilter = globalThis.SMAAFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SmokePatchColorationShader = globalThis.SmokePatchColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SmokePatchIlluminationShader = globalThis.SmokePatchIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SmoothNoise = globalThis.SmoothNoise;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SnowShader = globalThis.SnowShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SoundsLayer = globalThis.SoundsLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SpriteMesh = globalThis.SpriteMesh;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import StarLightColorationShader = globalThis.StarLightColorationShader;
export import String = globalThis.String;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SunburstColorationShader = globalThis.SunburstColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SunburstIlluminationShader = globalThis.SunburstIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import SwirlingRainbowColorationShader = globalThis.SwirlingRainbowColorationShader;
export import TableResult = globalThis.TableResult;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TemplateLayer = globalThis.TemplateLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TextureCompressor = globalThis.TextureCompressor;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TextureExtractor = globalThis.TextureExtractor;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TextureLoader = globalThis.TextureLoader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TextureTransitionFilter = globalThis.TextureTransitionFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Tile = globalThis.Tile;
export import TileDocument = globalThis.TileDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TilesLayer = globalThis.TilesLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Token = globalThis.Token;
export import TokenDocument = globalThis.TokenDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TokenLayer = globalThis.TokenLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TokenRing = globalThis.TokenRing;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TokenRingConfig = globalThis.TokenRingConfig;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TokenRingSamplerShader = globalThis.TokenRingSamplerShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TorchColorationShader = globalThis.TorchColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import TorchIlluminationShader = globalThis.TorchIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import UnboundContainer = globalThis.UnboundContainer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import UnboundTransform = globalThis.UnboundTransform;
export import User = globalThis.User;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import UserTargets = globalThis.UserTargets;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Users = globalThis.Users;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import VisibilityFilter = globalThis.VisibilityFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import VisionMaskFilter = globalThis.VisionMaskFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import VisionMode = globalThis.VisionMode;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import VisualEffectsMaskingFilter = globalThis.VisualEffectsMaskingFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import VoidFilter = globalThis.VoidFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import VortexColorationShader = globalThis.VortexColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import VortexIlluminationShader = globalThis.VortexIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import Wall = globalThis.Wall;
export import WallDocument = globalThis.WallDocument;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WallsLayer = globalThis.WallsLayer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WaveBackgroundVisionShader = globalThis.WaveBackgroundVisionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WaveColorationShader = globalThis.WaveColorationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WaveColorationVisionShader = globalThis.WaveColorationVisionShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WaveIlluminationShader = globalThis.WaveIlluminationShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WeatherEffects = globalThis.WeatherEffects;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WeatherOcclusionMaskFilter = globalThis.WeatherOcclusionMaskFilter;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WeatherShaderEffect = globalThis.WeatherShaderEffect;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WeilerAthertonClipper = globalThis.WeilerAthertonClipper;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WorldCollection = globalThis.WorldCollection;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import WorldSettings = globalThis.WorldSettings;
// eslint-disable-next-line @typescript-eslint/no-deprecated
export import loadTexture = globalThis.loadTexture;
export import foundry = globalThis.foundry;
export import io = globalThis.io;
export import tinyMCE = globalThis.tinyMCE;

export import I18nInitGame = globalThis.I18nInitGame;
export import InitGame = globalThis.InitGame;
export import SetupGame = globalThis.SetupGame;
export import ReadyGame = globalThis.ReadyGame;

export import EarcutEdges = globalThis.EarcutEdges;
export import PackageManifestData = globalThis.PackageManifestData;
