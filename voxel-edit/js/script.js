<!--
//if (!Detector.webgl) Detector.addGetWebGLMessage();

const EDITOR_VERSION = "a-1";

let camera, controls, scene, renderer;

let raycaster, mouse;

let voxels, selectedVoxel, selectMesh;
let directionalLight, directionalLight2, ambientLight;

let screenCover;

let canvasContainer, toolsPanel, palettePanel, cameraPanel, filePanel
let voxCount, currentTool, currentColor;
let paletteSlots;

let defaultColors =
[
	"#000000",
	"#111111",
	"#222222",
	"#333333",
	"#444444",
	"#555555",
	"#666666",
	"#777777",
	"#888888",
	"#999999",
	"#AAAAAA",
	"#BBBBBB",
	"#CCCCCC",
	"#DDDDDD",
	"#EEEEEE",
	"#FFFFFF"
];

const TOOL_NONE 	= 0;
const TOOL_PENCIL 	= 1;
const TOOL_ERASER 	= 2;
const TOOL_PAINT 	= 3;

let hotbarCurrent = 0;
let hotbarTextVisible =
[
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false
];

let viewWidth;
let viewHeight;
let viewTop = 0;
let viewLeft = 0;

let clipboardVoxels;


let xOffset = 0;
let yOffset = 0;
let zOffset = 0;


function init() {
	currentTool = TOOL_PENCIL;
	currentColor = 4;

	voxels = [];
	voxels[0] = [];
	voxels[0][0] = [];
	voxels[0][0][0] = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color:defaultColors[currentColor]}));
	voxels[0][0][0].paletteColor = currentColor;
	
	selectedVoxel = [0, 0, 0];

	voxCount = 1;
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, 2 / 1, 0.1, 1000);
	camera.position.x = -6;
	camera.position.y = 4;
	camera.position.z = -6;
	
	directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(0, 1, 0.2);
	
	directionalLight2 = new THREE.DirectionalLight(0xffffff, -0.2);
	directionalLight2.position.set(0, -1, -0.6);
	
	ambientLight = new THREE.AmbientLight(0xffffff, 1.0);

	renderer = new THREE.WebGLRenderer({antialias:false, alpha:true});
	viewWidth = window.innerWidth;
	viewHeight = window.innerHeight;
	renderer.setSize(viewWidth, viewHeight);
	renderer.setClearColor(0x000000, 0);

	canvasContainer = document.getElementById("canvas-container");
	canvasContainer.appendChild(renderer.domElement);
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.rotateSpeed = 0.3;
	
	selectMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color:0xFFFFFF,transparent:true,opacity:0.4}));
	selectMesh.scale.x = 1.001;
	selectMesh.scale.y = 1.001;
	selectMesh.scale.z = 1.001;
	selectMesh.visible = false;
	
	updateStructure();
	
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	
	// screenCover = document.getElementById("screen-cover");
	// tabContainer = document.getElementById("tab-container");
	// tabContainerMenu = document.getElementById("tab-container-menu");
	// cbControls = document.getElementById("cb-controls");
	// setupCommandsPanel = document.getElementById("setup-commands");
	// outputCommandPanel = document.getElementById("output-command");
	// newOpenPanel = document.getElementById("new-open-panel");
	// savePanel = document.getElementById("save-panel");
	// saveTextBox = document.getElementById("save-text");
	// saveParagraph = document.getElementById("save-info");
	// settingsPanel = document.getElementById("settings-panel");
	// xOffsetInput = document.getElementById("offset-x");
	// yOffsetInput = document.getElementById("offset-y");
	// zOffsetInput = document.getElementById("offset-z");

	toolsPanel = document.getElementById("tools-panel");
	palettePanel = document.getElementById("palette-panel");
	
	renderer.domElement.addEventListener("mousemove", onMouseMove, false);
	renderer.domElement.addEventListener("mouseleave", onMouseLeave, false);
	renderer.domElement.addEventListener("mousedown", onMouseDown, false);
	renderer.domElement.addEventListener("mouseup", onMouseUp, false);
	// window.addEventListener("keydown", onKeyDown, false);
	
	// document.getElementById("cb-command-input").addEventListener("keyup", cbCommandInput_keyUp, false);
	document.getElementById("tool-button").addEventListener("click", toolButton_click, false);
	document.getElementById("palette-button").addEventListener("click", paletteButton_click, false);
	document.getElementById("pencil-button").addEventListener("click", pencilButton_click, false);
	document.getElementById("eraser-button").addEventListener("click", eraserButton_click, false);
	document.getElementById("paint-button").addEventListener("click", paintButton_click, false);

	paletteSlots = [];
	for (let i = 0; i < palettePanel.children.length; i++) {
		paletteSlots[i] = palettePanel.children[i].children[0];
		paletteSlots[i].addEventListener("click", paletteSlot_click, false);
		paletteSlots[i].addEventListener("change", paletteSlot_change, false);
		paletteSlots[i].value = defaultColors[i];
		paletteSlots[i].parentElement.style.backgroundColor = defaultColors[i];
		if (i == currentColor) {
			paletteSlots[i].parentElement.classList.add("palette-color-selected");
		}
	}
	
	window.addEventListener("resize", onWindowResize);
	onWindowResize();
}

function onWindowResize() {
	viewWidth = window.innerWidth;
	viewHeight = window.innerHeight;

	camera.aspect = viewWidth / viewHeight;
    camera.updateProjectionMatrix();
	
	renderer.setSize(viewWidth, viewHeight);
	//if (savePanel.style.display === "block") calcSaveTextBoxSize();
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
	
	selectMesh.visible = false;

	for ( var i = 0; i < intersects.length; i++ ) {

		var mesh = intersects[i].object;
		
		if (mesh === selectMesh) continue;
		
		selectMesh.visible = true;
		
		selectMesh.position.x = mesh.position.x;
		selectMesh.position.y = mesh.position.y;
		selectMesh.position.z = mesh.position.z;
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
	
	var face;
	var foundBlock = false;
	
	for ( var i = 0; i < intersects.length; i++ ) {
		var mesh = intersects[i].object;
		
		if (mesh === selectMesh) continue;
		
		// update selector coordinates
		selectedVoxel[0] = mesh.position.x;
		selectedVoxel[1] = mesh.position.y;
		selectedVoxel[2] = mesh.position.z;
	
		// find the index of the face the mouse is pointing at
		face = intersects[i].face.materialIndex;
		foundBlock = true;
		
		break;
	}
	
	if (!foundBlock) {
		if (currentTool == TOOL_PAINT) {
			canvasContainer.style.backgroundColor = paletteSlots[currentColor].value;
		}
		return;
	}
	
	selectMesh.visible = true;
	selectMesh.position.x = selectedVoxel[0];
	selectMesh.position.y = selectedVoxel[1];
	selectMesh.position.z = selectedVoxel[2];
	
	// var currentVox = voxels[selectedVoxel[0], selectedVoxel[1], selectedVoxel[2]];
	
	var structureUpdate = false;
	
	if (event.button === 0) {
		if (currentTool == TOOL_ERASER) {
			if (voxCount > 1) {
				voxels[selectedVoxel[0]][selectedVoxel[1]][selectedVoxel[2]] = null;
				selectMesh.visible = false;
				structureUpdate = true;
				voxCount--;
			}
		}
		else if (currentTool == TOOL_PAINT) {
			paintVox = voxels[selectedVoxel[0]][selectedVoxel[1]][selectedVoxel[2]];
			paintVox.material.color = new THREE.MeshLambertMaterial({color:paletteSlots[currentColor].value}).color;
			paintVox.paletteColor = currentColor;
		}
		else if (currentTool == TOOL_PENCIL) {
			intersects = raycaster.intersectObjects(scene.children);
			face = intersects[0].face.materialIndex;
			
			var newBlock = [selectedVoxel[0], selectedVoxel[1], selectedVoxel[2]];
			var f = 0;
			
			switch (face) {
				case 0:
					newBlock[0]++;
					f = 5;
					break;
				case 1:
					newBlock[0]--;
					f = 4;
					break;
				case 2:
					newBlock[1]++;
					f = 1;
					break;
				case 3:
					newBlock[1]--;
					f = 0;
					break;
				case 4:
					newBlock[2]++;
					f = 3;
					break;
				case 5:
					newBlock[2]--;
					f = 2;
					break;
			}
			
			checkVoxel(newBlock);
			let addVox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color:paletteSlots[currentColor].value}));
			addVox.paletteColor = currentColor;
			voxels[newBlock[0]][newBlock[1]][newBlock[2]] = addVox;
			selectMesh.position.x = newBlock[0];
			selectMesh.position.y = newBlock[1];
			selectMesh.position.z = newBlock[2];
			structureUpdate = true;
			voxCount++;
		}
		/*
		else if (hotbarCurrent >= 4 && hotbarCurrent <= 5) {
			clipboardCb = blocks[selectedBlock[0]][selectedBlock[1]][selectedBlock[2]];
			if (hotbarCurrent === 4) {
				if (getCbCount(2) > 1)
				{
					blocks[selectedBlock[0]][selectedBlock[1]][selectedBlock[2]] = null;
					selectMesh.visible = false;
					structureUpdate = true;
					selectCbHotbarSlot(6);
				}
			}
			else selectCbHotbarSlot(6);
		}
		else if (hotbarCurrent >= 6 && hotbarCurrent <= 8) {
			intersects = raycaster.intersectObjects(scene.children);
			face = intersects[0].face.materialIndex;
			
			var b = blocks[selectedBlock[0]][selectedBlock[1]][selectedBlock[2]];
			if (hotbarCurrent >= 6 && hotbarCurrent <= 7) {
				var newBlock = [selectedBlock[0], selectedBlock[1], selectedBlock[2]];
				var f = 0;
				
				switch (face)
				{
					case 0:
						newBlock[0]++;
						f = 5;
						break;
					case 1:
						newBlock[0]--;
						f = 4;
						break;
					case 2:
						newBlock[1]++;
						f = 1;
						break;
					case 3:
						newBlock[1]--;
						f = 0;
						break;
					case 4:
						newBlock[2]++;
						f = 3;
						break;
					case 5:
						newBlock[2]--;
						f = 2;
						break;
				}
				
				checkBlock(newBlock);
				if (hotbarCurrent === 6)
				{
					blocks[newBlock[0]][newBlock[1]][newBlock[2]] = clipboardCb.clone();
					blocks[newBlock[0]][newBlock[1]][newBlock[2]].direction = f;
				}
				else
				{
					blocks[newBlock[0]][newBlock[1]][newBlock[2]] = b.clone();
					blocks[selectedBlock[0]][selectedBlock[1]][selectedBlock[2]] = null;
				}
				selectMesh.position.x = newBlock[0];
				selectMesh.position.y = newBlock[1];
				selectMesh.position.z = newBlock[2];
			}
			else {
				switch (face)
				{
					case 0:
						b.direction = 5;
						break;
					case 1:
						b.direction = 4;
						break;
					case 2:
						b.direction = 1;
						break;
					case 3:
						b.direction = 0;
						break;
					case 4:
						b.direction = 3;
						break;
					case 5:
						b.direction = 2;
						break;
				}
			}		
			structureUpdate = true;
		}
		*/
	}
	else if (event.button === 2) {
		if (voxCount > 1) {
			voxels[selectedVoxel[0]][selectedVoxel[1]][selectedVoxel[2]] = null;
			selectMesh.visible = false;
			structureUpdate = true;
			voxCount--;
		}
	}
	
	if (structureUpdate) updateStructure();
}

function onKeyDown(event) {
	var k = event.keyCode;
	if (document.getElementById("screen-cover").style.display === "block") {
		if (k == 27) {
			if (cbControls.style.display === "block") hideCbControls();
			else if (outputCommandPanel.style.display === "block") hideOutputCommand();
			else if (newOpenPanel.style.display === "block") hideNewOpenPanel();
			else if (savePanel.style.display === "block") hideSavePanel();
			else if (settingsPanel.style.display === "block") hideSettings();
		}
	}
	else {
		if (k >= 49 && k <= 57) selectCbHotbarSlot(k - 49);
	}
}



function toolButton_click(event) {
	toolsPanel.classList.remove("invisible");
}
function paletteButton_click(event) {
	palettePanel.classList.toggle("invisible");
}
function pencilButton_click(event) {
	currentTool = TOOL_PENCIL;
	toolsPanel.classList.add("invisible");
}
function eraserButton_click(event) {
	currentTool = TOOL_ERASER;
	toolsPanel.classList.add("invisible");
}
function paintButton_click(event) {
	currentTool = TOOL_PAINT;
	toolsPanel.classList.add("invisible");
}
function paletteSlot_click(event) {
	let slot = 0;
	for (let i = 0; i < paletteSlots.length; i++) {
		if (paletteSlots[i] == event.target) {
			slot = i;
		}
	}
	if (slot != currentColor) {
		currentColor = slot;
		document.querySelector(".palette-color-selected").classList.remove("palette-color-selected");
		event.target.parentElement.classList.add("palette-color-selected");
		event.preventDefault();
	}
}
function paletteSlot_change(event) {
	event.target.parentElement.style.backgroundColor = event.target.value;
	updateVoxelsFromPalette();
}

function updateVoxelsFromPalette() {
	for (x = xOffset; x < voxels.length; x++) {
		if (!voxels[x]) continue;
		for (y = yOffset; y < voxels[x].length; y++) {
			if (!voxels[x][y]) continue;
			for (z = zOffset; z < voxels[x][y].length; z++) {
				var vox = voxels[x][y][z];
				if (!vox) continue;
				
				vox.material.color = new THREE.MeshLambertMaterial({color:paletteSlots[vox.paletteColor].value}).color;
			}
		}
	}
}













/*function selectCbHotbarSlot(num) {
	var cbHotbarChildren = document.getElementById("cb-hotbar").children;
	for (var i = 0; i < cbHotbarChildren.length; i++) {
		if (i !== num) cbHotbarChildren[i].className = "";
		else {
			hotbarCurrent = i;
			cbHotbarChildren[i].className = "selected";
			if (!hotbarTextVisible[i]) {
				flashText(cbHotbarChildren[i].children[0], 300);
				hotbarTextCooldown(i, 300);
			}
		}
	}
	var toolHotbarChildren = document.getElementById("tool-hotbar").children;
	for (var i = 0; i < toolHotbarChildren.length; i++) {
		if (i + cbHotbarChildren.length !== num) toolHotbarChildren[i].className = "";
		else {
			hotbarCurrent = i + cbHotbarChildren.length;
			toolHotbarChildren[i].className = "selected";
			if (!hotbarTextVisible[i + cbHotbarChildren.length]) {
				flashText(toolHotbarChildren[i].children[0], 300);
				hotbarTextCooldown(i + cbHotbarChildren.length, 300);
			}
		}
	}
}

function flashText(txt, time) {
	txt.style.display = "inline";
	txt.style.transitionDuration = "0.5s";
	setTimeout(function() { txt.className = ""; }, 1);
	setTimeout(function() { txt.className = "hide"; }, time + 500);
	setTimeout(function() { txt.style.display = "none"; txt.style.transitionDuration = "0s"; }, time + 1000);
}

function hotbarTextCooldown(num, time) {
	hotbarTextVisible[num] = true;
	setTimeout(function() { hotbarTextVisible[num] = false; }, time + 1000);
}

function showTabs() {
	tabContainer.style.display = "inline";
	tabContainerMenu.style.display = "inline";
	setTimeout(function() { tabContainer.className = ""; tabContainerMenu.className = ""; }, 1);
}

function hideTabs() {
	tabContainer.className = "hide";
	tabContainerMenu.className = "hide";
	setTimeout(function() { tabContainer.style.display = "none"; tabContainerMenu.style.display = "none"; }, 300);
}

function showScreenCover() {
	screenCover.style.display = "block";
	setTimeout(function() { screenCover.className = ""; }, 1);
}

function hideScreenCover() {
	screenCover.className = "hide";
	setTimeout(function() { screenCover.style.display = "none"; }, 300);
}

function openCbControls() {	
	updateCbControls();
	showScreenCover();
	hideTabs();
	cbControls.style.display = "block";
	setTimeout(function() { cbControls.className = ""; }, 1);
	setTimeout(function() { document.getElementById("cb-command-input").focus(); }, 500);
}

function cbCommandInput_keyUp(event) {
	if (event.keyCode === 13) {
		document.getElementById("cb-command-input").blur();
		saveCbChanges(null);
	}
}

function cbControlsButtonPress(btn) {
	var t = btn.innerHTML;
	for (var i = 0; i < buttonNames.length; i++) {
		if (t === buttonNames[i]) {
			btn.innerHTML = buttonNames[(i + 1) % buttonNames.length];
			btn.title = buttonTitles[(i + 1) % buttonNames.length];
		}
	}
	if (t === "X") {
		btn.innerHTML = "O";
		btn.title = "Track Output: On";
	}
	else if (t === "O") {
		btn.innerHTML = "X";
		btn.title = "Track Output: Off";
	}
	else if (t === "Unconditional") {
		btn.innerHTML = "Conditional";
		btn.title = "Conditional - runs only when the command block behind it succeeded";
	}
	else if (t === "Conditional") {
		btn.innerHTML = "Unconditional";
		btn.title = "Unconditional - runs regardless of whether the command block behind it succeeded";
	}
	else if (t === "Needs Redstone") {
		btn.innerHTML = "Always Active";
		btn.title = "Always Active - does not require redstone power";
	}
	else if (t === "Always Active") {
		btn.innerHTML = "Needs Redstone";
		btn.title = "Needs Redstone - requires redstone power";
	}
	else if (t === "Update Last Execution: On") {
		btn.innerHTML = "Update Last Execution: Off";
		btn.title = "Can run multiple times per tick";
	}
	else if (t === "Update Last Execution: Off") {
		btn.innerHTML = "Update Last Execution: On";
		btn.title = "Can run only once per tick";
	}
}

function saveCbChanges() {
	var cb = voxels[selectedVoxel[0]][selectedVoxel[1]][selectedVoxel[2]];
	
	cb.command = document.getElementById("cb-command-input").value;
	var cbTypeText = document.getElementById("cb-type").innerHTML;
	for (var i = 0; i < buttonNames.length; i++) {
		if (cbTypeText === buttonNames[i]) {
			cb.cbType = i;
			break;
		}
	}
	if (document.getElementById("cb-conditional").innerHTML === "Unconditional") {
		cb.conditional = false;
	}
	else {
		cb.conditional = true;
	}
	if (document.getElementById("cb-auto").innerHTML === "Needs Redstone") {
		cb.active = false;
	}
	else {
		cb.active = true;
	}
	if (document.getElementById("cb-update-last-execution").innerHTML === "Update Last Execution: Off") {
		cb.updateLastExecution = false;
	}
	else {
		cb.updateLastExecution = true;
	}
	if (document.getElementById("cb-track-output").innerHTML === "X") {
		cb.output = false;
	}
	else {
		cb.output = true;
	}
	
	updateStructure();
	hideCbControls();
}

function hideCbControls() {
	var c = cbControls.children;
	for (i = 0; i < c.length; i++) c[i].blur();
	selectMesh.visible = false;
	cbControls.className = "hide";
	setTimeout(function() { hideScreenCover(); showTabs(); }, 200);
	setTimeout(function() { cbControls.style.display = "none"; }, 500);
}

function updateCbControls() {
	var cb = voxels[selectedVoxel[0]][selectedVoxel[1]][selectedVoxel[2]];
	
	document.getElementById("cb-command-input").value = cb.command;
	var cbTypeButton = document.getElementById("cb-type");
	var cbConditionalButton = document.getElementById("cb-conditional");
	var cbAutoButton = document.getElementById("cb-auto");
	var cbUpdateLastExecutionButton = document.getElementById("cb-update-last-execution");
	var cbTrackOutputButton = document.getElementById("cb-track-output");
	cbTypeButton.innerHTML = buttonNames[cb.cbType];
	cbTypeButton.title = buttonTitles[cb.cbType];
	if (cb.conditional)  {
		cbConditionalButton.innerHTML = "Conditional";
		cbConditionalButton.title = "Conditional - runs only when the command block behind it succeeded";
	}
	else {
		cbConditionalButton.innerHTML = "Unconditional";
		cbConditionalButton.title = "Unconditional - runs regardless of whether the command block behind it succeeded";
	}
	if (cb.active) {
		cbAutoButton.innerHTML = "Always Active";
		cbAutoButton.title = "Always Active - does not require redstone power";
	}
	else {
		cbAutoButton.innerHTML = "Needs Redstone";
		cbAutoButton.title = "Needs Redstone - requires redstone power";
	}
	if (cb.updateLastExecution) {
		cbUpdateLastExecutionButton.innerHTML = "Update Last Execution: On";
		cbUpdateLastExecutionButton.title = "Can run only once per tick";
	}
	else {
		cbUpdateLastExecutionButton.innerHTML = "Update Last Execution: Off";
		cbUpdateLastExecutionButton.title = "Can run multiple times per tick";
	}
	if (cb.output) {
		cbTrackOutputButton.innerHTML = "O";
		cbTrackOutputButton.title = "Track Output: On";
	}
	else {
		cbTrackOutputButton.innerHTML = "X";
		cbTrackOutputButton.title = "Track Output: Off";
	}
}


function openSetupCommands() {
	if (setupCommandsPanel.style.display === "block") return;
	
	document.getElementById("pre-setup-text").value = preCommands.join("\n");
	document.getElementById("post-setup-text").value = postCommands.join("\n");
	
	showScreenCover();
	hideTabs();
	setupCommandsPanel.style.display = "block";
	setTimeout(function() { setupCommandsPanel.className = ""; }, 1);
}

function saveSetupCommands() {
	preCommands = document.getElementById("pre-setup-text").value.split("\n");
	postCommands = document.getElementById("post-setup-text").value.split("\n");
	
	hideSetupCommands();
}

function hideSetupCommands() {
	var c = setupCommandsPanel.children;
	for (i = 0; i < c.length; i++) c[i].blur();
	setupCommandsPanel.className = "hide";
	setTimeout(function() { hideScreenCover(); showTabs(); }, 200);
	setTimeout(function() { setupCommandsPanel.style.display = "none"; }, 500);
}


function openOutputCommand() {
	if (outputCommandPanel.style.display === "block") return;
	
	updateOneCommand();
	showScreenCover();
	hideTabs();
	outputCommandPanel.style.display = "block";
	setTimeout(function() { outputCommandPanel.className = ""; }, 1);
	document.getElementById("output-command-text").click();
}

function displayOutputCommand(num) {
	cmdIndex += num;
	cmdIndex %= cmds.length;
	while (cmdIndex < 0) cmdIndex += cmds.length;
	
	document.getElementById("output-command-index").innerHTML = "Command " + (cmdIndex + 1);
	document.getElementById("output-command-text").value = cmds[cmdIndex];
}

function hideOutputCommand() {
	var c = outputCommandPanel.children;
	for (i = 0; i < c.length; i++) c[i].blur();
	outputCommandPanel.className = "hide";
	setTimeout(function() { hideScreenCover(); showTabs(); }, 200);
	setTimeout(function() { outputCommandPanel.style.display = "none"; }, 500);
}


function confirmSave(btn) {
	document.activeElement.blur();
	newOpenPanel.className = "hide";
	setTimeout(function() { saveProject(); }, 200);
	setTimeout(function() { newOpenPanel.style.display = "none"; }, 500);
	
}

function rejectSave(btn) {
	document.activeElement.blur();
	hideNewOpenPanel(btn);
	if (newP) newProject(false);
	else if (load) loadProject(false);
}

function cancelNewOpen(btn) {
	document.activeElement.blur();
	hideNewOpenPanel(btn);
	newP = false;
	load = false;
}

function newProject(check) {
	newP = check;
	if (check) {
		showNewOpenPanel();
	}
	else {
		createNewProject(true);
	}
}

function loadProject(check) {
	load = check;
	if (check) {
		showNewOpenPanel();
	}
	else {
		document.getElementById("load-file").click();
	}
}

function loadFiles(elem) {
	var files = elem.files;
	if (files.length <= 0) return;
	
	var reader = new FileReader();
	reader.onload = function() {
		loadData(reader.result);
	};
	reader.readAsText(files[0]);
	
	elem.value = "";
}

function saveProject() {
	var s = getSaveData();
	saveTextBox.value = s;
	showSavePanel();
	saveTextBox.click();
	download('project.txt', s)
}

function showNewOpenPanel() {
	showScreenCover();
	hideTabs();
	newOpenPanel.style.display = "block";
	setTimeout(function() { newOpenPanel.className = ""; }, 1);
}

function hideNewOpenPanel() {
	var c = newOpenPanel.children;
	for (i = 0; i < c.length; i++) c[i].blur();
	newOpenPanel.className = "hide";
	setTimeout(function() { hideScreenCover(); showTabs(); }, 200);
	setTimeout(function() { newOpenPanel.style.display = "none"; }, 500);
}

function showSavePanel() {
	showScreenCover();
	hideTabs();
	savePanel.style.display = "block";
	setTimeout(function() { savePanel.className = ""; }, 1);
	calcSaveTextBoxSize();
}

function hideSavePanel() {
	var c = savePanel.children;
	for (i = 0; i < c.length; i++) c[i].blur();
	savePanel.className = "hide";
	setTimeout(function() { hideScreenCover(); showTabs(); }, 200);
	setTimeout(function() { savePanel.style.display = "none"; }, 500);
	
	if (newP) newProject(false);
	else if (load) loadProject(false);
}

function openSettings() {
	showScreenCover();
	hideTabs();
	settingsPanel.style.display = "block";
	setTimeout(function() { settingsPanel.className = ""; }, 1);

	xOffsetInput.value = "" + xOffset;
	yOffsetInput.value = "" + yOffset;
	zOffsetInput.value = "" + zOffset;
}

function parseOffset(elem) {
	var t = elem.value * 1;
	if (elem.value === "") t = 0;
	if (t > 0 && !elem.value.includes(" ") && !elem.value.includes(".")) {
		if (elem.id === "offset-x") xOffsetInputPrev = elem.value;
		if (elem.id === "offset-y") yOffsetInputPrev = elem.value;
		if (elem.id === "offset-z") zOffsetInputPrev = elem.value;
	}
	else if (elem.value !== "") {
		if (elem.id === "offset-x") elem.value = xOffsetInputPrev;
		if (elem.id === "offset-y") elem.value = yOffsetInputPrev;
		if (elem.id === "offset-z") elem.value = zOffsetInputPrev;
	}

}

function checkOffset(elem) {
	if (elem.value === "") {
		if (elem.id === "offset-x") elem.value = "" + xOffset;
		if (elem.id === "offset-y") elem.value = "" + yOffset;
		if (elem.id === "offset-z") elem.value = "" + zOffset;
	}
}

function hideSettings(sav) {
	document.activeElement.blur();
	settingsPanel.className = "hide";
	setTimeout(function() { hideScreenCover(); showTabs(); }, 200);
	setTimeout(function() { settingsPanel.style.display = "none"; }, 500);

	if (sav) {
		xOffset = Number(xOffsetInput.value);
		yOffset = Number(yOffsetInput.value);
		zOffset = Number(zOffsetInput.value);
	}
}


function getCbCount(num) {
	var cbCount = 0;
	for (x = voxels.negativeLength; x < voxels.length; x++) {
		if (typeof voxels[x] == "undefined") continue;
		for (y = voxels[x].negativeLength; y < voxels[x].length; y++) {
			if (typeof voxels[x][y] == "undefined") continue;
			for (z = voxels[x][y].negativeLength; z < voxels[x][y].length; z++) {
				var cbTemp = voxels[x][y][z];
				if (typeof cbTemp == "undefined" || cbTemp === null) continue;
				
				cbCount++;
				if (typeof cbCount != "undefined" && cbCount != null && cbCount > 0 && cbCount >= num) break;
			}
		}
	}
	return cbCount;
}*/

function checkVoxel(v) {			
	if (!voxels[v[0]]) {
		voxels[v[0]] = [];
		voxels[v[0]].negativeLength = 0;
	}
	if (!voxels[v[0]][v[1]]) {
		voxels[v[0]][v[1]] = [];
		voxels[v[0]][v[1]].negativeLength = 0;
	}

	if (v[0] < xOffset) {
		xOffset = v[0];
	}
	if (v[1] < yOffset) {
		yOffset = v[1];
	}
	if (v[2] < zOffset) {
		zOffset = v[2];
	}
}

function updateStructure() {
	scene = new THREE.Scene();
	
	for (x = xOffset; x < voxels.length; x++) {
		if (!voxels[x]) continue;
		for (y = yOffset; y < voxels[x].length; y++) {
			if (!voxels[x][y]) continue;
			for (z = zOffset; z < voxels[x][y].length; z++) {
				var vox = voxels[x][y][z];
				if (!vox) continue;
				
				vox.position.set(x, y, z);
				scene.add(vox);
			}
		}
	}
	
	scene.add(selectMesh);
	
	scene.add(directionalLight);
	scene.add(directionalLight2);
	scene.add(ambientLight);
}

function updateOneCommand() {
	cmds = [];
	
	var command = "summon falling_block ~ ~.55 ~ {Time:1,DropItem:0,Block:redstone_block,Passengers:[{id:falling_block,Time:1,DropItem:0,Block:activator_rail}";
	var endSection = ",{id:commandblock_minecart,Command:\"blockdata ~ ~-2 ~ {auto:0,SuccessCount:0b,Command:\\\"-Insert Command 2-\\\"}\"},{id:commandblock_minecart,Command:\"setblock ~ ~1 ~ command_block 0 - {auto:1,Command:\\\"fill ~ ~-2 ~ ~ ~ ~ air\\\"}\"},{id:commandblock_minecart,Command:\"kill @e[type=commandblock_minecart,r=0]\"}]}";
	var s = "";
	for (ic = 0; ic < preCommands.length; ic++) {
		if (preCommands[ic] == "" || preCommands[ic].startsWith("#"))
			continue;
		s = ",{id:commandblock_minecart,Command:" + format(preCommands[ic]) + "}";
		if (command.length + s.length + endSection.length < 32500) {
			command += s;
		}
		else {
			cmds[cmds.length] = command + endSection;
			command = "summon falling_block ~ ~.55 ~ {Time:1,DropItem:0,Block:redstone_block,Passengers:[{id:falling_block,Time:1,DropItem:0,Block:activator_rail}" + s;
			endSection = ",{id:commandblock_minecart,Command:\"blockdata ~ ~-2 ~ {auto:0,SuccessCount:0b,Command:\\\"-Insert Command " + (cmds.length + 1) + "-\\\"}\"},{id:commandblock_minecart,Command:\"setblock ~ ~1 ~ command_block 0 - {auto:1,Command:\\\"fill ~ ~-2 ~ ~ ~ ~ air\\\"}\"},{id:commandblock_minecart,Command:\"kill @e[type=commandblock_minecart,r=0]\"}]}";
		}
	}
	/*for (x = blocks.negativeLength; x < blocks.length; x++) {
		if (typeof blocks[x] == "undefined") continue;
		for (y = blocks[x].negativeLength; y < blocks[x].length; y++) {
			if (typeof blocks[x][y] == "undefined") continue;
			for (z = blocks[x][y].negativeLength; z < blocks[x][y].length; z++) {
				var cb = blocks[x][y][z];
				if (typeof cb == "undefined" || cb === null) continue;
				
				s = ",{id:commandblock_minecart,Command:" + cb.getCommand(x - blocks.negativeLength + xOffset, y - blocks[x].negativeLength + yOffset, z - blocks[x][y].negativeLength + zOffset) + "}";
				if (command.length + s.length + endSection.length < 32500)
				{
					command += s;
				}
				else
				{
					cmds[cmds.length] = command + endSection;
					command = "summon falling_block ~ ~.55 ~ {Time:1,DropItem:0,Block:redstone_block,Passengers:[{id:falling_block,Time:1,DropItem:0,Block:activator_rail}" + s;
					endSection = ",{id:commandblock_minecart,Command:\"blockdata ~ ~-2 ~ {auto:0,SuccessCount:0b,Command:\\\"-Insert Command " + (cmds.length + 1) + "-\\\"}\"},{id:commandblock_minecart,Command:\"setblock ~ ~1 ~ command_block 0 - {auto:1,Command:\\\"fill ~ ~-2 ~ ~ ~ ~ air\\\"}\"},{id:commandblock_minecart,Command:\"kill @e[type=commandblock_minecart,r=0]\"}]}";
				}
			}
		}
	}*/
	for (ec = 0; ec < postCommands.length; ec++) {
		if (postCommands[ec] == "" || postCommands[ec].startsWith("#"))
			continue;
		s = ",{id:commandblock_minecart,Command:" + format(postCommands[ec]) + "}";
		if (command.length + s.length + endSection.length < 32500) {
			command += s;
		}
		else {
			cmds[cmds.length] = command + endSection;
			command = "summon falling_block ~ ~.55 ~ {Time:1,DropItem:0,Block:redstone_block,Passengers:[{id:falling_block,Time:1,DropItem:0,Block:activator_rail}" + s;
			endSection = ",{id:commandblock_minecart,Command:\"blockdata ~ ~-2 ~ {auto:0,SuccessCount:0b,Command:\\\"-Insert Command " + (cmds.length + 1) + "-\\\"}\"},{id:commandblock_minecart,Command:\"setblock ~ ~1 ~ command_block 0 - {auto:1,Command:\\\"fill ~ ~-2 ~ ~ ~ ~ air\\\"}\"},{id:commandblock_minecart,Command:\"kill @e[type=commandblock_minecart,r=0]\"}]}";
		}
	}
	command += endFinal;
	cmds[cmds.length] = command;
	
	
	if (cmds.length === 1) cmdIndex = 0;
	document.getElementById("output-command-text").value = cmds[cmdIndex];
	
	if (cmds.length > 1) {
		document.getElementById("output-scroll-commands").className = "";
		document.getElementById("output-command-index").innerHTML = "Command " + (cmdIndex + 1);
	}
	else {
		document.getElementById("output-scroll-commands").className = "hide";
	}
}


function createNewProject(setup) {
	voxels = [];
	voxels[0] = [];
	voxels[0][0] = [];
	
	selectedVoxel = [];
	selectedVoxel[0] = 0;
	selectedVoxel[1] = 0;
	selectedVoxel[2] = 0;
	selectMesh.position.x = 0;
	selectMesh.position.y = 0;
	selectMesh.position.z = 0;
	
	preCommands = [""];
	postCommands = [""];
	
	xOffset = 0;
	yOffset = 1;
	zOffset = 3;
	
	if (setup) {
		voxels[0][0][0] = new CommandBlock();
		voxels[0][0][0].direction = 1;
		controls.target = new THREE.Vector3(0, 0, 0);
		camera.position.x = -3;
		camera.position.y = 2;
		camera.position.z = -3;
		updateStructure();
	}
}

function loadData(loadCode) {
	createNewProject(false);
	
	var xMin = 0;
	var xMax = 0;
	var yMin = 0;
	var yMax = 0;
	var zMin = 0;
	var zMax = 0;
	
	var loadVersion = "a-0";
	
	if (loadCode.startsWith("version:")) {
		loadVersion = loadCode.slice(8, loadCode.indexOf("\n"));
		loadCode = loadCode.slice(loadCode.indexOf("\n") + 1);
	}
	
	var loadChunks = loadCode.split("\n#");
	console.log(loadVersion);
	console.log(typeof(loadVersion));
	console.log("a-1");
	console.log(typeof("a-1"));
	console.log(loadVersion === "a-1");
	
	if (loadVersion === "a-0" || loadVersion === "a-1") {
		console.log("test");
		for (i = 0; i < loadChunks.length; i++) {
			if (loadChunks[i].startsWith("pre")) {
				var chunkLines = loadChunks[i].split("\n");
				for (ii = 1; ii < chunkLines.length; ii++)
				{
					if (chunkLines[ii].startsWith("-")) preCommands[ii - 1] = chunkLines[ii].slice(1);
				}
			}
			else if (loadChunks[i].startsWith("post")) {
				var chunkLines = loadChunks[i].split("\n");
				for (ii = 1; ii < chunkLines.length; ii++)
				{
					if (chunkLines[ii].startsWith("-")) postCommands[ii - 1] = chunkLines[ii].slice(1);
				}
			}
			else if (loadChunks[i].startsWith("cb")) {
				var cbTemp = new CommandBlock();
				var xTemp = 0;
				var yTemp = 0;
				var zTemp = 0;
				var xSet = false;
				var ySet = false;
				var zSet = false;
				var chunkLines = loadChunks[i].split("\n");
				for (ii = 1; ii < chunkLines.length; ii++)
				{
					if (chunkLines[ii].startsWith("cmd:"))
					{
						cbTemp.command = chunkLines[ii].slice(4);
					}
					else if (chunkLines[ii].startsWith("nbt:"))
					{
						cbTemp.nbt = chunkLines[ii].slice(4);
					}
					else if (chunkLines[ii] === "-")
					{
						if (xTemp < xMin) xMin = xTemp;
						else if (xTemp > xMax) xMax = xTemp;
						if (yTemp < yMin) yMin = yTemp;
						else if (yTemp > yMax) yMax = yTemp;
						if (zTemp < zMin) zMin = zTemp;
						else if (zTemp > zMax) zMax = zTemp;
						
						if (typeof voxels[xTemp] == "undefined" || voxels[xTemp] === null)
						{
							voxels[xTemp] = [];
							voxels[xTemp].negativeLength = 0;
						}
						if (typeof voxels[xTemp][yTemp] == "undefined" || voxels[xTemp][yTemp] === null)
						{
							voxels[xTemp][yTemp] = [];
							voxels[xTemp][yTemp].negativeLength = 0;
						}
						
						if (xTemp < 0)
						{
							if (voxels.negativeLength > xTemp) voxels.negativeLength = xTemp;
						}
						if (yTemp < 0)
						{
							if (voxels[xTemp].negativeLength > yTemp) voxels[xTemp].negativeLength = yTemp;
						}
						if (selectedVoxel[2] < 0)
						{
							if (voxels[xTemp][yTemp].negativeLength > zTemp) voxels[xTemp][yTemp].negativeLength = zTemp;
						}
						voxels[xTemp][yTemp][zTemp] = cbTemp.clone();
						cbTemp = new CommandBlock();
						xTemp = 0;
						yTemp = 0;
						zTemp = 0;
						xSet = false;
						ySet = false;
						zSet = false;
					}
					else
					{
						var cbData = chunkLines[ii].split(new RegExp('[\n|,]', 'g'));
						for (iii = 0; iii < cbData.length; iii++)
						{
							if (cbData[iii] * 1 > 0 || cbData[iii] * 1 <= 0)
							{
								if (!xSet)
								{
									xTemp = cbData[iii] * 1;
									xSet = true;
								}
								else if (!ySet)
								{
									yTemp = cbData[iii] * 1;
									ySet = true;
								}
								else if (!zSet)
								{
									zTemp = cbData[iii] * 1;
									zSet = true;
								}
							}
							else if (typeof loadValues[cbData[iii].toLowerCase()] == "undefined" || loadValues[cbData[iii].toLowerCase()] === null) continue;
							else
							{
								switch (loadValues[cbData[iii].toLowerCase()])
								{
									case "type_0":
										cbTemp.cbType = 0;
										break;
									case "type_1":
										cbTemp.cbType = 1;
										break;
									case "type_2":
										cbTemp.cbType = 2;
										break;
									case "cond":
										cbTemp.conditional = true;
										break;
									case "active":
										cbTemp.active = true;
										break;
									case "dir_0":
										cbTemp.direction = 0;
										break;
									case "dir_1":
										cbTemp.direction = 1;
										break;
									case "dir_2":
										cbTemp.direction = 2;
										break;
									case "dir_3":
										cbTemp.direction = 3;
										break;
									case "dir_4":
										cbTemp.direction = 4;
										break;
									case "dir_5":
										cbTemp.direction = 5;
										break;
									case "output":
										cbTemp.output = true;
										break;
									case "loop":
										cbTemp.updateLastExecution = false;
										break;
								}

							}
						}
					}
				}
			}
			else {
				var chunkLines = loadChunks[i].split(new RegExp('[\n|,]', 'g'));
				for (ii = 0; ii < chunkLines.length; ii++)
				{
					if (chunkLines[ii].startsWith("xOffset:")) xOffset = (chunkLines[ii].slice(8)) * 1;
					if (chunkLines[ii].startsWith("yOffset:")) yOffset = (chunkLines[ii].slice(8)) * 1;
					if (chunkLines[ii].startsWith("zOffset:")) zOffset = (chunkLines[ii].slice(8)) * 1;
				}
			}
		}
	}
	
	controls.target = new THREE.Vector3((xMax + xMin) / 2, (yMax + yMin) / 2, (zMax + zMin) / 2);
	
	updateStructure();
}

function getSaveData() {
	var saveCode = "version:" + EDITOR_VERSION;
	
	//saveCode += `\n\noff\n,,`;
	saveCode += "\n\npal";
	for (i = 0; i < paletteSlots.length; i++) {
		saveCode += "\n" + paletteSlots[i].value;
	}
	saveCode += "\n\n\nvox";
	for (x = xOffset; x < voxels.length; x++) {
		saveCode += "\n---";
		if (!voxels[x]) continue;
		for (y = yOffset; y < voxels[x].length; y++) {
			saveCode += "\n";
			if (!voxels[x][y]) continue;
			for (z = zOffset; z < voxels[x][y].length; z++) {
				var vox = voxels[x][y][z];
				if (vox)
				{
					saveCode += `${vox.paletteColor}`;
				}

				saveCode += ",";
			}
		}
	}
	
	return saveCode;
}

function download(filename, txt) {
	var elem = document.createElement('a');
	elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt));
	elem.setAttribute('download', filename);

	elem.style.display = 'none';
	document.body.appendChild(elem);

	elem.click();

	document.body.removeChild(elem);
}


function animate() {
	requestAnimationFrame(animate);
	controls.update();
	
	render();
}

function render() {
	renderer.render(scene, camera);
}
-->