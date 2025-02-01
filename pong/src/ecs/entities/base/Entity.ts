/**
 * Base entity class that can hold components using symbols as keys
 */
export class Entity {
  private components = new Map<symbol, unknown>();

  /**
   * Add a component to this entity
   * @param key Symbol key for the component
   * @param component The component to add
   * @returns This entity for chaining
   */
  addComponent<T>(key: symbol, component: T): this {
    this.components.set(key, component);
    return this;
  }

  /**
   * Get a component by its symbol key
   * @param key Symbol key for the component
   * @returns The component instance or undefined if not found
   */
  getComponent<T>(key: symbol): T | undefined {
    return this.components.get(key) as T;
  }

  /**
   * Check if entity has a component
   * @param key Symbol key for the component
   * @returns True if the component exists
   */
  hasComponent(key: symbol): boolean {
    return this.components.has(key);
  }
}
