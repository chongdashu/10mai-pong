/**
 * Component for tracking paddle hits and score
 */
export class PaddleScore {
  public hits: number = 0;
  public bestHits: number = 0;

  /**
   * Increment hit counter and update best score
   */
  addHit(): void {
    this.hits++;
    if (this.hits > this.bestHits) {
      this.bestHits = this.hits;
    }
  }

  /**
   * Reset current hit counter (best score remains)
   */
  reset(): void {
    this.hits = 0;
  }
}
