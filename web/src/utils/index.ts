export const isUndefined = (maybeObject: any): maybeObject is undefined => typeof maybeObject === "undefined";

/**
 * Checks if a string is empty or contains only whitespace.
 */
export const isEmpty = (str: string): boolean => str.trim() === "";
