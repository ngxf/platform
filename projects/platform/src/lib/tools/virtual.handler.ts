import { Injectable, ChangeDetectorRef, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VirtualHandler implements OnDestroy {

  private elementLink = new Map<Element, ChangeDetectorRef>();
  private observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const cd = this.elementLink.get(entry.target as Element);
      entry.isIntersecting ? attachCD(cd) : detachCD(cd);
    });
  });

  register(element: Element, cd: ChangeDetectorRef) {
    this.elementLink.set(element, cd);
    this.observer.observe(element);
  }

  unregister(element: Element) {
    this.elementLink.delete(element);
    this.observer.unobserve(element);
  }

  ngOnDestroy() {
    this.elementLink.forEach((cd, e) => this.observer.unobserve(e));
    this.elementLink.clear();
  }

}

function attachCD(cd: ChangeDetectorRef) {
  cd.reattach();
  cd.detectChanges();
}

function detachCD(cd: ChangeDetectorRef) {
  cd.detach();
}
