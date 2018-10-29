import { Component } from '@angular/core';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { RenamePropDirective, ComposeDirective } from '../../lib/directives';

@Component({ selector: 'host', template: '' })
class Host {}

const TEMPLATE = `
<ng-template #rename>
  <ng-container *renameProp="'text' to 'name'"></ng-container>
</ng-template>

<ng-template #greet let-name="name">{{ name }}</ng-template>

<ng-container *compose="let enhancer of [rename]">
  <div *ngTemplateOutlet="enhancer(greet) context { text: 'Hello, World!' }"></div>
</ng-container>
`;

describe('RenamePropDirective', () => {
  let host: SpectatorWithHost<RenamePropDirective, Host>;
  const create = createHostComponentFactory({
    component: RenamePropDirective,
    host: Host,
    declarations: [ ComposeDirective ]
  });

  it('should create nested template', () => {
    host = create(TEMPLATE);

    expect(host.hostElement).toHaveText('Hello, World!');
  });

});
