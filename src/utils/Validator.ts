import { HTTP400Error } from "./HttpErrors";

export function validate<T = Record<string, any>>(
  object: T,
  ...fields: (keyof typeof object)[]
): {
  [k in typeof fields[number]]: T[k];
} {
  const objectFields = Object.keys(object || {});
  for (const field of fields) {
    const found = objectFields.indexOf(field as string);
    if (!~found) throw new HTTP400Error(`Missing param ${field}`);
    const value = object[field];
    if (
      value == null ||
      (typeof value === "string" && (value as string).trim() === "")
    )
      throw new HTTP400Error(`Invalid param ${field}`);
  }
  return object as any;
}
