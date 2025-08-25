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

export import AVSettings = globalThis.AVSettings;
export import AbstractBaseFilter = globalThis.AbstractBaseFilter;
export import AbstractBaseMaskFilter = globalThis.AbstractBaseMaskFilter;
export import AbstractBaseShader = globalThis.AbstractBaseShader;
export import AbstractDarknessLevelRegionShader = globalThis.AbstractDarknessLevelRegionShader;
export import AbstractWeatherShader = globalThis.AbstractWeatherShader;
export import ActiveEffect = globalThis.ActiveEffect;
export import Actor = globalThis.Actor;
export import ActorDelta = globalThis.ActorDelta;
export import Actors = globalThis.Actors;
export import AdaptiveBackgroundShader = globalThis.AdaptiveBackgroundShader;
export import AdaptiveColorationShader = globalThis.AdaptiveColorationShader;
export import AdaptiveDarknessShader = globalThis.AdaptiveDarknessShader;
export import AdaptiveFragmentChannelMixin = globalThis.AdaptiveFragmentChannelMixin;
export import AdaptiveIlluminationShader = globalThis.AdaptiveIlluminationShader;
export import AdaptiveLightingShader = globalThis.AdaptiveLightingShader;
export import AdaptiveVisionShader = globalThis.AdaptiveVisionShader;
export import AdjustDarknessLevelRegionShader = globalThis.AdjustDarknessLevelRegionShader;
export import Adventure = globalThis.Adventure;
export import AlertPing = globalThis.AlertPing;

// The two following are (possibly erroneously) not re-exported by their `_module.mjs`, despite being previously global and not `@internal`

/** @deprecated No longer global as of v13.344, nor exported anywhere accessible */
export import AlphaBlurFilter = AlphaBlurFilter;

/** @deprecated No longer global as of v13.344, nor exported anywhere accessible */
export import AlphaBlurFilterPass = AlphaBlurFilterPass;

export import AmbientLight = globalThis.AmbientLight;
export import AmbientLightDocument = globalThis.AmbientLightDocument;
export import AmbientSound = globalThis.AmbientSound;
export import AmbientSoundDocument = globalThis.AmbientSoundDocument;
export import AmplificationBackgroundVisionShader = globalThis.AmplificationBackgroundVisionShader;
export import AmplificationSamplerShader = globalThis.AmplificationSamplerShader;
export import Array = globalThis.Array;
export import ArrowPing = globalThis.ArrowPing;
export import AudioNode = globalThis.AudioNode;
export import AutumnLeavesWeatherEffect = globalThis.AutumnLeavesWeatherEffect;
export import BackgroundVisionShader = globalThis.BackgroundVisionShader;
export import BaseSamplerShader = globalThis.BaseSamplerShader;
export import BaseShaderMixin = globalThis.BaseShaderMixin;
export import BaselineIlluminationSamplerShader = globalThis.BaselineIlluminationSamplerShader;
export import BatchRenderer = globalThis.BatchRenderer;
export import BatchShaderGenerator = globalThis.BatchShaderGenerator;
export import BewitchingWaveColorationShader = globalThis.BewitchingWaveColorationShader;
export import BewitchingWaveIlluminationShader = globalThis.BewitchingWaveIlluminationShader;
export import BlackHoleDarknessShader = globalThis.BlackHoleDarknessShader;
export import BLEND_MODES = globalThis.BLEND_MODES;
export import CONFIG = globalThis.CONFIG;
export import CachedContainer = globalThis.CachedContainer;
export import Canvas = globalThis.Canvas;
export import CanvasAnimation = globalThis.CanvasAnimation;
export import CanvasBackgroundAlterationEffects = globalThis.CanvasBackgroundAlterationEffects;
export import CanvasColorationEffects = globalThis.CanvasColorationEffects;
export import CanvasDarknessEffects = globalThis.CanvasDarknessEffects;
export import CanvasDepthMask = globalThis.CanvasDepthMask;
export import CanvasGroupMixin = globalThis.CanvasGroupMixin;
export import CanvasIlluminationEffects = globalThis.CanvasIlluminationEffects;
export import CanvasLayer = globalThis.CanvasLayer;
export import CanvasOcclusionMask = globalThis.CanvasOcclusionMask;
export import CanvasQuadtree = globalThis.CanvasQuadtree;
export import CanvasTransformMixin = globalThis.CanvasTransformMixin;
export import CanvasVisibility = globalThis.CanvasVisibility;
export import CanvasVisionMask = globalThis.CanvasVisionMask;
export import Card = globalThis.Card;
export import CardStacks = globalThis.CardStacks;
export import Cards = globalThis.Cards;
export import ChatBubbles = globalThis.ChatBubbles;
export import ChatMessage = globalThis.ChatMessage;
export import ChevronPing = globalThis.ChevronPing;
export import ChromaColorationShader = globalThis.ChromaColorationShader;
export import ClientDocument = globalThis.ClientDocument;
export import ClipperLib = globalThis.ClipperLib;
export import ClockwiseSweepPolygon = globalThis.ClockwiseSweepPolygon;
export import ColorAdjustmentsSamplerShader = globalThis.ColorAdjustmentsSamplerShader;
export import ColorationVisionShader = globalThis.ColorationVisionShader;
export import Combat = globalThis.Combat;
export import CombatEncounters = globalThis.CombatEncounters;
export import Combatant = globalThis.Combatant;
export import CompendiumCollection = globalThis.CompendiumCollection;
export import CompendiumPacks = globalThis.CompendiumPacks;
export import ControlIcon = globalThis.ControlIcon;
export import ControlsLayer = globalThis.ControlsLayer;
export import Cursor = globalThis.Cursor;

/** @deprecated No longer global as of 13.345, nor exported anywhere accessible */
export import DarknessLevelContainer = DarknessLevelContainer;

export import DepthSamplerShader = globalThis.DepthSamplerShader;
export import DetectionMode = globalThis.DetectionMode;
export import DetectionModeAll = globalThis.DetectionModeAll;
export import DetectionModeLightPerception = globalThis.DetectionModeLightPerception;
export import DetectionModeInvisibility = globalThis.DetectionModeInvisibility;
export import DetectionModeBasicSight = globalThis.DetectionModeBasicSight;
export import DetectionModeTremor = globalThis.DetectionModeTremor;
export import DirectoryCollectionMixin = globalThis.DirectoryCollectionMixin;
export import DocumentCollection = globalThis.DocumentCollection;
export import DoorControl = globalThis.DoorControl;
export import Drawing = globalThis.Drawing;
export import DrawingDocument = globalThis.DrawingDocument;
export import DrawingsLayer = globalThis.DrawingsLayer;
export import DynamicRingData = globalThis.DynamicRingData;
export import EffectsCanvasGroup = globalThis.EffectsCanvasGroup;
export import EmanationColorationShader = globalThis.EmanationColorationShader;
export import EnergyFieldColorationShader = globalThis.EnergyFieldColorationShader;
export import EnvironmentCanvasGroup = globalThis.EnvironmentCanvasGroup;
export import FairyLightColorationShader = globalThis.FairyLightColorationShader;
export import FairyLightIlluminationShader = globalThis.FairyLightIlluminationShader;
export import FlameColorationShader = globalThis.FlameColorationShader;
export import FlameIlluminationShader = globalThis.FlameIlluminationShader;
export import FogColorationShader = globalThis.FogColorationShader;
export import FogExploration = globalThis.FogExploration;
export import FogExplorations = globalThis.FogExplorations;
export import FogManager = globalThis.FogManager;
export import FogSamplerShader = globalThis.FogSamplerShader;
export import FogShader = globalThis.FogShader;
export import Folder = globalThis.Folder;
export import Folders = globalThis.Folders;
export import ForceGridColorationShader = globalThis.ForceGridColorationShader;
export import FramebufferSnapshot = globalThis.FramebufferSnapshot;
export import FullCanvasObjectMixin = globalThis.FullCanvasObjectMixin;
export import GhostLightColorationShader = globalThis.GhostLightColorationShader;
export import GhostLightIlluminationShader = globalThis.GhostLightIlluminationShader;
export import GlowOverlayFilter = globalThis.GlowOverlayFilter;
export import GridLayer = globalThis.GridLayer;
export import GridMesh = globalThis.GridMesh;
export import GridHighlight = globalThis.GridHighlight;
export import GridShader = globalThis.GridShader;
export import HexaDomeColorationShader = globalThis.HexaDomeColorationShader;
export import HiddenCanvasGroup = globalThis.HiddenCanvasGroup;
export import HighlightRegionShader = globalThis.HighlightRegionShader;
export import Hooks = globalThis.Hooks;
export import IlluminationDarknessLevelRegionShader = globalThis.IlluminationDarknessLevelRegionShader;
export import IlluminationVisionShader = globalThis.IlluminationVisionShader;
export import InteractionLayer = globalThis.InteractionLayer;
export import InterfaceCanvasGroup = globalThis.InterfaceCanvasGroup;
export import InvisibilityFilter = globalThis.InvisibilityFilter;
export import Item = globalThis.Item;
export import Items = globalThis.Items;
export import Journal = globalThis.Journal;
export import JournalEntry = globalThis.JournalEntry;
export import JournalEntryPage = globalThis.JournalEntryPage;
export import LightDomeColorationShader = globalThis.LightDomeColorationShader;
export import LightingLayer = globalThis.LightingLayer;
export import LimitedAnglePolygon = globalThis.LimitedAnglePolygon;
export import LoadTexture = globalThis.LoadTexture;
export import Macro = globalThis.Macro;
export import Macros = globalThis.Macros;
export import MagicalGloomDarknessShader = globalThis.MagicalGloomDarknessShader;
export import MeasuredTemplate = globalThis.MeasuredTemplate;
export import MeasuredTemplateDocument = globalThis.MeasuredTemplateDocument;
export import Messages = globalThis.Messages;
export import MouseInteractionManager = globalThis.MouseInteractionManager;
export import Note = globalThis.Note;
export import NoteDocument = globalThis.NoteDocument;
export import NotesLayer = globalThis.NotesLayer;

/** @deprecated No deprecated global provided by foundry as of 13.345 */
export import ObservableTransform = foundry.canvas.geometry.ObservableTransform;

export import OccludableSamplerShader = globalThis.OccludableSamplerShader;
export import OutlineOverlayFilter = globalThis.OutlineOverlayFilter;
export import OverlayCanvasGroup = globalThis.OverlayCanvasGroup;
export import PIXI = globalThis.PIXI;
export import ParticleEffect = globalThis.ParticleEffect;
export import PerceptionManager = globalThis.PerceptionManager;
export import Ping = globalThis.Ping;
export import PlaceableObject = globalThis.PlaceableObject;
export import PlaceablesLayer = globalThis.PlaceablesLayer;
export import Playlist = globalThis.Playlist;
export import PlaylistSound = globalThis.PlaylistSound;
export import Playlists = globalThis.Playlists;
export import PolygonMesher = globalThis.PolygonMesher;
export import PointSourcePolygon = globalThis.PointSourcePolygon;
export import PointSourceMesh = globalThis.PointSourceMesh;
export import PreciseText = globalThis.PreciseText;
export import PrimaryBaseSamplerShader = globalThis.PrimaryBaseSamplerShader;
export import PrimaryCanvasGroup = globalThis.PrimaryCanvasGroup;
export import PrimaryCanvasContainer = globalThis.PrimaryCanvasContainer;
export import PrimaryCanvasGroupAmbienceFilter = globalThis.PrimaryCanvasGroupAmbienceFilter;
export import PrimaryCanvasObjectMixin = globalThis.PrimaryCanvasObjectMixin;
export import PrimaryGraphics = globalThis.PrimaryGraphics;
export import PrimaryOccludableObjectMixin = globalThis.PrimaryOccludableObjectMixin;
export import PrimaryParticleEffect = globalThis.PrimaryParticleEffect;
export import PrimarySpriteMesh = globalThis.PrimarySpriteMesh;
export import PulseColorationShader = globalThis.PulseColorationShader;
export import PulseIlluminationShader = globalThis.PulseIlluminationShader;
export import PulsePing = globalThis.PulsePing;
export import Quadtree = globalThis.Quadtree;
export import QuadMesh = globalThis.QuadMesh;
export import RadialRainbowColorationShader = globalThis.RadialRainbowColorationShader;
export import RainShader = globalThis.RainShader;
export import Ray = globalThis.Ray;
export import Region = globalThis.Region;
export import RegionBehavior = globalThis.RegionBehavior;
export import RegionDocument = globalThis.RegionDocument;
export import RegionGeometry = globalThis.RegionGeometry;
export import RegionLayer = globalThis.RegionLayer;
export import RegionPolygonTree = globalThis.RegionPolygonTree;
export import RegionShader = globalThis.RegionShader;
export import RegionShape = globalThis.RegionShape;
export import RegionMesh = globalThis.RegionMesh;

/** @deprecated Use {@linkcode foundry.canvas.interaction.RenderFlag} instead */
export import RenderFlag = foundry.canvas.interaction.RenderFlag;

export import RenderFlagsMixin = globalThis.RenderFlagsMixin;
export import RenderFlags = globalThis.RenderFlags;
export import RenderedCanvasGroup = globalThis.RenderedCanvasGroup;
export import ResizeHandle = globalThis.ResizeHandle;
export import RevolvingColorationShader = globalThis.RevolvingColorationShader;
export import RoilingDarknessShader = globalThis.RoilingDarknessShader;
export import RollTable = globalThis.RollTable;
export import RollTables = globalThis.RollTables;
export import Ruler = globalThis.Ruler;
export import Scene = globalThis.Scene;
export import SceneManager = globalThis.SceneManager;
export import Scenes = globalThis.Scenes;
export import Setting = globalThis.Setting;

/** @deprecated No longer global as of 13.345, nor exported anywhere accessible */
export import ShaderField = ShaderField;

export import SimplePeer = globalThis.SimplePeer;
export import SirenColorationShader = globalThis.SirenColorationShader;
export import SirenIlluminationShader = globalThis.SirenIlluminationShader;
export import SMAAFilter = globalThis.SMAAFilter;
export import SmokePatchColorationShader = globalThis.SmokePatchColorationShader;
export import SmokePatchIlluminationShader = globalThis.SmokePatchIlluminationShader;
export import SmoothNoise = globalThis.SmoothNoise;
export import SnowShader = globalThis.SnowShader;
export import SoundsLayer = globalThis.SoundsLayer;
export import SpriteMesh = globalThis.SpriteMesh;
export import StarLightColorationShader = globalThis.StarLightColorationShader;
export import String = globalThis.String;
export import SunburstColorationShader = globalThis.SunburstColorationShader;
export import SunburstIlluminationShader = globalThis.SunburstIlluminationShader;
export import SwirlingRainbowColorationShader = globalThis.SwirlingRainbowColorationShader;
export import TableResult = globalThis.TableResult;
export import TemplateLayer = globalThis.TemplateLayer;
export import TextureCompressor = globalThis.TextureCompressor;
export import TextureExtractor = globalThis.TextureExtractor;
export import TextureLoader = globalThis.TextureLoader;
export import TextureTransitionFilter = globalThis.TextureTransitionFilter;
export import Tile = globalThis.Tile;
export import TileDocument = globalThis.TileDocument;
export import TilesLayer = globalThis.TilesLayer;
export import Token = globalThis.Token;
export import TokenDocument = globalThis.TokenDocument;
export import TokenLayer = globalThis.TokenLayer;
export import TokenRing = globalThis.TokenRing;
export import TokenRingConfig = globalThis.TokenRingConfig;
export import TokenRingSamplerShader = globalThis.TokenRingSamplerShader;
export import TorchColorationShader = globalThis.TorchColorationShader;
export import TorchIlluminationShader = globalThis.TorchIlluminationShader;
export import UnboundContainer = globalThis.UnboundContainer;
export import UnboundTransform = globalThis.UnboundTransform;
export import User = globalThis.User;
export import UserTargets = globalThis.UserTargets;
export import Users = globalThis.Users;
export import VisibilityFilter = globalThis.VisibilityFilter;
export import VisionMaskFilter = globalThis.VisionMaskFilter;
export import VisionMode = globalThis.VisionMode;
export import VisualEffectsMaskingFilter = globalThis.VisualEffectsMaskingFilter;
export import VoidFilter = globalThis.VoidFilter;
export import VortexColorationShader = globalThis.VortexColorationShader;
export import VortexIlluminationShader = globalThis.VortexIlluminationShader;
export import Wall = globalThis.Wall;
export import WallDocument = globalThis.WallDocument;
export import WallsLayer = globalThis.WallsLayer;
export import WaveBackgroundVisionShader = globalThis.WaveBackgroundVisionShader;
export import WaveColorationShader = globalThis.WaveColorationShader;
export import WaveColorationVisionShader = globalThis.WaveColorationVisionShader;
export import WaveIlluminationShader = globalThis.WaveIlluminationShader;
export import WeatherEffects = globalThis.WeatherEffects;
export import WeatherOcclusionMaskFilter = globalThis.WeatherOcclusionMaskFilter;
export import WeatherShaderEffect = globalThis.WeatherShaderEffect;
export import WeilerAthertonClipper = globalThis.WeilerAthertonClipper;
export import WorldCollection = globalThis.WorldCollection;
export import WorldSettings = globalThis.WorldSettings;
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
