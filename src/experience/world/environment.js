import * as THREE from 'three';
import Experience from '../experience';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.setSunLight();

    if (this.resources.sources.length && this.resources.items.envMap) {
      this.setEnvMap();
    }
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);
  }

  setEnvMap() {
    this.envMap = {};
    this.envMap.intensity = 0.4;
    this.envMap.texture = this.resources.items.environmentMapTexture;
    this.envMap.texture.encoding = THREE.sRGBEncoding;
    this.scene.environment = this.envMap.texture;

    this.envMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.envMap.texture;
          child.material.envMapIntensity = this.envMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };

    this.envMap.updateMaterials();
  }
}
