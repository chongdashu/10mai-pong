/**
 * Component that tracks an entity's position in LEVEL-RELATED WORLD COORDINATES
 * (before any screen centering offsets are applied)
 */
export class Transform {
  constructor(
    public x: number, // World X in level space (grid-aligned)
    public y: number, // World Y in level space (grid-aligned)
    public gridX: number, // Grid X index
    public gridY: number // Grid Y index
  ) {}
}
