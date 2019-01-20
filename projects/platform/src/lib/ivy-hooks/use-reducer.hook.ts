export function UseReducer<T = any>(
  [stateKey, dispatchKey]: [string, string],
  reducer: (state: T, action: { type: any }) => any,
  initialValue?: T
) {
  return (def: any) => {
    const originalFactory = def.ngComponentDef.factory;
    def.ngComponentDef.factory = () => {
      const cmp = originalFactory(def.ngComponentDef.type);
      cmp[stateKey] = initialValue;
      cmp[dispatchKey] = (action) => cmp[stateKey] = reducer(cmp[stateKey], action);
      return cmp;
    };
  };
}
