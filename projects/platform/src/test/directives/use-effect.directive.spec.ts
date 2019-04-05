import { Component } from '@angular/core';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { UseEffectDirective } from '../../lib/directives/use-effect.directive';

@Component({ selector: 'host', template: '' })
class HostComponent {
  a;
  x;

  effect = () => {
    return () => this.destroy();
  }

  destroy() {}
}

describe('UseEffectDirective', () => {
  let host: SpectatorWithHost<UseEffectDirective, HostComponent>;
  const create = createHostComponentFactory({
    component: UseEffectDirective,
    host: HostComponent
  });

  it('should recreate effect when x changed', () => {
    host = create(`
      <ng-container *useEffect="effect; on [x]">
        Hello world!
      </ng-container>
    `);

    spyOn(host.hostComponent, 'effect').and.callThrough();
    spyOn(host.hostComponent, 'destroy').and.callThrough();

    host.setHostInput({ a: 'a' });
    host.setHostInput({ x: 'a' });
    host.setHostInput({ a: 'v' });

    expect(host.hostComponent.effect).toHaveBeenCalledTimes(2);
    expect(host.hostComponent.destroy).toHaveBeenCalledTimes(2);
  });

  it('shouldn recreate effect when any param changed', () => {
    host = create(`
      <ng-container *useEffect="effect; on []">
        Hello world!
      </ng-container>
    `);

    spyOn(host.hostComponent, 'effect').and.callThrough();
    spyOn(host.hostComponent, 'destroy').and.callThrough();

    host.setHostInput({ a: 'a' });
    host.setHostInput({ x: 'a' });
    host.setHostInput({ a: 'v' });

    expect(host.hostComponent.effect).toHaveBeenCalledTimes(1);
    expect(host.hostComponent.destroy).toHaveBeenCalledTimes(1);
  });

  it('should recreate effect when any param changed', () => {
    host = create(`
      <ng-container *useEffect="effect">
        Hello world!
      </ng-container>
    `);

    spyOn(host.hostComponent, 'effect').and.callThrough();
    spyOn(host.hostComponent, 'destroy').and.callThrough();

    host.setHostInput({ a: 'a' });
    host.setHostInput({ x: 'a' });
    host.setHostInput({ a: 'v' });

    expect(host.hostComponent.effect).toHaveBeenCalledTimes(4);
    expect(host.hostComponent.destroy).toHaveBeenCalledTimes(4);
  });

});
