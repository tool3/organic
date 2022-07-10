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

  getLoaderName(loader) {
    return loader.toString().split(' ')[1];
  }

  setLoaders() {
    this.loaders = {};
    for (const source of this.sources) {
      const name = this.getLoaderName(source.loader);
      if (!this.loaders[name]) {
        this.loaders[name] = new source.loader();
      }
    }
  }

  load() {
    for (const source of this.sources) {
      const name = this.getLoaderName(source.loader);
      // if (name === 'AudioLoader') {
      //   return this.trigger('ready');
      // }
      this.loaders[name].load(source.path, (file) => this.sourceLoaded(source, file));
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
