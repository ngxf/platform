import { ChangeDetectorRef, EmbeddedViewRef, Pipe, PipeTransform } from '@angular/core';

type Method<T = any> = (this: T, ...args: any[]) => any;
type Head<T extends Method> = Parameters<T>[0];
type Tail<T extends Method> = T extends (first: any, ...rest: infer R) => any ? R : never;

@Pipe({ name: 'call' })
export class CallPipe<C> implements PipeTransform {
  private readonly context: C;

  // with Ivy you can inject EmbeddedViewRef directly
  constructor(private cd: ChangeDetectorRef) {
    this.context = (this.cd as EmbeddedViewRef<C>).context;
  }

  transform<M extends Method<C>>(param: Head<M>, fn: M, ...params: Tail<M>): ReturnType<M> {
    return fn.apply(this.context, [param, ...params]);
  }
}
