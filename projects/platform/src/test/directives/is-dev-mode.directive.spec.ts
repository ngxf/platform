import { createHostComponentFactory, SpectatorWithHost, HostComponent } from '@netbasal/spectator';
import { DevModeService, IsDevModeDirective } from '../../lib/directives/is-dev-mode.directive';

const TEXT = 'NGX Features';

describe('IsDevModeDirective', () => {
  let host: SpectatorWithHost<IsDevModeDirective>;
  const mock = { isDevMode: () => true };
  const create = createHostComponentFactory({
    component: IsDevModeDirective,
    providers: [
      { provide: DevModeService, useValue: mock }
    ]
  });

  it('should create view when dev mode enabled', () => {
    mock.isDevMode = () => true;
    host = create(`<ng-container *isDevMode>${ TEXT }</ng-container>`);
    expect(host.hostElement).toHaveText(TEXT);
  });

  it(`shouldn't create view when dev mode disabled`, () => {
    mock.isDevMode = () => false;
    host = create(`<ng-container *isDevMode>${ TEXT }</ng-container>`);
    expect(host.hostElement).not.toHaveText(TEXT);
  });

});
