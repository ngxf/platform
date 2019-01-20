import { SimpleChanges } from '@angular/core';

const noop = () => { };
export function UseEffect(
  effect: () => (() => any) | any,
  affectedKeys?: string[]
) {
  const destroyEffectsMap = new WeakMap();
  function init() {
    const destroyEffect = effect.call(this);
    destroyEffectsMap.set(this, destroyEffect);
  }
  function destroy() {
    if (destroyEffectsMap.has(this)) {
      const destroyEffect = destroyEffectsMap.get(this);
      if (destroyEffect) {
        destroyEffect();
      }
    }
  }
  function isChanged(changes: SimpleChanges): boolean {
    if (!affectedKeys) {
      return true;
    }

    if (affectedKeys.length === 0) {
      return false;
    }

    return affectedKeys.every((affectedKey) => affectedKey in changes);
  }
  return (def: any) => {
    const originalOnInit = def.ngComponentDef.onInit || noop;
    def.ngComponentDef.onInit = function onInit() {
      originalOnInit();
      init.call(this);
    };

    const originalOnChanges = def.ngComponentDef.onChanges || noop;
    def.ngComponentDef.onChanges = function onChanges(changes: SimpleChanges) {
      originalOnChanges(changes);
      if (isChanged(changes)) {
        destroy.call(this);
        init.call(this);
      }
    };

    const originalOnDestroy = def.ngComponentDef.onDestroy || noop;
    def.ngComponentDef.onDestroy = function onDestroy() {
      originalOnDestroy();
      destroy.call(this);
    };
  };
}
