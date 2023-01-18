import * as three from 'three';

import {
	compatibilityCheck,
	initCam,
	initDLight,
	initOrbit,
	initPlane,
	initRenderer,
	initScene,
	initSphere,
	initSpotlight,
	initSpotlightHelper,
	initGui,
	initGuiOptions,
	initBackground,
	galaxy,
	space,
	space2,
	supernova,
} from './lib';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const model = new URL('./assets/untitled.glb', import.meta.url);

compatibilityCheck();

const renderer = initRenderer();
document.body.appendChild(renderer.domElement);
const scene = initScene();
const camera = initCam();

initOrbit();

camera.position.set(0, 10, 50);

const plane = initPlane();
scene.add(plane);

const sphere = initSphere();
scene.add(sphere);

//const directionalLight = initDLight();

const spotlight = initSpotlight();
const spotlighthelper = initSpotlightHelper();

// scene.fog = new three.Fog(0xffffff, 0, 50);
// scene.fog = new three.FogExp2(0xffffff, 0.01);

const txt = new three.TextureLoader();

const materials = [
	new three.MeshBasicMaterial({ map: txt.load(galaxy) }),
	new three.MeshBasicMaterial({ map: txt.load(space) }),
	new three.MeshBasicMaterial({ map: txt.load(space2) }),
	new three.MeshBasicMaterial({ map: txt.load(supernova) }),
	new three.MeshBasicMaterial({ map: txt.load(galaxy) }),
	new three.MeshBasicMaterial({ map: txt.load(galaxy) }),
];

const box2geo = new three.BoxGeometry(4, 4, 4);
const box2mat = new three.MeshBasicMaterial({
	//color: 'green',
	map: txt.load(galaxy),
});
const box2 = new three.Mesh(box2geo, materials);
box2.position.set(0, 15, 20);
scene.add(box2);

initBackground();

initGui();
let options = initGuiOptions();
let step = 0;

const mousepos = new three.Vector2();
window.addEventListener('mousemove', (e) => {
	mousepos.x = (e.clientX / window.innerWidth) * 2 - 1;
	mousepos.y = (e.clientY / window.innerHeight) * 2 + 1;
});

box2.name = 'box2';

const raycaster = new three.Raycaster();

const plane2geo = new three.PlaneGeometry(10, 10, 10, 10);
const plane2mat = new three.MeshBasicMaterial({
	color: 0xffffff,
	wireframe: true,
});
const plane2 = new three.Mesh(plane2geo, plane2mat);
scene.add(plane2);
plane2.position.set(10, 10, 15);

const sphere2geo = new three.SphereGeometry(4);
const sphere2mat = new three.ShaderMaterial({
	vertexShader: document.getElementById('vshader').textContent,
	fragmentShader: document.getElementById('fshader').textContent,
});

const sphere2 = new three.Mesh(sphere2geo, sphere2mat);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const assetloader = new GLTFLoader();
assetloader.load(
	model.href,
	(gltf) => {
		const md = gltf.scene;
		scene.add(md);
		md.position.set(-12, 4, 10);
	},
	undefined,
	(error) => {
		console.log(error);
	}
);

renderer.render(scene, camera);
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
/* GLOBAL FUNCTIONS */
function animate(time) {
	step += options.speed;
	let y = 10 * Math.abs(Math.sin(step));
	sphere.position.y = y + 4;

	spotlight.angle = options.angle;
	spotlight.penumbra = options.penumbra;
	spotlight.intensity = options.intensity;
	spotlighthelper.update();

	raycaster.setFromCamera(mousepos, camera);
	const intersects = raycaster.intersectObjects(scene.children);

	// for (let i = 0; i < intersects.length; i++) {
	// 	if (intersects[i].object.name == 'box2') {
	// 		box2.rotation.x = time / 1000;
	// 		box2.rotation.y = time / 1000;
	// 	}
	// }

	for (let i = 0; i < plane2.geometry.attributes.position.array.length; i++) {
		if (plane2.geometry.attributes.position.array[i] > 10) {
			plane2.geometry.attributes.position.array[i] = 0;
		} else {
			plane2.geometry.attributes.position.array[i] += 0.01;
		}
	}
	plane2.geometry.attributes.position.needsUpdate = true;

	renderer.render(scene, camera);
}
