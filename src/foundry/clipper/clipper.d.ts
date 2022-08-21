declare namespace ClipperLib {
  let version: "6.4.2.2";

  /**
   * Enables open path clipping. Adds a very minor cost to performance.
   * @defaultValue `true`
   */
  let use_lines: boolean;

  /**
   * Adds a Z member to IntPoint. Adds a minor cost to performance.
   * @defaultValue `false`
   */
  let use_xyz: boolean;

  /** @defaultValue `null` */
  let biginteger_used: 1 | null;

  type Path = IntPoint[];
  let Path: new () => Path;

  type Paths = Path[];
  let Paths: new () => Paths;

  class DoublePoint {
    constructor(dp: DoublePoint);
    constructor(ip: IntPoint);
    X: number;
    Y: number;
  }

  class DoublePoint0 extends DoublePoint {
    constructor();
  }

  class DoublePoint1 extends DoublePoint {
    constructor(dp: DoublePoint);
  }

  class DoublePoint2 extends DoublePoint {
    constructor(x: number, y: number);
  }

  class PolyNode {
    /** @defaultValue `null` */
    protected m_Parent: PolyNode | null;

    protected m_polygon: Path;

    /** @defaultValue `0` */
    protected m_Index: number;

    /** @defaultValue `0` */
    protected m_jointype: JoinType;

    /** @defaultValue `0` */
    protected m_endtype: EndType;

    /** @defaultValue `[]` */
    protected m_Childs: PolyNode[];

    /** @defaultValue `false` */
    isOpen: boolean;

    IsHoleNode(): boolean;

    ChildCount(): number;

    Contour(): Path;

    AddChild(Child: PolyNode): void;

    GetNext(): PolyNode | null;

    Childs(): PolyNode[];

    Parent(): PolyNode | null;

    IsHole(): boolean;
  }

  class PolyTree extends PolyNode {
    m_AllPolys: PolyNode[];

    Clear(): void;

    GetFirst(): PolyNode | null;

    Total(): number;
  }

  function Math_Abs_Int64(a: number): number;

  function Math_Abs_Int32(a: number): number;

  function Math_Abs_Double(a: number): number;

  function Math_Max_Int32_Int32(a: number, b: number): number;

  function Cast_Int32(a: number): number;

  function Cast_Int64(a: number): number;

  function Clear(a: Array<unknown>): void;

  let PI: number;
  let PI2: number;

  class IntPoint {
    constructor(x: number, y: number, z: number);
    constructor(x: number, y: number);
    constructor(dp: DoublePoint);
    constructor();

    X: number;
    Y: number;
    Z?: number | undefined;

    static op_Equality(a: IntPoint, b: IntPoint): boolean;

    static op_Inequality(a: IntPoint, b: IntPoint): boolean;
  }

  class IntPoint0 extends IntPoint {
    constructor();
  }

  class IntPoint1 extends IntPoint {
    constructor(pt: IntPoint);
  }

  class IntPoint1dp extends IntPoint {
    constructor(pt: DoublePoint);
  }

  class IntPoint2 extends IntPoint {
    constructor(x: number, y: number, z?: number | undefined);
  }

  class IntRect {
    constructor(l: number, t: number, r: number, b: number);
    constructor(ir: IntRect);
    constructor();

    left: number;
    top: number;
    right: number;
    bottom: number;
  }

  class IntRect0 extends IntRect {
    constructor();
  }

  class IntRect1 extends IntRect {
    constructor(ir: IntRect);
  }

  class IntRect4 extends IntRect {
    constructor(l: number, t: number, r: number, b: number);
  }

  const ClipType: {
    ctIntersection: 0;
    ctUnion: 1;
    ctDifference: 2;
    ctXor: 3;
  };
  type ClipType = ValueOf<typeof ClipType>;

  const PolyType: {
    ptSubject: 0;
    ptClip: 1;
  };
  type PolyType = ValueOf<typeof PolyType>;

  const PolyFillType: {
    pftEvenOdd: 0;
    pftNonZero: 1;
    pftPositive: 2;
    pftNegative: 3;
  };
  type PolyFillType = ValueOf<typeof PolyFillType>;

  const JoinType: {
    jtSquare: 0;
    jtRound: 1;
    jtMiter: 2;
  };
  type JoinType = ValueOf<typeof JoinType>;

  const EndType: {
    etOpenSquare: 0;
    etOpenRound: 1;
    etOpenButt: 2;
    etClosedLine: 3;
    etClosedPolygon: 4;
  };
  type EndType = ValueOf<typeof EndType>;

  const EdgeSide: {
    esLeft: 0;
    esRight: 1;
  };
  type EdgeSide = ValueOf<typeof EdgeSide>;

  const Direction: {
    dRightToLeft: 0;
    dLeftToRight: 1;
  };
  type Direction = ValueOf<typeof Direction>;

  class TEdge {
    Bot: IntPoint;
    /** current (updated for every new scanbeam) */
    Curr: IntPoint;
    Top: IntPoint;
    Delta: IntPoint;

    /**  @defaultValue `0` */
    Dx: number;

    /** @defaultValue `PolyType.ptSubject` */
    PolyTyp: PolyType;

    /**
     * side only refers to current side of solution poly
     * @defaultValue `ClipperLib.EdgeSide.esLeft`
     */
    Side: EdgeSide;

    /**
     * 1 or -1 depending on winding direction
     * @defaultValue `0`
     */
    WindDelta: 0 | 1 | -1;

    /** @defaultValue `0` */
    WindCnt: number;

    /**
     * winding count of the opposite polytype
     * @defaultValue `0`
     */
    WindCnt2: number;

    /** @defaultValue `0` */
    OutIdx: number;

    /** @defaultValue `null` */
    Next: TEdge | null;

    /** @defaultValue `null` */
    Prev: TEdge | null;

    /** @defaultValue `null` */
    NextInLML: TEdge | null;

    /** @defaultValue `null` */
    NextInAEL: TEdge | null;

    /** @defaultValue `null` */
    PrevInAEL: TEdge | null;

    /** @defaultValue `null` */
    NextInSEL: TEdge | null;

    /** @defaultValue `null` */
    PrevInSEL: TEdge | null;
  }

  class IntersectNode {
    /** @defaultValue `null` */
    Edge1: TEdge | null;

    /** @defaultValue `null` */
    Edge2: TEdge | null;

    Pt: IntPoint;
  }

  class MyIntersectNodeSort {
    static Compare(node1: IntersectNode, node2: IntersectNode): 0 | 1 | -1;
  }

  class LocalMinima {
    /** @defaultValue `0` */
    Y: number;

    /** @defaultValue `null` */
    LeftBound: TEdge | null;

    /** @defaultValue `null` */
    RightBound: TEdge | null;

    /** @defaultValue `null` */
    Next: LocalMinima | null;
  }

  class Scanbeam {
    /** @defaultValue `0` */
    Y: number;

    /** @defaultValue `null` */
    Next: Scanbeam | null;
  }

  class Maxima {
    /** @defaultValue `0` */
    X: number;

    /** @defaultValue `null` */
    Next: Maxima | null;

    /** @defaultValue `null` */
    Pref: Maxima | null;
  }

  /**
   * contains a path in the clipping solution. Edges in the AEL will
   * carry a pointer to an OutRec when they are part of the clipping solution.
   */
  class OutRec {
    /** @defaultValue `0` */
    Idx: number;

    /** @defaultValue `false` */
    IsHole: boolean;

    /** @defaultValue `false` */
    IsOpen: boolean;

    /** @defaultValue `null` */
    FirstLeft: OutRec | null;

    /** @defaultValue `null` */
    Pts: OutPt | null;

    /** @defaultValue `null` */
    BottomPt: OutPt | null;

    /** @defaultValue `null` */
    PolyNode: PolyNode | null;
  }

  class OutPt {
    /** @defaultValue `0` */
    Idx: number;

    Pt: IntPoint;

    /** @defaultValue `null` */
    Next: OutPt | null;

    /** @defaultValue `null` */
    Prev: OutPt | null;
  }

  class Join {
    /** @defaultValue `null` */
    OutPt1: OutPt | null;

    /** @defaultValue `null` */
    OutPt2: OutPt | null;

    OffPt: IntPoint;
  }

  class ClipperBase {
    /** @defaultValue `null` */
    protected m_MinimaList: LocalMinima | null;

    /** @defaultValue `null` */
    protected m_CurrentLM: LocalMinima | null;

    protected m_edges: TEdge[];

    /** @defaultValue `false` */
    protected m_UseFullRange: boolean;

    /** @defaultValue `false` */
    protected m_HasOpenPaths: boolean;

    /** @defaultValue `false` */
    PreserveCollinear: boolean;

    /** @defaultValue `null` */
    protected m_Scanbeam: Scanbeam | null;

    /** @defaultValue `null` */
    protected m_PolyOuts: unknown | null;

    /** @defaultValue `null` */
    protected m_ActiveEdges: unknown | null;

    /**
     * -2^53
     * @defaultValue `-9007199254740992`
     */
    static horizontal: number;

    /** @defaultValue `-2` */
    static Skip: number;

    /** @defaultValue `-1` */
    static Unassigned: number;

    /** @defaultValue `1E-20` */
    static tolerance: number;

    /**
     * sqrt(2^53 -1)/2
     * @defaultValue `47453132`
     */
    static loRange: number;

    /**
     * sqrt(2^106 -1)/2
     * @defaultValue `4503599627370495`
     */
    static hiRange: number;

    static near_zero(val: number): boolean;

    static IsHorizontal(e: TEdge): boolean;

    PointIsVertex(pt: IntPoint, pp: OutPt): boolean;

    PointOnLineSegment(pt: IntPoint, linePt1: IntPoint, linePt2: IntPoint, UseFullRange: boolean): boolean;

    PointOnPolygon(pt: IntPoint, pp: OutPt, UseFullRange: boolean): boolean;

    static SlopesEqual(e1: TEdge, e2: TEdge, UseFullRange: boolean): boolean;
    static SlopesEqual(pt1: IntPoint, pt2: IntPoint, pt3: IntPoint, UseFullRange: boolean): boolean;
    static SlopesEqual(pt1: IntPoint, pt2: IntPoint, pt3: IntPoint, pt4: IntPoint, UseFullRange: boolean): boolean;
    SlopesEqual: typeof ClipperBase.SlopesEqual;

    static SlopesEqual3(e1: TEdge, e2: TEdge, UseFullRange: boolean): boolean;

    static SlopesEqual4(pt1: IntPoint, pt2: IntPoint, pt3: IntPoint, UseFullRange: boolean): boolean;

    static SlopesEqual5(pt1: IntPoint, pt2: IntPoint, pt3: IntPoint, pt4: IntPoint, UseFullRange: boolean): boolean;

    Clear(): void;

    DisposeLocalMinimaList(): void;

    RangeTest(Pt: IntPoint, useFullRange: { Value: boolean }): void;

    InitEdge(e: TEdge, eNext: TEdge | null, ePrev: TEdge | null, pt: IntPoint): void;

    InitEdge2(e: TEdge, polyType: PolyType): void;

    FindNextLocMin(E: TEdge): TEdge | null;

    ProcessBound(E: TEdge, LeftBoundIsForward: boolean): TEdge;

    AddPath(pg: Path, polyType: PolyType, CLoses: boolean): boolean;

    AddPaths(ppg: Paths, polyType: PolyType, CLoses: boolean): boolean;

    Pt2IsBetweenPt1AndPt3(pt1: IntPoint, pt2: IntPoint, pt3: IntPoint): boolean;

    RemoveEdge(e: TEdge): TEdge | null;

    SetDx(e: TEdge): void;

    InsertLocalMinima(newLm: LocalMinima): void;

    PopLocalMinima(Y: number, current: { v?: LocalMinima | null }): boolean;

    ReverseHorizontal(e: TEdge): void;

    Reset(): void;

    InsertScanbeam(Y: number): void;

    PopScanbeam(Y: { v?: number }): boolean;

    LocalMinimaPending(): boolean;

    CreateOutRec(): OutRec;

    DisposeOutRec(index: number): void;

    UpdateEdgeIntoAEL(e: TEdge): void;

    SwapPositionsInAEL(edge1: TEdge, edge2: TEdge): void;

    DeleteFromAEL(e: TEdge): void;
  }

  class Clipper extends ClipperBase {
    constructor(InitOptions?: number);

    /** @defaultValue `[]` */
    protected m_PolyOuts: OutRec[];

    /** @defaultValue `ClipperLib.ClipType.ctIntersection` */
    protected m_ClipType: ClipType;

    /** @defaultValue `null` */
    protected m_Scanbeam: Scanbeam | null;

    /** @defaultValue `null` */
    protected m_Maxima: Maxima | null;

    /** @defaultValue `null` */
    protected m_ActiveEdges: TEdge | null;

    /** @defaultValue `null` */
    protected m_SortedEdges: TEdge | null;

    /** @defaultValue `[]` */
    protected m_IntersectList: IntersectNode[];

    /** @defaultValue `ClipperLib.MyIntersectNodeSort.Compare` */
    protected m_IntersectNodeComparer: (node1: IntersectNode, node2: IntersectNode) => 0 | 1 | -1;

    /** @defaultValue `false` */
    protected m_ExecuteLocked: boolean;

    /** @defaultValue `ClipperLib.PolyFillType.pftEvenOdd` */
    protected m_ClipFillType: PolyFillType;

    /** @defaultValue `ClipperLib.PolyFillType.pftEvenOdd` */
    protected m_SubjFillType: PolyFillType;

    /** @defaultValue `[]` */
    protected m_Joins: Join[];

    /** @defaultValue `[]` */
    protected m_GhostJoins: Join[];

    /** @defaultValue `false` */
    protected m_UsingPolyTree: boolean;

    /** @defaultValue `false` */
    ReverseSolution: boolean;

    /** @defaultValue `false` */
    StrictlySimple: boolean;

    /** @defaultValue `false` */
    PreserveCollinear: boolean;

    ZFillFunction?: ((e1bot: IntPoint, e1top: IntPoint, e2bot: IntPoint, e2top: IntPoint, pt: IntPoint) => void) | null;

    static ioReverseSolution: 1;
    static ioStrictlySimple: 2;
    static ioPreserveCollinear: 4;

    Clear(): void;

    InsertMaxima(X: number): void;

    Execute(clipType: ClipType, solution: Paths, subjFillType: PolyFillType, clipFillType: PolyFillType): boolean;
    Execute(clipType: ClipType, polytree: PolyTree, subjFillType: PolyFillType, clipFillType: PolyFillType): boolean;
    Execute(clipType: ClipType, solution: Paths): boolean;
    Execute(clipType: ClipType, polytree: PolyTree): boolean;

    FixHoleLinkage(outRec: OutRec): void;

    ExecuteInternal(): boolean;

    DisposeAllPolyPts(): void;

    AddJoin(Op1: OutPt, Op2: OutPt, OffPt: IntPoint): void;

    AddGhostJoin(Op: OutPt, Offpt: IntPoint): void;

    SetZ(pt: IntPoint, e1: TEdge, e2: TEdge): void;

    InsertLocalMinimaIntoAEL(botY: number): void;

    InsertEdgeIntoAEL(edge: TEdge, startEdge: TEdge): void;

    E2InsertsBeforeE1(e1: TEdge, e2: TEdge): boolean;

    IsEvenOddFillType(edge: TEdge): boolean;

    IsEvenOddAltFillType(edge: TEdge): boolean;

    IsContributing(edge: TEdge): boolean;

    SetWindingCount(edge: TEdge): void;

    AddEdgeToSEL(edge: TEdge): void;

    PopEdgeFromSEL(e: { v?: TEdge | null }): boolean;

    CopyAELToSEL(): void;

    SwapPositionsInSEL(edge1: TEdge, edge2: TEdge): void;

    AddLocalMaxPoly(e1: TEdge, e2: TEdge, pt: IntPoint): void;

    AddLocalMinPoly(e1: TEdge, e2: TEdge, pt: IntPoint): OutPt;

    AddOutPt(e: TEdge, pt: OutPt): OutPt;

    GetLastOutPt(e: TEdge): OutPt;

    SwapPoints(pt1: IntPoint, pt2: IntPoint): void;

    HorzSegmentsOverlap(seg1a: number, seg1b: number, seg2a: number, seg2b: number): number;

    SetHoleState(e: TEdge, outRec: OutRec): void;

    GetDx(pt1: IntPoint, pt2: IntPoint): number;

    FirstIsBottomPt(btmPt1: OutPt, btmPt2: OutPt): boolean;

    GetBottomPt(pp: OutPt): OutPt;

    GetLowermostRec(outRec1: OutRec, outRec2: OutRec): OutRec;

    OutRec1RightOfOutRec2(outRec1: OutRec, outRec2: OutRec): boolean;

    GetOutRec(idx: number): OutRec | undefined;

    AppendPolygon(e1: TEdge, e2: TEdge): void;

    ReversePolyPtLinks(pp: OutPt): void;

    static SwapSides(edge1: TEdge, edge2: TEdge): void;

    static SwapPolyIndexes(edge1: TEdge, edge2: TEdge): void;

    IntersectEdges(e1: TEdge, e2: TEdge, pt: IntPoint): void;

    DeleteFromSEL(e: TEdge): void;

    ProcessHorizontals(): void;

    GetHorzDirection(
      HorzEdge: TEdge,
      $val: { Left?: number | undefined; Right?: number | undefined; Dir?: Direction }
    ): void;

    ProcessHorizontal(horzEdge: TEdge): void;

    GetNextInAEL(e: TEdge, Direction: Direction): TEdge | null;

    IsMinima(e: TEdge | null): boolean;

    IsMaxima(e: TEdge | null, Y: number): boolean;

    IsIntermediate(e: TEdge, Y: number): boolean;

    GetMaximaPair(e: TEdge): TEdge | null;

    GetMaximaPairEx(e: TEdge): TEdge | null;

    ProcessIntersections(topY: number): boolean;

    BuildIntersectList(topY: number): void;

    EdgesAdjacent(inode: IntersectNode): boolean;

    static IntersectNodeSort(node1: IntersectNode, node2: IntersectNode): number;

    FixupIntersectionOrder(): boolean;

    ProcessIntersectList(): void;

    static Round(a: number): number;

    static TopX(edge: TEdge, currentY: number): number;

    IntersectPoint(edge1: TEdge, edge2: TEdge, ip: IntPoint): void;

    ProcessEdgesAtTopOfScanbeam(topY: number): void;

    DoMaxima(e: TEdge): void;

    static ReversePaths(polys: Paths): void;

    static Orientation(poly: Path): boolean;

    PointCount(pts: OutPt | null): number;

    BuildResult(polyg: Paths): void;

    BuildResult2(polytree: PolyTree): void;

    FixupOutPolyline(outRec: OutRec): void;

    FixupOutPolygon(outRec: OutRec): void;

    DupOutPt(outPt: OutPt, InsertAfter: boolean): OutPt;

    GetOverlap(
      a1: IntPoint,
      a2: IntPoint,
      b1: IntPoint,
      b2: IntPoint,
      $val: { Left?: number | undefined; Right?: number | undefined }
    ): boolean;

    JoinHorz(op1: OutPt, op1b: OutPt, op2: OutPt, op2b: OutPt, pt: IntPoint, DiscardLeft: boolean): boolean;

    JoinPoints(j: Join, outRec1: OutRec, outRec2: OutRec): boolean;

    static GetBounds(paths: Paths): IntRect;

    GetBounds2(ops: OutPt): IntRect;

    /**
     * @returns 0 if false, +1 if true, -1 if pt ON polygon boundary
     */
    static PointInPolygon(pt: IntPoint, path: Path): 0 | 1 | -1;

    /**
     * @returns 0 if false, +1 if true, -1 if pt ON polygon boundary
     */
    PointInPolygon(pt: IntPoint, op: OutPt): 0 | 1 | -1;

    Poly2ContainsPoly1(outPt1: OutPt, outPt2: OutPt): boolean;

    FixupFirstLefts1(OldOutRec: OutRec, NewOutRec: OutRec): void;

    FixupFirstLefts2(innerOutRec: OutRec, outerOutRec: OutRec): void;

    FixupFirstLefts3(OldOutRec: OutRec, NewOutRec: OutRec): void;

    static ParseFirstLeft(FirstLeft: OutRec | null): OutRec | null;

    JoinCommonEdges(): void;

    UpdateOutPtIdxs(outrec: OutRec): void;

    DoSimplePolygons(): void;

    static Area(poly: Path): number;

    Area(op: OutPt | null): number;

    Area$1(outRec: OutRec): number;

    static SimplifyPolygon(poly: Path, fillType: PolyFillType): void;

    static SimplifyPolygons(polys: Paths, fillType: PolyFillType): void;

    static DistanceSqrd(pt1: IntPoint, pt2: IntPoint): number;

    static DistanceFromLineSqrd(pt: IntPoint, ln1: IntPoint, ln2: IntPoint): number;

    static SlopesNearCollinear(pt1: IntPoint, pt2: IntPoint, pt3: IntPoint, distSqrd: number): boolean;

    static PointsAreClose(pt1: IntPoint, pt2: IntPoint, distSqrd: number): boolean;

    static ExcludeOp(op: OutPt): OutPt;

    static CleanPolygon(path: Path, distance?: number): Path;

    static CleanPolygons(polys: Paths, distance?: number): Paths;

    static Minkowski(pattern: Path, path: Path, IsSum: boolean, IsClosed: boolean): Paths;

    static MinkowskiSum(pattern: Path, path_or_paths: Path | Paths, pathIsClosed: boolean): Paths;

    static TranslatePath(path: Path, delta: IntPoint): Path;

    static MinkowskiDiff(poly1: Path, poly2: Path): Paths;

    static PolyTreeToPaths(polytree: PolyTree): Paths;

    static AddPolyNodeToPaths(polynode: PolyNode, nt: Clipper.NodeType, paths: Paths): void;

    static OpenPathsFromPolyTree(polytree: PolyTree): Paths;

    ClosedPathsFromPolyTree(polytree: PolyTree): Paths;

    static NodeType: {
      ntAny: 0;
      ntOpen: 1;
      ntClosed: 2;
    };
  }

  namespace Clipper {
    type NodeType = ValueOf<typeof Clipper.NodeType>;
  }

  class ClipperOffset {
    constructor(miterLimit?: number, arcTolerance?: number);

    protected m_destPolys: Paths;

    protected m_srcPoly: Path;

    protected m_destPoly: Path;

    protected m_normals: DoublePoint[];

    /** @defaultValue `0` */
    protected m_delta: number;

    /** @defaultValue `0` */
    protected m_sinA: number;

    /** @defaultValue `0` */
    protected m_sin: number;

    /** @defaultValue `0` */
    protected m_cos: number;

    /** @defaultValue `0` */
    protected m_miterLim: number;

    /** @defaultValue `0` */
    protected m_StepsPerRad: number;

    protected m_lowest: IntPoint;

    protected m_polyNodes: PolyNode;

    /** @defaultValue `2` */
    MiterLimit: number;

    /** @defaultValue `ClipperLib.ClipperOffset.def_arc_tolerance` */
    ArcTolerance: number;

    /** @defaultValue `6.28318530717959` */
    static two_pi: number;

    /** @defaultValue `0.25` */
    static def_arc_tolerance: number;

    Clear(): void;

    static Round: typeof Clipper.Round;

    AddPath(path: Path, joinType: JoinType, endType: EndType): void;

    AddPaths(paths: Paths, joinType: JoinType, endType: EndType): void;

    FixOrientations(): void;

    static GetUnitNormal(pt1: IntPoint, pt2: IntPoint): DoublePoint;

    DoOffset(delta: number): void;

    Execute(solution: Paths, delta: number): void;
    Execute(solution: PolyTree, delta: number): void;

    OffsetPoint(j: number, k: number, jointype: JoinType): void;

    DoSquare(j: number, k: number): void;

    DoMiter(j: number, k: number, r: number): void;

    DoRound(j: number, k: number): void;
  }

  function Error(message: string): void;

  let JS: JS;
  interface JS {
    AreaOfPolygon(poly: Path, scale?: number | undefined): number;

    AreaOfPolygons(poly: Paths, scale?: number | undefined): number;

    BoundsOfPath(path: Path, scale?: number | undefined): IntRect;

    BoundsOfPaths(paths: Paths, scale?: number | undefined): IntRect;

    /**
     * Clean() joins vertices that are too near each other
     * and causes distortion to offsetted polygons without cleaning
     */
    Clean(polygon: Path, delta: number): Path;
    Clean(polygons: Paths, delta: number): Paths;

    /**
     * Make deep copy of Polygons or Polygon
     * so that also IntPoint objects are cloned and not only referenced
     * This should be the fastest way
     */
    Clone(polygon: Path): Path;
    Clone(polygons: Paths): Paths;

    /**
     * Removes points that doesn't affect much to the visual appearance.
     * If middle point is at or under certain distance (tolerance) of the line segment between
     * start and end point, the middle point is removed.
     */
    Lighten(polygon: Path, tolerance: number): Path;
    Lighten(polygons: Paths, tolerance: number): Paths;

    PerimeterOfPath(path: Path | undefined, closed: boolean, scale: number): number;

    PerimeterOfPaths(paths: Paths, closed: boolean, scale?: number | undefined): number;

    ScaleDownPath(path: Path, scale?: number | undefined): void;

    ScaleDownPaths(paths: Paths, scale?: number | undefined): void;

    ScaleUpPath(path: Path, scale?: number | undefined): void;

    ScaleUpPaths(paths: Paths, scale?: number | undefined): void;

    AddOuterPolyNodeToExPolygons(polynode: PolyNode, expolygons: ExPolygons): void;

    ExPolygonsToPaths(expolygons: ExPolygons): Paths;

    PolyTreeToExPolygons(polytree: PolyTree): ExPolygons;
  }

  type ExPolygons = ExPolygon[];
  let ExPolygons: new () => ExPolygons;

  class ExPolygon {
    /** @defaultValue `null` */
    outer: Path | null;

    /** @defaultValue `null` */
    holes: Paths | null;
  }
}
