import * as dat from 'dat.gui';
import { Pane } from 'tweakpane';

export default class Debug {
  constructor() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'D' && e.shiftKey) {
        const hash = '#debug';
        window.location.hash = hash;
        window.location.reload();
        this.active = !this.active;

        if (!this.active) {
          window.location.hash = '';
          window.location.reload();
        }
      }
    });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length >= 3) {
        this.active = !this.active;
      }
    });

    this.active = window.location.hash === '#debug';
    if (this.active) {
      this.ui = new Pane();
    }
  }
}
