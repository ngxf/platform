import { Component, Injectable, Input } from '@angular/core';
import { Async, connect } from '@ngxf/connect';
import { Subject } from 'rxjs';
import { scan, shareReplay, startWith } from 'rxjs/operators';

interface CounterState {
  counter: number;
}

@Injectable({ providedIn: 'root' })
export class CounterService {
  increment = new Subject<number>();
  counter = this.increment.pipe(
    startWith(0),
    scan((count, inc) => count + inc),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {

  increment = this.service.increment;

  @Input() at: number;

  @Async() state: CounterState = connect({
    counter: this.service.counter
  });

  constructor(private service: CounterService) {}

}
