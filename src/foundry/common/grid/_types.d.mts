/* eslint-disable @typescript-eslint/no-unused-vars */

import type BaseGrid from "./base.d.mts";
import type HexagonalGrid from "./hexagonal.d.mts";

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

// TODO: Stubs
export {};

type GridOffset2D = BaseGrid.Offset2D;

type GridOffset3D = BaseGrid.Offset3D;

type HexagonalGridCube2D = HexagonalGrid.Cube2D;

type HexagonalGridCube3D = HexagonalGrid.Cube3D;

type GridCoordinates2D = BaseGrid.Coordinates2D;

type GridCoordinates3D = BaseGrid.Coordinates3D;

type HexagonalGridCoordinates2D = HexagonalGrid.Coordinates2D;

type HexagonalGridCoordinates3D = HexagonalGrid.Coordinates3D;

type GridSnappingBehavior = BaseGrid.SnappingBehavior;

type GridMeasurePathWaypointData2D = unknown;

type GridMeasurePathWaypointData3D = unknown;

type GridMeasurePathResultWaypoint = unknown;

type GridMeasurePathResultSegment = unknown;

type GridMeasurePathResult = unknown;

type GridMeasurePathCostFunction2D = BaseGrid.MeasurePathCostFunction2D;

type GridMeasurePathCostFunction3D = BaseGrid.MeasurePathCostFunction3D;

type GridConfiguration = BaseGrid.Configuration;

type SquareGridConfiguration = unknown;

type HexagonalGridConfiguration = unknown;
