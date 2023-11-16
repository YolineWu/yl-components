interface ObjectConstructor {
  typedKeys<T>(obj: T): Array<keyof T>;
}
