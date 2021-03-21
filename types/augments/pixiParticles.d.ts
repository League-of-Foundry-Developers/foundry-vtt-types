import * as pixiParticles from 'pixi-particles';

declare global {
  namespace PIXI {
    namespace particles {
      type BasicPoint = pixiParticles.BasicPoint;

      type Segment = pixiParticles.Segment;

      type PolygonalChain = pixiParticles.PolygonalChain;
      const PolygonalChain: typeof pixiParticles.PolygonalChain;

      type EmitterConfig = pixiParticles.EmitterConfig;

      type RandNumber = pixiParticles.RandNumber;

      type BasicTweenable<T> = pixiParticles.BasicTweenable<T>;

      type OldEmitterConfig = pixiParticles.OldEmitterConfig;

      type ValueStep<T> = pixiParticles.ValueStep<T>;

      type ValueList<T> = pixiParticles.ValueList<T>;

      type PropertyNode<V> = pixiParticles.PropertyNode<V>;
      const PropertyNode: typeof pixiParticles.PropertyNode;

      const GetTextureFromString: typeof pixiParticles.GetTextureFromString;

      type Color = pixiParticles.Color;

      type EaseSegment = pixiParticles.EaseSegment;

      type SimpleEase = pixiParticles.SimpleEase;

      const ParticleUtils: typeof pixiParticles.ParticleUtils;

      type ParticleConstructor = pixiParticles.ParticleConstructor;

      type Emitter = pixiParticles.Emitter;
      const Emitter: typeof pixiParticles.Emitter;

      type PropertyList<V> = pixiParticles.PropertyList<V>;
      const PropertyList: typeof pixiParticles.PropertyList;

      type LinkedListChild = pixiParticles.LinkedListChild;

      type LinkedListContainer = pixiParticles.LinkedListContainer;
      const LinkedListContainer: typeof pixiParticles.LinkedListContainer;

      type Particle = pixiParticles.Particle;
      const Particle: typeof pixiParticles.Particle;

      type PathParticle = pixiParticles.PathParticle;
      const PathParticle: typeof pixiParticles.PathParticle;

      type ParsedAnimatedParticleArt = pixiParticles.ParsedAnimatedParticleArt;

      type AnimatedParticleArt = pixiParticles.AnimatedParticleArt;

      type AnimatedParticle = pixiParticles.AnimatedParticle;
      const AnimatedParticle: typeof pixiParticles.AnimatedParticle;
    }
  }
}
