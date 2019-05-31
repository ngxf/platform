import { Component } from '@angular/core';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { RepeatDirective } from '../../lib/directives/repeat.directive';

@Component({ selector: 'host', template: '' })
class HostComponent {
  count: number;
}

describe('RepeatDirective', () => {
  let host: SpectatorWithHost<RepeatDirective, HostComponent>;
  const create = createHostComponentFactory({
    component: RepeatDirective,
    host: HostComponent
  });

  describe('using as', () => {
    it('should create two items', () => {
      host = create(`|<ng-container *repeat="count as i">{{i}}</ng-container>|`);

      host.setHostInput({ count: 2 });
      expect(host.hostElement).toHaveText('|01|');
    });

    it('should remove an item after change', () => {
      host = create(`|<ng-container *repeat="count as i">{{i}}</ng-container>|`);

      host.setHostInput({ count: 2 });
      expect(host.hostElement).toHaveText('|01|');

      host.setHostInput({ count: 1 });
      expect(host.hostElement).toHaveText('|0|');
    });

    it('should create an item after change', () => {
      host = create(`|<ng-container *repeat="count as i">{{i}}</ng-container>|`);

      host.setHostInput({ count: 2 });
      expect(host.hostElement).toHaveText('|01|');

      host.setHostInput({ count: 4 });
      expect(host.hostElement).toHaveText('|0123|');
    });
  });

  describe('using let of', () => {
    it('should create two items', () => {
      host = create(`|<ng-container *repeat="let i of count">{{i}}</ng-container>|`);

      host.setHostInput({ count: 2 });
      expect(host.hostElement).toHaveText('|01|');
    });

    it('should remove an item after change', () => {
      host = create(`|<ng-container *repeat="let i of count">{{i}}</ng-container>|`);

      host.setHostInput({ count: 2 });
      expect(host.hostElement).toHaveText('|01|');

      host.setHostInput({ count: 1 });
      expect(host.hostElement).toHaveText('|0|');
    });

    it('should create an item after change', () => {
      host = create(`|<ng-container *repeat="let i of count">{{i}}</ng-container>|`);

      host.setHostInput({ count: 2 });
      expect(host.hostElement).toHaveText('|01|');

      host.setHostInput({ count: 4 });
      expect(host.hostElement).toHaveText('|0123|');
    });
  });

});
