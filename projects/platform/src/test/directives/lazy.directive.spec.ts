import { ANALYZE_FOR_ENTRY_COMPONENTS, Component, NgModule, NgModuleFactoryLoader } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { LAZY_COMPONENT_TOKEN, LazyDirective } from '../../lib/directives/lazy.directive';

@Component({ selector: 'host', template: '' })
class HostComponent {
  path: string;

  activate(component: any) {}

  deactivate(component: any) {}
}

const COMPONENT_TEMPLATE = 'Hello,';
const NG_CONTENT = 'NGX Features!';

@Component({
  selector: 'lazy',
  template: `${COMPONENT_TEMPLATE}
  <ng-content></ng-content>`
})
class LazyComponent {}

@NgModule({
  declarations: [ LazyComponent ],
  providers: [
    { provide: LAZY_COMPONENT_TOKEN, useValue: LazyComponent },
    { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: LazyComponent, multi: true }
  ]
})
class LazyModule {}

describe('LazyDirective', () => {
  let host: SpectatorWithHost<LazyDirective, HostComponent>;
  const create = createHostComponentFactory({
    component: LazyDirective,
    host: HostComponent,
    imports: [ RouterTestingModule ]
  });

  [
    {
      name: 'structural template',
      template: `<ng-container *lazy="
        let component loadChildren path;
        activate activate; deactivate deactivate
      ">${NG_CONTENT}</ng-container>`
    },
    {
      name: 'structural template and default input',
      template: `<ng-container *lazy="path;
        activate activate; deactivate deactivate
      ">${NG_CONTENT}</ng-container>`,
    },
    {
      name: 'binding template',
      template: `<ng-template let-component [lazy]="path"
      (activate)="activate($event)" (deactivate)="deactivate($event)"
      >${NG_CONTENT}</ng-template>`
    }
  ].forEach(({ name, template }) => {
    describe(`with ${name}`, () => {
      it('should load module and render component', fakeAsync(() => {
        host = create(template);

        spyHost(host.hostComponent);

        const loader = host.get(NgModuleFactoryLoader);
        loader.stubbedModules = { lazyModule: LazyModule };
        host.setHostInput({ path: 'lazyModule' });
        tick();

        expect(host.hostElement).toHaveText(COMPONENT_TEMPLATE);
        expect(host.hostElement).toHaveText(NG_CONTENT);

        host.setHostInput({ path: null });
        tick();

        expect(host.hostComponent.activate).toHaveBeenCalled();
        expect(host.hostComponent.deactivate).toHaveBeenCalled();
      }));
    });
  });

});

function spyHost(host: HostComponent) {
  spyOn(host, 'activate').and.callThrough();
  spyOn(host, 'deactivate').and.callThrough();
}
