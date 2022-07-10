import * as THREE from 'three';
import gsap from 'gsap';
import Experience from '../../experience';
import vertexShader from './shaders/sphere/vertex.glsl';
import fragmentShader from './shaders/sphere/fragment.glsl';

export default class Shader {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({ title: 'shader' });
    }

    let audioSet = false;
    window.addEventListener('click', (e) => {
      this.animate();
      if (!audioSet) {
        this.setAudio();
        audioSet = true;
      }
    });

    window.addEventListener('touchstart', (e) => {
      this.animate();
      if (!audioSet) {
        this.setAudio();
        audioSet = true;
      }
    });

    this.setGeometry();
    this.setTextures();
    this.setMaterials();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.SphereBufferGeometry(1, 512, 512);
    this.geometry.shading = THREE.SmoothShading;
    this.geometry.computeTangents();
  }

  setTextures() {
    this.textures = {};
    this.debugObject = {
      clearColor: '#201919',
      colorStart: '#c394c3',
      colorEnd: '#18242f'
    };
  }

  setMaterials() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.1 },
        uLightAColor: { value: new THREE.Color(0xadd8e6) },
        uLightAPosition: { value: new THREE.Vector3(1, 1, 0) },
        uLightAIntensity: { value: 0.5 },

        uLightBColor: { value: new THREE.Color(0xff69b4) },
        uLightBPosition: { value: new THREE.Vector3(-1, -1, 0) },
        uLightBIntensity: { value: 0.5 },

        uSubdivision: {
          value: new THREE.Vector2(this.geometry.parameters.widthSegments, this.geometry.parameters.heightSegments)
        },

        uOffset: { value: new THREE.Vector3() },

        uDistortionFrequency: { value: 1.5 },
        uDistortionStrength: { value: 0.65 },
        uDisplacementFrequency: { value: 2.12 },
        uDisplacementStrength: { value: 0.152 },

        uFresnelOffset: { value: -1.609 },
        uFresnelMultiplier: { value: 3.587 },
        uFresnelPower: { value: 1.793 }
      },
      defines: {
        USE_TANGENT: ''
      }
    });
    if (this.debug.active) {
      this.debugFolder.addInput(this.material.uniforms.uSpeed, 'value', {
        label: 'speed',
        min: 0,
        max: 5,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uDistortionFrequency, 'value', {
        label: 'uDistortionFrequency',
        min: 0,
        max: 10,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uDistortionStrength, 'value', {
        label: 'uDistortionStrength',
        min: 0,
        max: 10,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uDisplacementFrequency, 'value', {
        label: 'uDisplacementFrequency',
        min: 0,
        max: 5,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uDisplacementStrength, 'value', {
        label: 'uDisplacementStrength',
        min: 0,
        max: 1,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uFresnelOffset, 'value', {
        label: 'uFresnelOffset',
        min: -2,
        max: 2,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uFresnelMultiplier, 'value', {
        label: 'uFresnelMultiplier',
        min: 0,
        max: 5,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uFresnelPower, 'value', {
        label: 'uFresnelPower',
        min: 0,
        max: 5,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uLightAColor, 'value', {
        label: 'uLightAColor',
        min: 0,
        max: 5,
        step: 0.001
      });
      this.debugFolder.addInput(this.material.uniforms.uLightAPosition, 'value', {
        label: 'uLightAPosition',
        min: 0,
        max: 5,
        step: 0.001
      });
      this.debugFolder.addInput(this.material.uniforms.uLightAIntensity, 'value', {
        label: 'uLightAIntensity',
        min: 0,
        max: 5,
        step: 0.001
      });

      this.debugFolder.addInput(this.material.uniforms.uLightBColor, 'value', {
        label: 'uLightBColor',
        min: 0,
        max: 5,
        step: 0.001
      });
      this.debugFolder.addInput(this.material.uniforms.uLightBPosition, 'value', {
        label: 'uLightBPosition',
        min: 0,
        max: 5,
        step: 0.001
      });
      this.debugFolder.addInput(this.material.uniforms.uLightBIntensity, 'value', {
        label: 'uLightBIntensity',
        min: 0,
        max: 5,
        step: 0.001
      });
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.y = -Math.PI;
    this.scene.add(this.mesh);
  }

  setAudio() {
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('audio/clair_de_lune.mp3', (buffer) => {
      this.listener = new THREE.AudioListener();
      this.camera.instance.add(this.listener);

      this.sound = new THREE.Audio(this.listener);

      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(0.5);

      this.sound.play();
      // this.sound.context.resume();

      this.analyser = new THREE.AudioAnalyser(this.sound, 32);
    });
  }

  animate() {
    if (!gsap.isTweening(this.material.uniforms.uDistortionStrength)) {
      gsap.to(this.material.uniforms.uDistortionStrength, {
        value: Math.random() * -1.5,
        duration: 1,
        stagger: 0.2,
        ease: 'expo.out'
      });
    }
  }

  update() {
    this.material.uniforms.uTime.value = this.time.getElapsedTime();
    if (this.analyser) {
      const soundFrequency = this.analyser.getAverageFrequency() / 50;

      if (!gsap.isTweening(this.material.uniforms.uSpeed) && soundFrequency > 0.1) {
        const speed = soundFrequency / 10 > 0.1 ? soundFrequency / 10 : 0.1;
        gsap.to(this.material.uniforms.uSpeed, {
          value: speed,
          // duration: 0.1,
          ease: 'expo.out'
        });
      }

      // if (!gsap.isTweening(this.material.uniforms.uDisplacementStrength)) {
      //   console.log(soundFrequency);
      // if (soundFrequency > 0.6) {
      //   this.material.uniforms.uDisplacementStrength.value = soundFrequency / 4;
      // }
      // gsap.to(this.material.uniforms.uDistortionStrength, {
      //   value: soundFrequency / 2,
      //   ease: 'none'
      // });
      // }
      // }

      if (!gsap.isTweening(this.material.uniforms.uLightAColor) && soundFrequency > 0.6) {
        gsap.to(this.material.uniforms.uLightAColor.value, {
          ...new THREE.Color(soundFrequency * 0xffffff * Math.random()),
          ease: 'none'
        });
      }

      if (!gsap.isTweening(this.material.uniforms.uLightBColor) && soundFrequency > 0.6) {
        gsap.to(this.material.uniforms.uLightBColor.value, {
          ...new THREE.Color(soundFrequency * 0xffffff * Math.random()),
          ease: 'none'
        });
      }
    }
  }
}
