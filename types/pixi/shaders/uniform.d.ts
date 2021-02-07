declare namespace Uniform {
  interface Bool {
    type: 'b' | 'bool' | 'boolean';
    value: boolean;
  }

  interface Int1 {
    type: 'i' | '1i';
    value: number;
  }

  interface Float1 {
    type: 'f' | '1f';
    value: number;
  }

  interface Float2 {
    type: '2f';
    value: [number, number] | Float32Array;
  }

  interface Float3 {
    type: '3f';
    value: [number, number, number] | Float32Array;
  }

  interface Float4 {
    type: '3f';
    value: [number, number, number, number] | Float32Array;
  }

  interface Point2D {
    type: 'v2';
    value: { x: number; y: number };
  }

  interface Point3D {
    type: 'v3';
    value: { x: number; y: number; z: number };
  }

  interface Point4D {
    type: 'v4';
    value: { x: number; y: number; z: number; w: number };
  }

  interface Int1Vec {
    type: '1iv';
    value: Int32List;
  }

  interface Int2Vec {
    type: '2iv';
    value: Int32List;
  }

  interface Int3Vec {
    type: '3iv';
    value: Int32List;
  }

  interface Int4Vec {
    type: '4iv';
    value: Int32List;
  }

  interface Float1Vec {
    type: '1fv';
    value: Float32List;
  }

  interface Float2Vec {
    type: '2fv';
    value: Float32List;
  }

  interface Float3Vec {
    type: '3fv';
    value: Float32List;
  }

  interface Float4Vec {
    type: '4fv';
    value: Float32List;
  }

  interface Matrix2 {
    type: 'm2' | 'mat2' | 'Matrix2fv';
    value: Float32List;
  }

  interface Matrix3 {
    type: 'm3' | 'mat3' | 'Matrix3fv';
    value: Float32List;
  }

  interface Matrix4 {
    type: 'm4' | 'mat4' | 'Matrix4fv';
    value: Float32List;
  }

  interface Color {
    type: 'c';
    value: number | [number, number, number];
  }

  interface Int1FlatVec {
    type: 'iv1';
    value: Int32List;
  }

  interface Int3FlatVec {
    type: 'iv';
    value: Int32List;
  }

  interface Float1FlatVec {
    type: 'fv1';
    value: Float32List;
  }

  interface Float3FlatVec {
    type: 'fv';
    value: Float32List;
  }

  interface Point2DVec {
    type: 'v2v';
    value: { x: number; y: number }[];
  }

  interface Point3DVec {
    type: 'v3v';
    value: { x: number; y: number; z: number }[];
  }

  interface Point4DVec {
    type: 'v4v';
    value: { x: number; y: number; z: number; w: number }[];
  }

  interface Texture {
    type: 't' | 'sampler2D';
    value: PIXI.Texture;
  }
}

type Uniform =
  | Uniform.Bool
  | Uniform.Int1
  | Uniform.Float1
  | Uniform.Float2
  | Uniform.Float3
  | Uniform.Float4
  | Uniform.Point2D
  | Uniform.Point3D
  | Uniform.Point4D
  | Uniform.Int1Vec
  | Uniform.Int2Vec
  | Uniform.Int3Vec
  | Uniform.Int4Vec
  | Uniform.Float1Vec
  | Uniform.Float2Vec
  | Uniform.Float3Vec
  | Uniform.Float4Vec
  | Uniform.Matrix2
  | Uniform.Matrix3
  | Uniform.Matrix4
  | Uniform.Color
  | Uniform.Int1FlatVec
  | Uniform.Int3FlatVec
  | Uniform.Float1FlatVec
  | Uniform.Float3FlatVec
  | Uniform.Point2DVec
  | Uniform.Point3DVec
  | Uniform.Point4DVec
  | Uniform.Texture;
