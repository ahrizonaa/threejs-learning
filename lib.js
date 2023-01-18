import * as three from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// import nebula from './nebula.jpg';
// import nebula2 from './nebula2.jpg';
// import nebula3 from './nebula3.jpg';
import galaxy from './galaxy.jpg';
import space from './space.jpg';
import space2 from './space2.jpg';
import supernova from './supernova.jpg';
// resuable globals
let camera,
	scene,
	renderer,
	spotlight,
	spotlighthelper,
	plane,
	sphere,
	directionalLight,
	orbit,
	gui,
	options,
	bgcube;

export function initCam() {
	camera = new three.PerspectiveCamera(
		75,
		document.body.offsetWidth / document.body.offsetHeight,
		0.1,
		500
	);

	return camera;
}

export function initScene() {
	scene = new three.Scene();
	return scene;
}

export function initBackground() {
	bgcube = new three.CubeTextureLoader();
	scene.background = bgcube.load([space, galaxy, supernova, space2, space, space]);
}

export function initOrbit() {
	orbit = new OrbitControls(camera, renderer.domElement);
	orbit.update();
	return orbit;
}

export function initRenderer() {
	renderer = new three.WebGL1Renderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize(document.body.offsetWidth, document.body.offsetHeight);
	return renderer;
}

export function initPlane() {
	const planeGeo = new three.PlaneGeometry(30, 30);
	const planeMat = new three.MeshStandardMaterial({ color: '0xf1c000', side: three.DoubleSide });
	plane = new three.Mesh(planeGeo, planeMat);
	plane.rotation.x = -0.5 * Math.PI;
	plane.receiveShadow = true;
	return plane;
}

export function initSphere() {
	const sphereGeo = new three.SphereGeometry(4, 50, 50);
	const sphereMat = new three.MeshStandardMaterial({
		color: 'lavender',
	});
	sphere = new three.Mesh(sphereGeo, sphereMat);
	sphere.castShadow = true;
	sphere.position.set(-5, 5, 0);
	return sphere;
}

export function initDLight() {
	directionalLight = new three.DirectionalLight(0xeeeffee, 0.8);
	directionalLight.position.set(-30, 50, 0);
	directionalLight.castShadow = true;
	directionalLight.shadow.camera.bottom = -12;
	scene.add(directionalLight);
	const dHelper = new three.DirectionalLightHelper(directionalLight, 5);
	scene.add(dHelper);
	const dlightshadowhelper = new three.CameraHelper(directionalLight.shadow.camera);
	scene.add(dlightshadowhelper);
	return directionalLight;
}

export function initSpotlight() {
	spotlight = new three.SpotLight(0xffffff);
	spotlight.position.set(-100, 100, 0);
	spotlight.castShadow = true;
	spotlight.angle = 0.2;
	scene.add(spotlight);
	return spotlight;
}

export function initSpotlightHelper() {
	spotlighthelper = new three.SpotLightHelper(spotlight);
	scene.add(spotlighthelper);
	return spotlighthelper;
}

export function initGui() {
	gui = new dat.GUI();
	gui.width = 150;
	return gui;
}

export function initGuiOptions() {
	options = {
		sphereColor: '#ffea00',
		wireframe: false,
		speed: 0.01,
		angle: 0.2,
		penumbra: 0,
		intensity: 1,
	};
	gui.addColor(options, 'sphereColor').onChange((e) => {
		sphere.material.color.set(e);
	});

	gui.add(options, 'wireframe').onChange((e) => {
		sphere.material.wireframe = e;
	});

	gui.add(options, 'speed', 0, 0.1);
	gui.add(options, 'angle', 0, 1);
	gui.add(options, 'penumbra', 0, 1);
	gui.add(options, 'intensity', 0, 1);

	return options;
}

export function compatibilityCheck() {
	if (WebGL.isWebGLAvailable()) {
		// Initiate function or other initializations here
		//begin();
	} else {
		const warning = WebGL.getWebGLErrorMessage();
		document.getElementById('container').appendChild(warning);
	}
}

export { galaxy, space, space2, supernova };
