<!--
//if (!Detector.webgl) Detector.addGetWebGLMessage();

var camera, controls, scene, renderer;

var raycaster, mouse;

var groundMesh;
var baseMat, groundMat, voxelMat;
var directionalLight, directionalLight2, ambientLight;

var playerCamOffset, playerShadowCamOffset;
var camZoom = 80;

var gamepads;

var manChar = {
	posX: 0,
	posY: 0,
	posZ: 0,
	rotX: 0,
	rotY: 0,
	rotZ: 0,
	animState: 0, // 0 = still, 1 = start walking, 2 = walking, e = end walking
	animInterval: 8,
	walkTimer: 0,
	centerPoint: null,
	voxelGroup: null,
	refreshPos: function() {
		this.centerPoint.position.set(this.posX, this.posY + 12, this.posZ);
		this.voxelGroup.position.set(this.posX, this.posY, this.posZ);
		this.voxelGroup.rotation.set(this.rotX, this.rotY, this.rotZ);
	},
};

var screenCover;

var viewWidth;
var viewHeight;
var viewTop = 0;
var viewLeft = 0;

String.prototype.replaceAll = function(search, replace) {
    if (!replace) {
        return this.toString();
    }
    return this.split(search).join(replace);
}

function createVoxels(vox) {

	var voxels = vox.voxels;
	var voxelGroup = new THREE.Group();
	for (var x = 0; x < voxels.length; x++) {
		if (!voxels[x]) continue;
		for (var y = 0; y < voxels[x].length; y++) {
			if (!voxels[x][y]) continue;
			for (var z = 0; z < voxels[x][y].length; z++) {
				var currentVox = voxels[x][y][z];
				if ((!currentVox && currentVox !== 0) || currentVox < 0) continue;

				var voxGeo = new THREE.BoxGeometry(1, 1, 1);
				var voxMat = new THREE.MeshPhongMaterial({color:vox.palette[currentVox]});
				var voxMesh = new THREE.Mesh(voxGeo, voxMat);
				voxMesh.castShadow = true;
				voxMesh.receiveShadow = true;
				voxMesh.position.set(vox.offsetX + x, vox.offsetY + y, vox.offsetZ + z);
				voxelGroup.add(voxMesh);
			}
		}
	}
	
	return voxelGroup;
}

function focusCameraOn(camTarget) {
	controls.target = new THREE.Vector3(camTarget.position.x, camTarget.position.y, camTarget.position.z);
}


function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(25, 2 / 1, 0.1, 1000);
	
	directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(-20, 30, 10);
	directionalLight.castShadow = true;

	directionalLight.shadow.mapSize.width = 4096;
	directionalLight.shadow.mapSize.height = 4096;
	directionalLight.shadow.bias = -0.0001;
	directionalLight.shadow.radius = 1;
	directionalLight.shadow.camera.top = 9;
	directionalLight.shadow.camera.left = -8;
	directionalLight.shadow.camera.bottom = -10;
	directionalLight.shadow.camera.right = 8;
	
	directionalLight2 = new THREE.DirectionalLight(0xffffff, -0.2);
	directionalLight2.position.set(0, 6, -10);
	
	ambientLight = new THREE.AmbientLight(0xffffff, 1.0);


	groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshPhongMaterial({color: 0x188f1b, side: THREE.DoubleSide}));
	groundMesh.rotation.x = Math.PI / 2;
	groundMesh.receiveShadow = true;

	manChar.centerPoint = new THREE.Object3D();
	manChar.voxelGroup = createVoxels(voxelModels.man.stand);
	manChar.voxelGroup.rotation.order = "YXZ";
	manChar.rotY = Math.PI / 2 * 3;
	manChar.refreshPos();


	camera.position.x = manChar.centerPoint.position.x - camZoom;
	camera.position.y = manChar.centerPoint.position.y + camZoom;
	camera.position.z = manChar.centerPoint.position.z - camZoom;

	
	scene.add(directionalLight);
	scene.add(directionalLight2);
	scene.add(ambientLight);

	scene.add(groundMesh);
	scene.add(manChar.voxelGroup);
	scene.add(manChar.centerPoint);


	directionalLight.target = manChar.centerPoint;


	playerShadowCamOffset = {
		x: directionalLight.position.x - manChar.posX,
		//y: directionalLight.position.y - manChar.posY,
		z: directionalLight.position.z - manChar.posZ
	};


	renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	renderer.shadowMap.enabled = true;
	viewWidth = window.innerWidth;
	viewHeight = window.innerHeight;
	renderer.setSize(viewWidth, viewHeight);
	renderer.setClearColor(0x000000, 0);
	document.getElementById("canvas-container").appendChild(renderer.domElement);
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.rotateSpeed = 0.2;
	controls.maxPolarAngle = controls.getPolarAngle();
	controls.minPolarAngle = controls.getPolarAngle();
	controls.mouseButtons = {
		ORBIT: THREE.MOUSE.RIGHT,
	};
	focusCameraOn(manChar.centerPoint);
	
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	
	renderer.domElement.addEventListener("mousemove", onMouseMove, false);
	renderer.domElement.addEventListener("mouseleave", onMouseLeave, false);
	renderer.domElement.addEventListener("mousedown", onMouseDown, false);
	renderer.domElement.addEventListener("mouseup", onMouseUp, false);
	window.addEventListener("keydown", onKeyDown, false);
	window.addEventListener("gamepadconnected", onGamepadConnected, false);
	
	window.addEventListener("resize", onWindowResize);
	onWindowResize();
}

function onWindowResize() {
	viewWidth = window.innerWidth;
	viewHeight = window.innerHeight;

	camera.aspect = viewWidth / viewHeight;
    camera.updateProjectionMatrix();

	renderer.setSize(viewWidth, viewHeight);
}

function onMouseMove(event) {
	click = false;
	
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	
	mouse.x = ((event.clientX) / viewWidth) * 2 - 1;
	mouse.y = - ((event.clientY - viewTop) / viewHeight) * 2 + 1;	
	
	// update the picking ray with the camera and mouse position	
	raycaster.setFromCamera( mouse, camera );	

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(scene.children);

	for ( var i = 0; i < intersects.length; i++ ) {

		var mesh = intersects[i].object;

		break;
	}
}

function onMouseLeave(event) {
	click = false;
}

function onMouseDown(event) {
	click = true;
}

function onMouseUp(event) {
	if (!click) return;
	click = false;
	
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	
	mouse.x = ((event.clientX - viewLeft) / viewWidth) * 2 - 1;
	mouse.y = - ((event.clientY - viewTop) / viewHeight) * 2 + 1;	
	
	// update the picking ray with the camera and mouse position	
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects(scene.children);
	
	for ( var i = 0; i < intersects.length; i++ ) {
		var mesh = intersects[i].object;
	
		// find the index of the face the mouse is pointing at
		face = intersects[i].face.materialIndex;
		
		break;
	}
	
	if (event.button === 0) {
		// left click
	}
	else if (event.button === 2) {
		// right click 
	}
}

function onKeyDown(event)  {
	var k = event.keyCode;
	if (k == 27)
	{
		// esc
	}
}

function onGamepadConnected(event) {
	var gp = navigator.getGamepads()[event.gamepad.index];
	console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    gp.index, gp.id,
    gp.buttons.length, gp.axes.length);

	controls.maxAzimuthAngle = controls.getAzimuthalAngle();
	controls.minAzimuthAngle = controls.maxAzimuthAngle;
}

function updateGamepads() {
	gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
	if (!gamepads) return;

	var updateCamera = false;

	for (var i = 0; i < Math.min(gamepads.length, 1); i++) {
		var gp = gamepads[i];

		if (gp && (Math.abs(gp.axes[0]) >= 0.5 || Math.abs(gp.axes[1]) >= 0.5)) {

			if (manChar.animState == 0) {
				manChar.animState = 1;
			}
			else {
				manChar.animState = 2;
			}

			playerCamOffset = {
				x: camera.position.x - manChar.posX,
				//y: camera.position.y - manChar.posY,
				z: camera.position.z - manChar.posZ
			};

			rot = Math.PI / 2 + (controls.getAzimuthalAngle() - Math.atan2(gp.axes[1], gp.axes[0]))
			manChar.rotY = rot;
			manChar.posX += Math.sin(rot);
			manChar.posZ += Math.cos(rot);
			manChar.refreshPos();

			directionalLight.position.x = manChar.posX + playerShadowCamOffset.x;
			directionalLight.position.z = manChar.posZ + playerShadowCamOffset.z;
			updateCamera = true;
		}
		else {
			if (manChar.animState == 2) {
				manChar.animState = 3;
			}
		}

		if (gp && (Math.abs(gp.axes[2]) >= 0.5)) {
			controls.maxAzimuthAngle -= (gp.axes[2] * Math.PI / 75);
			controls.minAzimuthAngle = controls.maxAzimuthAngle;
		}
		if (gp && (Math.abs(gp.axes[3]) >= 0.5)) { // doesn't work
			camZoom += camZoom / 20 * gp.axes[3];
			if (camZoom < 20) camZoom = 20;
			if (camZoom > 150) camZoom = 150;
			updateCamera = true;
		}

		if (updateCamera) {
			camera.position.x = manChar.centerPoint.position.x - camZoom;
			camera.position.y = manChar.centerPoint.position.y + camZoom;
			camera.position.z = manChar.centerPoint.position.z - camZoom;
			focusCameraOn(manChar.centerPoint);
		}
	}
}

function updateCharAnims() {
	if (manChar.animState == 1) {
		manChar.animState = 2;
		manChar.walkTimer = 0;
		scene.remove(manChar.voxelGroup);
		manChar.voxelGroup = createVoxels(voxelModels.man.run[0]);
		scene.add(manChar.voxelGroup);
		manChar.refreshPos();
		return;
	}
	if (manChar.animState == 2) {
		manChar.walkTimer++;
		if (manChar.walkTimer % manChar.animInterval <= 0) {
			if (manChar.walkTimer >= manChar.animInterval * 4) manChar.walkTimer = 0;
			scene.remove(manChar.voxelGroup);
			manChar.voxelGroup = createVoxels(voxelModels.man.run[Math.floor(manChar.walkTimer / manChar.animInterval)]);
			scene.add(manChar.voxelGroup);
			manChar.refreshPos();
		}
		return;
	}
	if (manChar.animState == 3) {
		manChar.walkTimer++;
		if (manChar.walkTimer % manChar.animInterval <= 0) {
			manChar.animState = 0;
			manChar.walkTimer = 0;
			scene.remove(manChar.voxelGroup);
			manChar.voxelGroup = createVoxels(voxelModels.man.stand);
			scene.add(manChar.voxelGroup);
			manChar.refreshPos();
		}
		return;
	}
}

function animate() {
	requestAnimationFrame(animate);
	updateGamepads();
	updateCharAnims();
	controls.update();
	
	render();
}

function render() {
	renderer.render(scene, camera);
}
-->