import { Component } from '@angular/core';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { NgForTrackByKeyDirective } from '../../lib/directives/track-by-key.directive';

@Component({
  selector: 'lib-animals',
  template: ''
})
class AnimalsComponent {
  animals: any[];
}

describe('NgForTrackByKeyDirective', () => {
  let host: SpectatorWithHost<NgForTrackByKeyDirective<any>, AnimalsComponent>;
  const create = createHostComponentFactory({
    component: NgForTrackByKeyDirective,
    declarations: [ NgForTrackByKeyDirective ],
    host: AnimalsComponent
  });

  it('should add generate trackBy fn by key', () => {
    host = create(`
      <ng-container *ngFor="
        let item of [
          { animal: '🦊' },
          { animal: '🦄' }
        ] trackByKey 'animal'">
        {{ item.animal }}
      </ng-container>
    `);

    expect(host.hostElement).toHaveText('🦊  🦄');
  });

  it('should correct recreate differs when array are changed', () => {
    host = create(`
      <ng-container *ngFor="let item of animals trackByKey 'animal'">
        {{ item.animal }}
      </ng-container>
    `);

    host.setHostInput('animals', [
      { animal: '🦊' },
      { animal: '🦄' }
    ]);
    expect(host.hostElement.textContent).toEqual(' 🦊  🦄 ');

    host.setHostInput('animals', [
      { animal: '🦊' },
      { animal: '🙀' },
      { animal: '🦄' }
    ]);
    expect(host.hostElement.textContent).toEqual(' 🦊  🙀  🦄 ');
  });

  it('should throw exception', () => {
    expect(() => {
      host = create(`
        <ng-container *ngFor="
          let item of [
            { animal: '🦊' },
            null
          ] trackByKey 'animal'">
          {{ item?.animal }}
        </ng-container>
      `);
    }).toThrow(`Cannot read property 'animal' of null`);
  });

});
