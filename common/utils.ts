
export function merge<T>(target: T, source: Partial<T>): void {
  Object.assign(target, definedProps(source));
}

export function definedProps<T>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => v !== undefined)
  );
}
