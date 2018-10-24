import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { CookiesDirective } from '../../lib/directives';

const NAME = 'ngxf';
const VALUE = 'Best Of The Best';

describe('CookiesDirective', () => {
  let host: SpectatorWithHost<CookiesDirective>;
  const create = createHostComponentFactory(CookiesDirective);

  it('should set cookie', () => {
    host = create(template(`let cookie set '${NAME}' value '${VALUE}'`));

    expect(host.hostElement).toHaveText(VALUE);
  });

  it('should get cookie', () => {
    host = create(template(`let cookie get '${NAME}'`));

    expect(host.hostElement).toHaveText(VALUE);
  });

  it('should remove cookie', () => {
    host = create(template(`let cookie remove '${NAME}'`));

    expect(host.hostElement).not.toHaveText(VALUE);
  });

  it('should get cookie', () => {
    host = create(template(`let cookie get '${NAME}'`));

    expect(host.hostElement).not.toHaveText(VALUE);
  });

  it('should set and get cookie', () => {
    host = create(compose([
      `let cookie set '${NAME}' value '${VALUE}'`,
      `let cookie get '${NAME}'`
    ]));

    expect(host.hostElement).toHaveText(VALUE);
  });

});

function compose(commands: string[]): string {
  return commands.reduce((acc, command) => template(command, acc));
}

function template(command: string, tail: string = '{{ cookie }}'): string {
  return `<ng-container *cookies="${command}">${tail}</ng-container>`;
}
