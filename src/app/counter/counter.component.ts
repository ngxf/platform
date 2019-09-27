import { Component, Input } from '@angular/core';
import { Async, connect } from '@ngxf/connect';
import { Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

interface CounterState {
  counter: number;
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {

  increment = new Subject<number>();

  @Input() at: number;

  @Async() state: CounterState = connect({
    counter: this.increment.pipe(
      startWith(0),
      scan((count, inc) => count + inc)
    )
  });

}
