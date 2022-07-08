import Experience from '../experience';
import Environment from './environment';
import Shader from './shader/shader';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    if (this.resources.sources.length) {
      this.resources.on('ready', () => {
        this.shader = new Shader();
        this.environment = new Environment();
      });
    } else {
      this.shader = new Shader();
      this.environment = new Environment();
    }
  }

  update() {
    if (this.shader) {
      this.shader.update();
    }
  }
}
