let db = null;

var timeCategories = {};
var currentTime;

var timeSidebar, timeCategoryButtonsList, timer, timeName, categoryName;

var timerFunc;


function startTimerFunc() {
	stopTimerFunc();
	timerFunc = setInterval(updateTimer, 1000);
}

function stopTimerFunc() {
	if (timerFunc) clearInterval(timerFunc);
}

function updateTimer() {
	var timeNow = new Date();
	var timeDiff = Math.floor(timeNow.valueOf() / 1000) - Math.floor(currentTime.startTime.valueOf() / 1000);
	timer.innerText = `${Math.floor(timeDiff / 3600)}h ${Math.floor(timeDiff / 60 % 60)}m ${timeDiff % 60}s`;
}

function clearCategoryName() {
	categoryName.value = "";
}

function createCategoryAndTime() {
	addNewTime(categoryName.value);
}

function initTracker() {
	initDB();

	timeSidebar = document.querySelector(".time-sidebar");
	timeCategoryButtonsList = document.querySelector(".time-category-buttons-list");
	timer = document.getElementById("timer-display");
	timeName = document.getElementById("time-name");
	categoryName = document.getElementById("category-name");

	window.addEventListener('hashchange', changePane);
	changePane();
}

function changePane(e) {
	var hash;
	if (!location.hash) hash = "main";
	else hash = location.hash.slice(1).toLowerCase();
	var activePane = document.querySelector(".pane-active");
	if (activePane) activePane.classList.remove("pane-active");
	var newPane = document.getElementById(hash);
	if (newPane.classList.contains("pane")) newPane.classList.add("pane-active");
}

function resetTimeCategoryButtons() {
	timeCategoryButtonsList.innerHTML = "";
	for (var key in timeCategories) {
		timeCategoryButtonsList.innerHTML += `<a href="#track" class="button button-time-category" style="order: -${measureTotalSeconds(key)};" onclick="addNewTime('${key}');">${key}</a>`;
	}
}

function resetTimeSidebar() {
	timeSidebar.innerHTML = "";
	for (var key in timeCategories) {
		timeSidebar.innerHTML += `<div class="time-sidebar-item" data-category="${key}" style="order: ${measureTotalSeconds(key)}; flex-grow: ${measureTotalSeconds(key)}">${key}</div>`;
	}
	updateSidebarColors();
}

function updateCategoryInSidebar(category) {
	var catBar = timeSidebar.querySelector(`.time-sidebar-item[data-category="${category}"]`);
	catBar.style.order = `${measureTotalSeconds(category)}`;
	catBar.style.flexGrow = `${measureTotalSeconds(category)}`;
	updateSidebarColors();
}

function updateSidebarColors() {
	var timeSidebarList = Array.from(timeSidebar.children);
	timeSidebarList.sort(function (a, b) { return (a.style.order * 1) - (b.style.order * 1) });

	for (var i = 0; i < timeSidebarList.length; i++) {
		timeSidebarList[i].style.borderColor = `rgba(0, 0, 0, ${i / 10 + 0.1})`;
    }
}

function measureTotalSeconds(category) {
	var timeCat = timeCategories[category].times;
	var totalSeconds = 0;

	timeCat.forEach(function (cur) {
		totalSeconds += (Math.floor(cur.endTime.valueOf() / 1000) - Math.floor(cur.startTime.valueOf() / 1000));
	});

	return totalSeconds;
}

function addTimeCategory(category) {
	timeCategories[category] = { title: category, times: [] };
	resetTimeSidebar();
	resetTimeCategoryButtons();
}

function addNewTime(category, name = "", startTime = new Date()) {
	if (!timeCategories[category]) {
		addTimeCategory(category);
	}
	timeCategories[category].times.push({ name, startTime });
	currentTime = { category, startTime, index: timeCategories[category].times.length - 1 };
	updateCategoryInDB(category);
	timeName.value = "";
	setTimeout(function () { timeName.focus(); }, 400);
	timer.innerText = "0h 0m 0s";
	startTimerFunc();
}

function endCurrentTime(endTime = new Date()) {
	if (currentTime) {
		var curTime = timeCategories[currentTime.category].times[currentTime.index];
		curTime.name = timeName.value;
		curTime.endTime = endTime;
		var timeDiff = Math.floor(curTime.endTime.valueOf() / 1000) - Math.floor(curTime.startTime.valueOf() / 1000);
		console.log(`Tracked ${Math.floor(timeDiff / 3600)} hours, ${Math.floor(timeDiff / 60 % 60)} minutes, ${timeDiff % 60} seconds`);
		updateCategoryInDB(currentTime.category);
		updateCategoryInSidebar(currentTime.category);
		clearCurrentTime();
		stopTimerFunc();
	}
}

function clearCurrentTime() {
	currentTime = null;
}

function initDB() {
	const dbName = "time_tracker";
	const dbVersion = "1";

	const request = indexedDB.open(dbName, dbVersion);

	// on upgrade needed - runs when the db updates (you access it with a newer version than is stored)
	request.onupgradeneeded = e => {
		db = e.target.result;
		console.log("upgrade is called");
		console.log(db);

		// create an object store (kind of like an array in the db) with a key (like an identifier - unique for each item)
		// object stores can only be created during an upgrade (version change)
		const coreData = db.createObjectStore("core_data", { keyPath: "title" });
		const timeRecords = db.createObjectStore("time_records", { keyPath: "title" });
		const otherData = db.createObjectStore("other_data", { keyPath: "title" });
	};

	// on success - runs when you successfully access the database
	request.onsuccess = e => {
		db = e.target.result;
		console.log("database accessed successfully");
		loadTimesFromDB();
	};

	// on error
	request.onerror = e => {
		console.log("DATABASE ERROR: " + e.target.error.message);
	};
}

// pulls all the times stored in the database and loads them into an array
function loadTimesFromDB() {
	const tx = db.transaction("time_records", "readonly");
	const timeRecords = tx.objectStore("time_records");
	const request = timeRecords.openCursor();
	request.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	request.onsuccess = e => {
		const cursor = e.target.result;

		if (cursor) {
			// process the data here

			timeCategories[cursor.key] = cursor.value;

			cursor.continue(); // moves the cursor forward, calling onsuccess again
		}
		else {
			resetTimeSidebar();
			resetTimeCategoryButtons();
        }
	};
}

// add a new time (a new entry in the object store)
function addTimeToDB(timeObject) {
	// create a 'readwrite' transaction, allowing us to edit the object store
	const tx = db.transaction("time_records", "readwrite");
	tx.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	//tx.oncomplete = e => console.log(e);
	const timeRecords = tx.objectStore("time_records");
	const request = timeRecords.add(timeObject);
}

// update one category in the DB to match the array
function updateCategoryInDB(category) {
	const tx = db.transaction("time_records", "readwrite");
	tx.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	//tx.oncomplete = e => console.log(e);
	const timeRecords = tx.objectStore("time_records");

	const request = timeRecords.put(timeCategories[category]);
}

// update the times in the DB to match the array
function updateAllTimesInDB() {
	const tx = db.transaction("time_records", "readwrite");
	tx.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	//tx.oncomplete = e => console.log(e);
	const timeRecords = tx.objectStore("time_records");

	for (var key in timeCategories) {
		const request = timeRecords.put(timeCategories[key]);
	}
}

// delete a note (an entry in the object store)
function deleteTimeCategory(category) {
	delete timeCategories[category];

	const tx = db.transaction("time_records", "readwrite");
	tx.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	tx.oncomplete = e => console.log(e);
	const timeRecords = tx.objectStore("time_records");

	const request = timeRecords.delete(category);
}