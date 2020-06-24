/**
 * @description
 * The function which is used by `distinctUntilSomeChanged` and `selectSlice` to determine if changes are distinct or
 * not.
 * Should return true if values are equal.
 *
 * @param {T} oldVal
 * @param {T} newVal
 *
 * @return boolean
 *
 * @docsPage interfaces
 * @docsCategory operators
 */
export declare type CompareFn<T> = (oldVal: T, newVal: T) => boolean;
