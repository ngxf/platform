import { Component } from '@angular/core';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { UseStateDirective } from '../../lib/directives/use-state.directive';

@Component({ selector: 'host', template: '' })
class Host {}

describe('UseStateDirective', () => {
  let host: SpectatorWithHost<UseStateDirective, Host>;
  const create = createHostComponentFactory({
    component: UseStateDirective,
    host: Host
  });

  it('should create state through template', () => {
    host = create(`
      <ng-container *useState="let x default 0">
        Count: {{ x }}
        <button id="increment" (click)="x = x + 1">Increment</button>
      </ng-container>
    `);


    expect(host.hostElement).toHaveText('Count: 0');

    const increment: any = host.hostElement.querySelector('#increment');
    increment.click();
    increment.click();
    increment.click();
    expect(host.hostElement).toHaveText('Count: 3');
  });

});
