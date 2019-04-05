import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { from, Observable, of, throwError } from 'rxjs';
import { AsyncDirective } from '../../lib/directives/async.directive';

@Component({ selector: 'host', template: '' })
class HostComponent {
  async: Observable<any> | Promise<any>;

  next($event) {}

  error($event) {}

  complete($event) {}
}

const ERROR_VALUE = 'Async Error';
const NEXT_VALUE = 'Async Data';

const structuralTemplate = `
  <ng-container *async="
    let data from async; next next; error error; complete complete
  ">{{ data }}</ng-container>
`;
const bindingTemplate = `
  <ng-template [async]="async" (next)="next($event)"
    (error)="error($event)" (complete)="complete($event)" let-data>{{ data }}</ng-template>`;

describe('AsyncDirective', () => {
  let host: SpectatorWithHost<AsyncDirective, HostComponent>;
  const create = createHostComponentFactory({
    component: AsyncDirective,
    host: HostComponent
  });

  [
    {
      name: 'structural template',
      template: structuralTemplate
    },
    {
      name: 'binding template',
      template: bindingTemplate
    }
  ].forEach(({ name, template }) => {
    describe(`with ${name}`, () => {

      it('should subscribe to observable', () => {
        host = create(template);
        spyHost(host.hostComponent);
        host.setHostInput({ async: from([ 1, 2 ]) });

        expect(host.hostComponent.next).toHaveBeenCalledWith(1);
        expect(host.hostComponent.next).toHaveBeenCalledWith(2);
        expect(host.hostComponent.next).toHaveBeenCalledTimes(2);
        expect(host.hostComponent.error).not.toHaveBeenCalled();
        expect(host.hostComponent.complete).toHaveBeenCalledTimes(1);
      });

      it('should subscribe to observable and throw error', () => {
        host = create(template);
        spyHost(host.hostComponent);
        host.setHostInput({ async: throwError(ERROR_VALUE) });

        expect(host.hostComponent.error).toHaveBeenCalledWith(ERROR_VALUE);
      });

      it('should subscribe to promise', fakeAsync(() => {
        host = create(template);
        spyHost(host.hostComponent);
        host.setHostInput({ async: Promise.resolve(1) });
        tick();

        expect(host.hostComponent.next).toHaveBeenCalledWith(1);
        expect(host.hostComponent.next).toHaveBeenCalledTimes(1);
        expect(host.hostComponent.error).not.toHaveBeenCalled();
        expect(host.hostComponent.complete).toHaveBeenCalledTimes(1);
      }));

      it('should subscribe to promise and throw error', fakeAsync(() => {
        host = create(template);
        spyHost(host.hostComponent);
        host.setHostInput({ async: Promise.reject(ERROR_VALUE) });
        tick();

        expect(host.hostComponent.error).toHaveBeenCalledWith(ERROR_VALUE);
      }));

      it('should render $implicit context', () => {
        host = create(template);
        spyHost(host.hostComponent);
        host.setHostInput({ async: of(NEXT_VALUE) });

        expect(host.hostElement).toHaveText(NEXT_VALUE);
      });
    });
  });

});

function spyHost(host: HostComponent) {
  spyOn(host, 'next').and.callThrough();
  spyOn(host, 'error').and.callThrough();
  spyOn(host, 'complete').and.callThrough();
}
