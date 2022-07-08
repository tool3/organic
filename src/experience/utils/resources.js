import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import EventEmitter from './eventEmitter';

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    this.sources = sources;
    this.items = {};
    this.total = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.load();
  }

  setLoaders() {
    this.loaders = {};
    for (const source of this.sources) {
      if (!this.loaders[source.loader]) {
        this.loaders[source.loader] = new source.loader();
      }
    }
  }

  load() {
    for (const source of this.sources) {
      this.loaders[source.loader].load(source.path, (file) => this.sourceLoaded(source, file));
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.total) {
      this.trigger('ready');
    }
  }
}
