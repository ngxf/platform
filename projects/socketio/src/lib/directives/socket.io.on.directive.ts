import { Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent, SubscriptionLike } from 'rxjs';

import 'socket.io-client';

interface SocketIOOnContext {
  $implicit: any;
}

@Directive({
  selector: '[socketIOOn]'
})
export class SocketIOOnDirective implements OnChanges, OnDestroy {
  @Input() socketIOOnOn: string;
  @Input() socketIOOnFrom: SocketIOClient.Socket;

  private context: SocketIOOnContext = {
    $implicit: null
  };
  private subscription: SubscriptionLike;
  private viewRef: EmbeddedViewRef<SocketIOOnContext>;

  constructor(
    private templateRef: TemplateRef<SocketIOOnContext>,
    private vcr: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.socketIOOnOn || changes.socketIOOnFrom) {
      this.destroy();
      if (this.socketIOOnOn && this.socketIOOnFrom) {
        if (
          changes.socketIOOnOn.previousValue !== this.socketIOOnOn ||
          changes.socketIOOnFrom.previousValue !== this.socketIOOnFrom
        ) {
          this.init();
        }
      }
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  private init() {
    this.subscription = fromEvent(this.socketIOOnFrom, this.socketIOOnOn)
      .subscribe((value: any) => {
        this.context.$implicit = value;
        this.viewRef = this.templateRef.createEmbeddedView(this.context);
        this.viewRef.detectChanges();
        if (this.viewRef) {
          this.viewRef.destroy();
          this.viewRef = null;
        }
      });
  }

  private destroy() {
    this.vcr.clear();
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }
}
