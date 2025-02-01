/**
 * Component for tracking player score
 */
export class Score {
  constructor(
    public score: number = 0,
    public bestScore: number = 0,
    public visitedGrids: Set<string> = new Set()
  ) {}

  /**
   * Adds a grid position to visited grids and updates score
   */
  addVisitedGrid(x: number, y: number): void {
    const key = `${x},${y}`;
    if (!this.visitedGrids.has(key)) {
      this.visitedGrids.add(key);
      this.score += 10; // 10 points per new grid
      this.bestScore = Math.max(this.score, this.bestScore);
    }
  }
}
