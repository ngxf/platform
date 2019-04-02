import { Component } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { ConsolePipe, CONSOLE, skipValueOperators } from '../../lib/pipes/console.pipe';

const TEXT = 'NGX Features Awesome';
const OPTIONAL_PARAMS = [ '🦊', '🙀', '🐉', '🦄' ];

@Component({ selector: 'host', template: '' })
class Host {
  text: string = TEXT;
}

const operators = [
  'info',
  'log',
  'warn',
  'exception',
  'error',
  'debug',
  'trace',
  'dir',
  'dirxml',
  'table',
  'trace',
  'count',
  'markTimeline',
  'time',
  'timeEnd',
  'profile',
  'profileEnd',
  'timeline',
  'timelineEnd',
  'timeStamp',
  'group',
  'groupCollapsed',
  'groupEnd',
  'clear'
];

const normalOperators = operators.filter((operator) => !skipValueOperators.includes(operator));

describe('ConsolePipe', () => {
  let host: SpectatorWithHost<Host, Host>;
  const mock = {} as Console;
  operators.forEach((operator) => mock[operator] = () => {});
  const create = createHostComponentFactory({
    host: Host,
    component: Host,
    declarations: [ ConsolePipe ],
    componentProviders: [ { provide: CONSOLE, useValue: mock } ]
  });

  it('should call console with default verbose', fakeAsync(() => {
    spyOn(mock, 'log').and.callThrough();
    host = create(`{{ text | console }}`, false);

    host.detectChanges();
    expect(host.hostElement).toHaveText(TEXT);
    expect(mock.log).toHaveBeenCalledWith(TEXT);
    expect(mock.log).toHaveBeenCalledTimes(1);
  }));

  operators.forEach((operator: keyof Console) => {
    it(`should call console${ operator } with value`, fakeAsync(() => {
      spyOn(mock, operator).and.callThrough();
      host = create(`{{ text | console: '${ operator }' }}`, false);

      host.detectChanges();
      expect(host.hostElement).toHaveText(TEXT);
      expect(mock[ operator ]).toHaveBeenCalledWith(TEXT);
      expect(mock[ operator ]).toHaveBeenCalledTimes(1);
    }));
  });

  skipValueOperators.forEach((operator: keyof Console) => {
    it(`should call console${ operator } with optional params`, fakeAsync(() => {
      spyOn(mock, operator).and.callThrough();
      host = create(`{{ text | console: '${ operator }': '${OPTIONAL_PARAMS.join(`':'`)}' }}`, false);

      host.detectChanges();
      expect(host.hostElement).toHaveText(TEXT);
      expect(mock[ operator ]).toHaveBeenCalledWith(...OPTIONAL_PARAMS);
      expect(mock[ operator ]).toHaveBeenCalledTimes(1);
    }));
  });

  normalOperators.forEach((operator: keyof Console) => {
    it(`should call console${ operator } with optional params`, fakeAsync(() => {
      spyOn(mock, operator).and.callThrough();
      host = create(`{{ text | console: '${ operator }': '${OPTIONAL_PARAMS.join(`':'`)}' }}`, false);

      host.detectChanges();
      expect(host.hostElement).toHaveText(TEXT);
      expect(mock[ operator ]).toHaveBeenCalledWith(TEXT, ...OPTIONAL_PARAMS);
      expect(mock[ operator ]).toHaveBeenCalledTimes(1);
    }));
  });

});
