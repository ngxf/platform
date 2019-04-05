import { Component } from '@angular/core';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { UseReducerDirective } from '../../lib/directives/use-reducer.directive';

@Component({ selector: 'host', template: '' })
class HostComponent {

  action = {
    type: 'reset',
    payload: 100
  };

  state = {
    count: 0
  };

  reducer = (state, action) => {
    switch (action.type) {
      case 'reset':
        return { count: action.payload };
      case 'increment':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      default:
        // A reducer must always return a valid state.
        // Alternatively you can throw an error if an invalid action is dispatched.
        return state;
    }
  }
}

describe('UseReducerDirective', () => {
  let host: SpectatorWithHost<UseReducerDirective, HostComponent>;
  const create = createHostComponentFactory({
    component: UseReducerDirective,
    host: HostComponent
  });

  it('should create reducer through template', () => {
    host = create(`
      <ng-container *useReducer="let store init reducer with state and action">
        Count: {{ store.state.count }}
        <button id="reset" (click)="store.dispatch({ type: 'reset', payload: 0 })">Reset</button>
        <button id="increment" (click)="store.dispatch({ type: 'increment' })">Increment</button>
        <button id="decrement" (click)="store.dispatch({ type: 'decrement' })">Decrement</button>
      </ng-container>
    `);


    expect(host.hostElement).toHaveText('Count: 100');

    const increment: any = host.hostElement.querySelector('#increment');
    increment.click();
    increment.click();
    increment.click();
    expect(host.hostElement).toHaveText('Count: 103');

    const decrement: any = host.hostElement.querySelector('#decrement');
    decrement.click();
    decrement.click();
    expect(host.hostElement).toHaveText('Count: 101');

    const reset: any = host.hostElement.querySelector('#reset');
    reset.click();
    expect(host.hostElement).toHaveText('Count: 0');
  });

});
