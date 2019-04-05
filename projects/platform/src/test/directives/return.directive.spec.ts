import { Component } from '@angular/core';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { ComposeDirective } from '../../lib/directives/compose.directive';
import { ReturnDirective } from '../../lib/directives/return.directive';

@Component({ selector: 'host', template: '' })
class HostComponent {}

const TEMPLATE = `
<ng-template #return let-text="text">
  <ng-container *return="{ name: text + ', World!' }"></ng-container>
</ng-template>

<ng-template #greet let-name="name">{{ name }} 123123</ng-template>

<ng-container *compose="let enhancer of [return]">
  <div *ngTemplateOutlet="enhancer(greet) context { text: 'Hello' }"></div>
</ng-container>
`;

describe('ReturnDirective', () => {
  let host: SpectatorWithHost<ReturnDirective, HostComponent>;
  const create = createHostComponentFactory({
    component: ReturnDirective,
    host: HostComponent,
    declarations: [ ComposeDirective ]
  });

  it('should return new context', () => {
    host = create(TEMPLATE);

    expect(host.hostElement).toHaveText('Hello, World!');
  });

});
