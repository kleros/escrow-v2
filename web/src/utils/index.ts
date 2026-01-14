import { Roles } from "@kleros/kleros-app";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const isUndefined = (maybeObject: any): maybeObject is undefined => typeof maybeObject === "undefined";

/**
 * Checks if a string is empty or contains only whitespace.
 */
export const isEmpty = (str: string): boolean => str.trim() === "";

type Role = {
  name: string;
  restriction: {
    maxSize: number;
    allowedMimeTypes: string[];
  };
};

export const getFileUploaderMsg = (role: Roles, roleRestrictions?: Role[]) => {
  if (!roleRestrictions) return;
  const restrictions = roleRestrictions.find((supportedRoles) => Roles[supportedRoles.name] === role);

  if (!restrictions) return;

  const typesString = restrictions.restriction.allowedMimeTypes
    .map((type) => {
      const [prefix, suffix] = type.split("/");
      if (!suffix) return prefix ?? null;

      return suffix === "*" ? prefix : suffix;
    })
    .join(", ");

  return `Allowed file types: [${typesString}], Max allowed size: ${(
    restrictions.restriction.maxSize /
    (1024 * 1024)
  ).toFixed(2)} MB.`;
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
