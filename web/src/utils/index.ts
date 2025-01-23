import { Roles } from "@kleros/kleros-app";

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
  console.log({ restrictions });

  return `Allowed file types: [ ${restrictions.restriction.allowedMimeTypes
    .map((type) => {
      const [prefix, suffix] = type.split("/");
      if (!suffix) return prefix ?? null;

      return suffix === "*" ? prefix : suffix;
    })
    .join(", ")} ], Max allowed size: ${(restrictions.restriction.maxSize / (1024 * 1024)).toFixed(2)} MB.`;
};
