import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { TimeoutDirective } from '../../lib/directives/timeout.directive';

@Component({ selector: 'host', template: '' })
class HostComponent { timeout: number; }

const TIMEOUT_500 = 500;
const TIMEOUT_1000 = 1000;
const TEXT = 'timeout works';

describe('TimeoutDirective', () => {
  let host: SpectatorWithHost<TimeoutDirective, HostComponent>;
  const create = createHostComponentFactory({
    component: TimeoutDirective,
    host: HostComponent
  });

  it('should create timeout through template', fakeAsync(() => {
    host = create(`<ng-container *timeout="${TIMEOUT_500}">${TEXT}</ng-container>`);

    expect(host.hostElement).not.toHaveText(TEXT);

    tick(TIMEOUT_500);

    expect(host.hostElement).toHaveText(TEXT);
  }));

  it('should not create timeout when timeout input is not a number', fakeAsync(() => {
    host = create(`<ng-container *timeout="timeout">${TEXT}</ng-container>`);

    expect(host.hostElement).not.toHaveText(TEXT);

    tick(TIMEOUT_500);

    expect(host.hostElement).not.toHaveText(TEXT);
  }));

  it('should create timeout through binding', fakeAsync(() => {
    host = create(`<ng-container *timeout="timeout">${TEXT}</ng-container>`);

    expect(host.hostElement).not.toHaveText(TEXT);

    host.setHostInput({ timeout: TIMEOUT_500});

    expect(host.hostElement).not.toHaveText(TEXT);

    tick(TIMEOUT_500);

    expect(host.hostElement).toHaveText(TEXT);
  }));

  it('should dispose old timeout after update value', fakeAsync(() => {
    host = create(`<ng-container *timeout="timeout">${TEXT}</ng-container>`);
    host.setHostInput({ timeout: TIMEOUT_1000});

    tick(TIMEOUT_1000 - 1);

    expect(host.hostElement).not.toHaveText(TEXT);

    host.setHostInput({ timeout: TIMEOUT_500});

    tick(1);

    expect(host.hostElement).not.toHaveText(TEXT);

    tick(TIMEOUT_500 - 1);

    expect(host.hostElement).toHaveText(TEXT);
  }));

});
