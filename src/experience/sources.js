import { CubeTextureLoader, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default [
  {
    name: 'environmentMapTexture',
    path: [
      'textures/environmentMap/px.jpg',
      'textures/environmentMap/nx.jpg',
      'textures/environmentMap/py.jpg',
      'textures/environmentMap/ny.jpg',
      'textures/environmentMap/pz.jpg',
      'textures/environmentMap/nz.jpg'
    ],
    loader: CubeTextureLoader
  },
  {
    name: 'fox',
    path: ['models/Fox/glTF-Binary/Fox.glb'],
    loader: GLTFLoader
  },
  {
    name: 'grassColor',
    path: ['textures/dirt/color.jpg'],
    loader: TextureLoader
  },
  {
    name: 'grassNormal',
    path: ['textures/dirt/normal.jpg'],
    loader: TextureLoader
  }
];
