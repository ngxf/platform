import { Component } from '@angular/core';

interface State {
  cursors: { [key: string]: any };
  cursorNames: string[];
  countClicks: number;
  messages: string[];
  name: string;
  color: string;
}

interface Action {
  type: string;
  payload?: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  defaultState: State = {
    cursors: {},
    cursorNames: [],
    countClicks: 0,
    messages: [],
    name: '🦊 thekiba',
    color: '#309eed'
  };

  reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'init': {
        const cursorNames = action.payload.map((cursor) => cursor.name);
        const cursors = action.payload.reduce((acc, cursor) => ({ ...acc, [ cursor.name ]: cursor }), {});
        return { ...state, cursors, cursorNames };
      }
      case 'new-init': {
        const cursorNames = [ ...state.cursorNames, action.payload.name ];
        const cursors = { ...state.cursors, [ action.payload.name ]: action.payload };
        return { ...state, cursorNames, cursors };
      }
      case 'cursor-leave': {
        const cursors = { ...state.cursors };
        delete cursors[ action.payload.name ];
        return { ...state, cursors };
      }
      case 'message': {
        const messages = [ action.payload, ...state.messages ];
        return { ...state, messages };
      }
      case 'move': {
        const cursors = { ...state.cursors, [ action.payload.name ]: action.payload };
        return { ...state, cursors };
      }
      case 'click': {
        const countClicks = action.payload;
        return { ...state, countClicks };
      }
      default:
        return state;
    }
  }

  trackById(index) {
    return index;
  }
}
