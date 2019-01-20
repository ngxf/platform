export function UseState<T = any>(
  [stateKey, setStateKey]: [string, string],
  initialValue?: T
) {
  return (def: any) => {
    const originalFactory = def.ngComponentDef.factory;
    def.ngComponentDef.factory = () => {
      const cmp = originalFactory(def.ngComponentDef.type);
      cmp[stateKey] = initialValue;
      cmp[setStateKey] = (value) => cmp[stateKey] = value;
      return cmp;
    };
  };
}
