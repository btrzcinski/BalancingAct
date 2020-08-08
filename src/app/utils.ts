/**
 * Computes the sum of a property from each object in an array.
 * @param arr  The array containing the objects to map the property from.
 * @param propName  The name of the property to sum.
 */
export function sumOnProperty<T>(arr: Array<T>, propName: string): number {
  return arr.map(x => x[propName]).reduce((x, y) => x + y);
}
