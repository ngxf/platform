import { NgForOf } from '@angular/common';
import { Directive, Host, Input, Optional } from '@angular/core';

@Directive({
  selector: '[ngForTrackByKey]'
})
export class NgForTrackByKeyDirective<T> {

  @Input()
  set ngForTrackByKey(key: keyof T) {
    if (key) {
      this.ngFor.ngForTrackBy = (index: number, item: T): T[keyof T] => item[key];
    } else {
      this.ngFor.ngForTrackBy = undefined;
    }

    this.ngFor['_differ'] = null;
    this.ngFor['_ngForOfDirty'] = true;
    this.ngFor.ngDoCheck();
  }

  constructor(@Host() @Optional() private ngFor: NgForOf<T>) {
    if (!ngFor) {
      throw new Error('TrackByKey should use with *ngFor!');
    }
  }

}
