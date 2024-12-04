export function jsonStringify(obj: object, spaces = undefined) {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
    spaces
  );
}
