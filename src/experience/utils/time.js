import { Clock } from 'three';
import EventEmitter from './eventEmitter';

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.start = Date.now();
    this.clock = new Clock();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => this.tick());
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.elapsed = this.current - this.start;
    this.current = currentTime;

    this.trigger('tick');

    window.requestAnimationFrame(() => this.tick());
  }

  getElapsedTime() {
    return this.clock.getElapsedTime();
  }
}
