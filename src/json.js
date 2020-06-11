export function jsonCopy(data) {
  return JSON.parse(JSON.stringify(data));
}

export function jsonFormat(data, fn = (k,v) => v, indent = 2) {
  return JSON.stringify(data, fn, indent);
}