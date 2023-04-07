
export function merge<T extends object>(target: T, source: Partial<T>): void {
  Object.assign(target, definedProps(source));
}

export function definedProps<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => v !== undefined)
  );
}
