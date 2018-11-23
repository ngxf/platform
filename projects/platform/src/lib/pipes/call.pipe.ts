import { ChangeDetectorRef, EmbeddedViewRef, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'call' })
export class CallPipe implements PipeTransform {
  context: any;

  constructor(cd: ChangeDetectorRef) {
    this.context = (cd as EmbeddedViewRef<any>).context;
  }

  transform(param: any, fn: string | Function, ...params: any[]) {
    if (typeof fn === 'string') {
      fn = this.context[fn];
    }

    if (typeof fn !== 'function') {
      fn = () => { };
    }

    return fn.apply(this.context, [param, ...params]);
  }
}
