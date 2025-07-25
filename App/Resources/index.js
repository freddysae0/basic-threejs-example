import { EquirectangularReflectionMapping, TextureLoader } from "three";
import { GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";

const ASSETS = [
  { key: "windows", type: "texture", path: "windows.jpg" },
  { key: "tv", type: "gltf", path: "tv.glb" },
  { key: "environment", type: "hdr", path: "envmap.hdr" },
];
class Resources {
  _resources;
  _loader;

  constructor() {
    this._resources = new Map();
    this._loader = {
      textureLoader: new TextureLoader(),
      gltfLoader: new GLTFLoader(),
      hdrLoader: new RGBELoader(),
    };
  }

  get(resource) {
    return this._resources.get(resource);
  }
  async load() {
    const promises = ASSETS.map((el) => {
      let prom;
      if (el.type == "texture") {
        prom = new Promise((resolve) => {
          this._loader.textureLoader.load(el.path, (texture) => {
            this._resources.set(el.key, texture);
            resolve();
          });
        });
      }

      if (el.type == "gltf") {
        prom = new Promise((resolve) => {
          this._loader.gltfLoader.load(el.path, (model) => {
            this._resources.set(el.key, model);
            resolve();
          });
        });
      }
      if (el.type == "hdr") {
        prom = new Promise((resolve) => {
          this._loader.hdrLoader.load(el.path, (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            this._resources.set(el.key, texture);
            resolve();
          });
        });
      }

      return prom;
    });
    await Promise.all(promises);
  }
}

export default Resources;
