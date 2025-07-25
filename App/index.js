import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Color,
  DirectionalLight,
  AmbientLight,
  SpotLight,
  Group,
  SpotLightHelper,
  EquirectangularReflectionMapping,
  RepeatWrapping,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";

import Stats from "stats.js";
import Resources from "./Resources";

export default class App {
  #gl;
  #camera;
  #scene;
  #clock;
  #stats;
  #resources;

  constructor() {
    this.#gl = undefined;
    this.#scene = undefined;
    this.#camera = undefined;

    this.#init();
  }

  async #init() {
    // RENDERER
    this.#gl = new WebGLRenderer({
      canvas: document.querySelector("#canvas"),
    });

    this.#gl.setSize(window.innerWidth, window.innerHeight);

    // CAMERA
    const aspect = window.innerWidth / window.innerHeight;
    this.#camera = new PerspectiveCamera(60, aspect, 1, 10);
    this.#camera.position.z = 5;

    this.#stats = new Stats();

    // SCENE
    this.#scene = new Scene();
    await this.#initScene();
    this.#initEnvironment();
    this.#initLights();

    this.#animate();

    this.#initEvents();
  }

  async #initScene() {
    this.#resources = new Resources();
    await this.#resources.load();
    this.#initTV();
  }
  #initTV() {
    const mesh = this.#resources.get("tv").scene;
    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.position.set(0, -1, 0);
    mesh.rotation.set(0, -0.45, 0);
    this.#scene.add(mesh);
  }
  #initLights() {
    const ambientLight = new AmbientLight();
    const directionalLight = new DirectionalLight();
    this.#scene.add(ambientLight);
    this.#scene.add(directionalLight);
    directionalLight.position.setY(10);
    directionalLight.rotateX(3);
    directionalLight.intensity = 3;
  }
  #initEnvironment() {
    const environmentMap = this.#resources.get("environment");
    this.#scene.background = new Color("#425866");
    this.#scene.environment = environmentMap;
  }

  #initEvents() {
    window.addEventListener("resize", this.#resize.bind(this));
  }

  #resize() {
    this.#gl.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;
    this.#camera.aspect = aspect;
    this.#camera.updateProjectionMatrix();
  }

  #animate() {
    this.#stats.begin();

    this.#gl.render(this.#scene, this.#camera);

    this.#stats.end();
    window.requestAnimationFrame(this.#animate.bind(this));
  }
}
