import * as dat from 'dat.gui';
import { Pane } from 'tweakpane';

export default class Debug {
  constructor() {
    window.addEventListener('keydown', (e) => this.toggle(e));
    window.addEventListener('touchstart', (e) => this.toggle(e));

    this.active = window.location.hash === '#debug';
    if (this.active) {
      this.ui = new Pane();
    }
  }

  toggle(e) {
    if ((e.key === 'D' && e.shiftKey) || e.touches.length >= 3) {
      this.active = !this.active;
      const hash = '#debug';
      window.location.hash = hash;

      if (!this.active) {
        window.location.hash = '';
      }

      window.location.reload();
    }
  }
}
