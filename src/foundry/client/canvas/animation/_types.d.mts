import type { CanvasAnimation, ChatBubbles, ParticleGenerator } from "./_module.mjs";

/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

export {};

type ParticleGeneratorMode = ParticleGenerator.Mode;

type ParticleGeneratorRange = ParticleGenerator.Range;

type ParticleGeneratorCurvePoint = ParticleGenerator.CurvePoint;

type ParticleGeneratorValueFunction = ParticleGenerator.ValueFunction;

type ParticleGeneratorValueOptions = ParticleGenerator.ValueOptions;

type ParticleGeneratorValue = ParticleGenerator.Value;

type ParticleGeneratorColorCurvePoint = ParticleGenerator.ColorCurvePoint;

type ParticleGeneratorColorFunction = ParticleGenerator.ColorFunction;

type ParticleGeneratorColorValueOptions = ParticleGenerator.ColorValueOptions;

type ParticleGeneratorColorValue = ParticleGenerator.ColorValue;

type ParticleGeneratorPoint = ParticleGenerator.Point;

type ParticleGeneratorRectangle = ParticleGenerator.Rectangle;

type ParticleGeneratorAnchor = ParticleGenerator.Anchor;

type ParticleGeneratorAnchorPoint = ParticleGenerator.AnchorPoint;

type ParticleGeneratorBehaviorId = ParticleGenerator.BehaviorId;

type ParticleGeneratorOrbitOptions = ParticleGenerator.OrbitOptions;

type ParticleGeneratorFollowOptions = ParticleGenerator.FollowOptions;

type ParticleGeneratorBehavior = ParticleGenerator.Behavior;

type ParticleGeneratorAreaSampleMode = ParticleGenerator.AreaSampleMode;

type ParticleGeneratorShapeDataSource = ParticleGenerator.ShapeDataSource;

type ParticleGeneratorPointList = ParticleGenerator.PointList;

type ParticleGeneratorPolylineDefinition = ParticleGenerator.PolylineDefinition;

type ParticleGeneratorArea = ParticleGenerator.Area;

type ParticleGeneratorFadeOptions = ParticleGenerator.FadeOptions;

type ParticleGeneratorRotationOptions = ParticleGenerator.RotationOptions;

type ParticleGeneratorVelocityFunction = ParticleGenerator.VelocityFunction;

type ParticleGeneratorVelocityOptions = ParticleGenerator.VelocityOptions;

type ParticleGeneratorConstraintMode = ParticleGenerator.ConstraintMode;

type ParticleGeneratorDebugTintMode = ParticleGenerator.DebugTintMode;

type ParticleGeneratorDebugTintOptions = ParticleGenerator.DebugTintOptions;

type ParticleGeneratorDebugOptions = ParticleGenerator.DebugOptions;

type ParticleGeneratorDebugStats = ParticleGenerator.DebugStats;

type ParticleGeneratorClipOptions = ParticleGenerator.ClipOptions;

type ParticleGeneratorPositionTest = ParticleGenerator.PositionTest;

type ParticleGeneratorParticleCallback = ParticleGenerator.ParticleCallback;

type ParticleGeneratorDeathCallback = ParticleGenerator.DeathCallback;

type ParticleGeneratorTickCallback = ParticleGenerator.TickCallback;

type ParticleGeneratorConfiguration = ParticleGenerator.Configuration;

type ParticleMesh = ParticleGenerator.ParticleMesh;

type CanvasAnimationAttribute = CanvasAnimation.ProcessedAttribute;

type CanvasAnimationEasingFunction = CanvasAnimation.EasingFunction;

type CanvasAnimationOptions = CanvasAnimation.AnimateOptions;

type CanvasAnimationData = CanvasAnimation.AnimationData;

type ChatBubbleOptions = ChatBubbles.Options;
