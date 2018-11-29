import { Directive, Input, TemplateRef, ViewContainerRef, EmbeddedViewRef, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import * as io_ from 'socket.io-client';

/**
 * Fixes for rollup:
 * Error: Cannot call a namespace ('io')
 */
const io = io_;

interface SocketIOContext {
  $implicit: SocketIOClient.Socket;
}

@Directive({
  selector: '[socketIO]'
})
export class SocketIODirective implements OnChanges, OnDestroy {
  @Input() socketIOOf: string;

  private context: SocketIOContext = {
    $implicit: null
  };
  private socket: SocketIOClient.Socket;
  private viewRef: EmbeddedViewRef<SocketIOContext>;

  constructor(
    private templateRef: TemplateRef<SocketIOContext>,
    private vcr: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.socketIOOf && this.socketIOOf) {
      this.destroy();
      this.init();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private init() {
    this.context.$implicit = this.socket = io(this.socketIOOf);
    this.vcr.createEmbeddedView(this.templateRef, this.context);
  }

  private destroy() {
    this.vcr.clear();
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.context.$implicit = this.socket = null;
    }
  }
}
