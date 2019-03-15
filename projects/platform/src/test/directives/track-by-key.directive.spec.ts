import { CommonModule } from '@angular/common';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { NgForTrackByKeyDirective } from '../../lib/directives/track-by-key.directive';

describe('NgForTrackByKeyDirective', () => {
  let host: SpectatorWithHost<NgForTrackByKeyDirective<any>>;
  const create = createHostComponentFactory({
    component: NgForTrackByKeyDirective,
    declarations: [ NgForTrackByKeyDirective ],
    imports: [ CommonModule ]
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

    expect(host.element).toHaveText('🦊  🦄');
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
