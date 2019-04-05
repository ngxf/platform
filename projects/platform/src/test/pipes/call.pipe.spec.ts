import { Component } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { CallPipe } from '../../lib/pipes/call.pipe';

const TEXT = 'NGX Features Awesome';
const TEXT2 = 'Really!';

@Component({ selector: 'host', template: '' })
class HostComponent {
  text: string = TEXT;
  method(value: string) {
    return this.transform(value);
  }

  transform(value: string) {
    return value && value.toUpperCase();
  }
}

describe('CallPipe', () => {
  let host: SpectatorWithHost<HostComponent, HostComponent>;
  const create = createHostComponentFactory({
    host: HostComponent,
    component: HostComponent,
    declarations: [ CallPipe ]
  });

  it('should call component method at once', fakeAsync(() => {
    host = create(`{{ text | call: 'method' }}`, false);
    spyOn(host.hostComponent, 'method').and.callThrough();

    host.detectChanges();
    expect(host.hostElement).toHaveText(TEXT.toUpperCase());

    host.detectChanges();
    expect(host.hostComponent.method).toHaveBeenCalledTimes(1);
  }));

  it('should call component method after change text', fakeAsync(() => {
    host = create(`{{ text | call: 'method' }}`, false);
    spyOn(host.hostComponent, 'method').and.callThrough();

    host.detectChanges();
    expect(host.hostElement).toHaveText(TEXT.toUpperCase());

    host.detectChanges();
    expect(host.hostComponent.method).toHaveBeenCalledTimes(1);

    host.setHostInput({ text: TEXT2 });
    expect(host.hostElement).toHaveText(TEXT2.toUpperCase());

    host.detectChanges();
    expect(host.hostComponent.method).toHaveBeenCalledTimes(2);
  }));

  it('should call method by string', fakeAsync(() => {
    host = create(`{{ text | call: 'method' }}`, false);
    spyOn(host.hostComponent, 'method').and.callThrough();

    host.detectChanges();
    expect(host.hostComponent.method).toHaveBeenCalledTimes(1);
  }));

  it('should call method by function', fakeAsync(() => {
    host = create(`{{ text | call: method }}`, false);
    spyOn(host.hostComponent, 'method').and.callThrough();

    host.detectChanges();
    expect(host.hostComponent.method).toHaveBeenCalledTimes(1);
  }));

  it('should call method with extra arguments', fakeAsync(() => {
    host = create(`{{ text | call: method: 'foo': 'bar' }}`, false);
    spyOn(host.hostComponent, 'method').and.callThrough();

    host.detectChanges();
    expect(host.hostComponent.method).toHaveBeenCalledWith(TEXT, 'foo', 'bar');
  }));

});
