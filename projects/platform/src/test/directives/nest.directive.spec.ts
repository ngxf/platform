import { Component } from '@angular/core';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { NestDirective } from '../../lib/directives/nest.directive';

@Component({ selector: 'host', template: '' })
class Host {}

const TEMPLATE = `
<ng-template #greeting let-text let-children="children">
  {{ text }}, World! <ng-container *ngTemplateOutlet="children context { $implicit: text }"></ng-container>
</ng-template>

<ng-container *nest="[greeting, greeting, greeting] as nested">
  <div *ngTemplateOutlet="nested context { $implicit: 'Hello' }"></div>
</ng-container>
`;

const EXPECTED = Array(3).fill('Hello, World!').join('  ');

describe('NestDirective', () => {
  let host: SpectatorWithHost<NestDirective, Host>;
  const create = createHostComponentFactory({
    component: NestDirective,
    host: Host
  });

  it('should create nested template', () => {
    host = create(TEMPLATE);

    expect(host.hostElement).toHaveText(EXPECTED);
  });

});
