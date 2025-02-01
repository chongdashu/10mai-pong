/**
 * Game-wide constants
 */
export const TILE_SIZE = 32;

/**
 * Level map symbols
 */
export enum MapSymbol {
  EMPTY = ' ',
  WALL = '#',
  PLAYER = 'P',
}

/**
 * Level maps defined in an easy to read format
 */
export const LEVEL_MAPS = {
  LEVEL_1: `
###########
#P        #
#         #
#         #
#         #
#         #
#         #
#         #
###########
`.trim(),
} as const;

/**
 * Represents a tile type in the level
 */
export enum TileType {
  EMPTY = 0,
  WALL = 1,
}

/**
 * Represents movement directions in the game
 */
export enum Direction {
  NONE,
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

/**
 * Factory class for creating levels
 */
export class LevelFactory {
  /**
   * Create a new level from a map string
   */
  static create(levelMap: string = LEVEL_MAPS.LEVEL_1): Level {
    return new Level(this.parseMap(levelMap));
  }

  /**
   * Find player start position in map
   */
  static findPlayerStart(mapString: string): { x: number; y: number } {
    const lines = mapString.split('\n');
    for (let y = 0; y < lines.length; y++) {
      const x = lines[y].indexOf(MapSymbol.PLAYER);
      if (x !== -1) {
        return { x, y };
      }
    }
    return { x: 1, y: 1 }; // Default if not found
  }

  /**
   * Convert string map to 2D array
   */
  private static parseMap(mapString: string): TileType[][] {
    const lines = mapString.split('\n');
    return lines.map(line =>
      line.split('').map(char => {
        switch (char) {
          case MapSymbol.WALL:
            return TileType.WALL;
          case MapSymbol.PLAYER:
          case MapSymbol.EMPTY:
          default:
            return TileType.EMPTY;
        }
      })
    );
  }
}

/**
 * Represents a grid-based level
 */
export class Level {
  private tileSize: number = TILE_SIZE;

  constructor(private grid: TileType[][]) {
    this.createBoundaryWalls();
  }

  /**
   * Create walls around the level boundary
   */
  private createBoundaryWalls(): void {
    const height = this.grid.length;
    const width = this.grid[0].length;

    // Top and bottom walls
    for (let x = 0; x < width; x++) {
      this.grid[0][x] = TileType.WALL;
      this.grid[height - 1][x] = TileType.WALL;
    }

    // Left and right walls
    for (let y = 0; y < height; y++) {
      this.grid[y][0] = TileType.WALL;
      this.grid[y][width - 1] = TileType.WALL;
    }
  }

  /**
   * Get the tile type at a specific grid position
   */
  getTileAt(x: number, y: number): TileType {
    if (x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length) {
      return TileType.WALL; // Out of bounds is considered a wall
    }
    return this.grid[y][x];
  }

  /**
   * Convert grid coordinates to world position
   */
  gridToWorld(gridX: number, gridY: number): { x: number; y: number } {
    return {
      x: gridX * this.tileSize + this.tileSize / 2,
      y: gridY * this.tileSize + this.tileSize / 2,
    };
  }

  /**
   * Convert world position to grid coordinates
   */
  worldToGrid(x: number, y: number): { gridX: number; gridY: number } {
    return {
      gridX: Math.floor(x / this.tileSize),
      gridY: Math.floor(y / this.tileSize),
    };
  }

  /**
   * Get the tile size
   */
  getTileSize(): number {
    return this.tileSize;
  }

  /**
   * Get grid dimensions
   */
  getDimensions(): { width: number; height: number } {
    return {
      width: this.grid[0].length,
      height: this.grid.length,
    };
  }
}
