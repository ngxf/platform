import { NgForOf } from '@angular/common';
import { Directive, Host, Input, OnChanges, Optional, SimpleChanges, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngForTrackByKey]'
})
export class NgForTrackByKeyDirective<T> implements OnChanges {

  @Input() ngForTrackByKey: keyof T;

  constructor(@Host() @Optional() private ngFor: NgForOf<T>, private viewContainerRef: ViewContainerRef) {
    if (!ngFor) {
      throw new Error('TrackByKey should use with *ngFor!');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('ngForTrackByKey' in changes) {
      const key = this.ngForTrackByKey;
      if (key) {
        this.ngFor.ngForTrackBy = (index: number, item: T): T[keyof T] => item[ key ];
      } else {
        this.ngFor.ngForTrackBy = undefined;
      }

      this.ngFor[ '_differ' ] = null;
      this.ngFor[ '_ngForOfDirty' ] = true;
      this.viewContainerRef.clear();
      this.ngFor.ngDoCheck();
    }
  }

}
