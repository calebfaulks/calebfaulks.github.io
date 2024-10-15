const STAT_MISSED = 1;
const STAT_IGNORED = 2;
const STAT_COMPLETED = 3;

const ITEM_ID = 1;
const ITEM_AGENDA = 2;
const ITEM_TIMEFRAME = 3;
const ITEM_UPDATE_DETAILS = 4;
const ITEM_DIGITAL_WALKTHROUGH = 5;
const ITEM_RECAP = 6;
const ITEM_DD_SCRIPT = 7;
const ITEM_EMAIL_SCRIPT = 8;
const ITEM_AGR_SCRIPT = 9;
const ITEM_QUOTE_VALID = 10;
const ITEM_RECORDED = 11;
const ITEM_COVER_REVIEW = 12;
const ITEM_CSS_TURNAROUND = 13;
const ITEM_CRT_TURNAROUND = 14;
const ITEM_CHANGE_SCRIPT = 15;
const ITEM_CHANGE_ADV_WAITS = 16;
const ITEM_CHANGE_ADV_PAYMENTS = 17;
const ITEM_CARD_DELIVERY = 18;
const ITEM_PROMOTE_DIGITAL_CARD = 19;

let db = null;

let scheduleItems = [];

let checklistItems = [];
checklistItems[ITEM_ID] = {text: "Check ID"};
checklistItems[ITEM_AGENDA] = {text: "Clear agenda"};
checklistItems[ITEM_TIMEFRAME] = {text: "Timeframe"};
checklistItems[ITEM_UPDATE_DETAILS] = {text: "Check/update contact details"};
checklistItems[ITEM_DIGITAL_WALKTHROUGH] = {text: "Offer digital walkthrough"};
checklistItems[ITEM_RECAP] = {text: "Strong recap"};
checklistItems[ITEM_DD_SCRIPT] = {text: "DD script"};
checklistItems[ITEM_EMAIL_SCRIPT] = {text: "Email script"};
checklistItems[ITEM_AGR_SCRIPT] = {text: "AGR script"};
checklistItems[ITEM_QUOTE_VALID] = {text: "Quote validity"};
checklistItems[ITEM_RECORDED] = {text: "Call recorded disclaimer"};
checklistItems[ITEM_COVER_REVIEW] = {text: "Cover review"};
checklistItems[ITEM_CSS_TURNAROUND] = {text: "CSS turnaround"};
checklistItems[ITEM_CRT_TURNAROUND] = {text: "CRT turnaround"};
checklistItems[ITEM_CHANGE_SCRIPT] = {text: "Cover change script"};
checklistItems[ITEM_CHANGE_ADV_WAITS] = {text: "Cover change wait periods"};
checklistItems[ITEM_CHANGE_ADV_PAYMENTS] = {text: "Cover change upcoming payments"};
checklistItems[ITEM_CARD_DELIVERY] = {text: "Card delivery time"};
checklistItems[ITEM_PROMOTE_DIGITAL_CARD] = {text: "Promote digital card"};

let currentCall;

let callsArchive = [];

let memberName, idCheck, noteContent, extraNotes, checklist, clearButton, copySaveButton, notesArchive, scheduleSection, schedulePlusButton;

function initScript() {
    timeStart = new Date();
    timeBreakMorning = new Date();
    timeBreakLunch = new Date();
    timeBreakAfternoon = new Date();
    timeFinish = new Date();

    memberName = document.getElementById("member-name");
    idCheck = document.getElementById("id-check");
    noteContent = document.getElementById("note-content");
    extraNotes = document.getElementById("extra-notes");
    checklist = document.getElementById("checklist");
    clearButton = document.getElementById("clear-button");
    copySaveButton = document.getElementById("copy-save-button");
    notesArchive = document.getElementById("notes-archive");
    scheduleSection = document.getElementById("schedule-section");
    schedulePlusButton = document.getElementById("schedule-plus-button");

    clearButton.addEventListener("click", clearCall, false);
    copySaveButton.addEventListener("click", copySaveButton_click, false);

    resetCurrentCall();
    resetChecklist();

    initDB();
}

function clearCall(event) {
    // Clear the inputs
    memberName.value = "";
    idCheck.selectedIndex = 0;
    noteContent.value = "";
    extraNotes.value = "";

    // Reset the call information and checklist
    resetCurrentCall();
    resetChecklist();
}

function copySaveButton_click(event) {
    if (memberName.value == "" && idCheck.selectedIndex == 0 && noteContent.value == "") return;
    
    // Turn the member name, ID and notes into a single string, then copy it to the clipboard
    let finalNote = `${memberName.value} - ${idCheck.children[idCheck.selectedIndex].innerText}\n${noteContent.value}`;
    navigator.clipboard.writeText(finalNote);

    // Store the call information in the archive
    currentCall.callMemberName = memberName.value;
    currentCall.callID = idCheck.selectedIndex;
    currentCall.callNotes = noteContent.value.replaceAll("\n", "<br>");
    addCallToArchive(currentCall);

    // Clear the interface
    clearCall();
}

function resetCurrentCall() {
    currentCall = {
        callStats: [],
        callMemberName: "",
        callID: 0,
        callNotes: ""
    };
}

function resetChecklist() {
    checklist.innerHTML = "";

    addChecklistItem(ITEM_ID);
    addChecklistItem(ITEM_AGENDA);
    addChecklistItem(ITEM_TIMEFRAME);
    addChecklistItem(ITEM_UPDATE_DETAILS);
    addChecklistItem(ITEM_DIGITAL_WALKTHROUGH);
    addChecklistItem(ITEM_RECAP);
}

function addChecklistItem(item) {
    if (currentCall.callStats[item]) return;

    currentCall.callStats[item] = STAT_MISSED;
    checklist.innerHTML += `
    <div class="checklist-item">
        <button class="tick-button" onclick="checklistItemTick(true, this, ${item})">Y</button>
        <button class="x-button" onclick="checklistItemTick(false, this, ${item})">N</button>
        <span>${checklistItems[item].text}</span>
    </div>`;
}

function removeChecklistItem(item) {
    let checklistChildren = checklist.children;

    for (let i = checklistChildren.length - 1; i >= 0; i--) {
        if (checklistChildren[i].querySelector("span").innerText == checklistItems[item].text) {
            checklist.removeChild(checklistChildren[i]);
            currentCall.callStats[item] = undefined;
            break;
        }
    }
}

function addCallToArchive(call) {
    callsArchive.push(call);
    document.querySelector(".notes-archive-heading").innerText = `${callsArchive.length} Calls`;
    notesArchive.innerHTML = `
    <p class="archived-note">${call.callMemberName} - 
    ${idCheck.children[call.callID].innerText}<br>
    ${call.callNotes}</p>
    ${notesArchive.innerHTML}`
}


function addScheduleItem(element) {
    element.outerHTML = `
    <div class="schedule-item">
        <button class="minus-button" onclick="removeScheduleItem(this)">-</button><input type="time" class="time-picker" value="12:00" onchange="updateScheduleOrder(this)"><input class="schedule-item-name"  type="text" value="New Item" onchange="updateScheduleInDB()">
    </div>
    ${element.outerHTML}`;
    schedulePlusButton = document.getElementById("schedule-plus-button");
}

function loadScheduleItem(item) {
    schedulePlusButton.outerHTML = `
    <div class="schedule-item">
        <button class="minus-button" onclick="removeScheduleItem(this)">-</button><input type="time" class="time-picker" value="${item.time}" onchange="updateScheduleOrder(this)"><input class="schedule-item-name" type="text" value="${item.name}" onchange="updateScheduleInDB()">
    </div>
    ${schedulePlusButton.outerHTML}`;
    schedulePlusButton = document.getElementById("schedule-plus-button");
}

function removeScheduleItem(element) {
    element.parentElement.outerHTML = "";
    updateScheduleInDB(true);
}

function updateScheduleOrder(element) {
    let itemTime = new Date(new Date().toString().slice(0, 16) + element.value);
    let tempScheduleItem = element.parentElement.cloneNode(true);
    let parentContainer = element.closest(".collapsible-inner");
    parentContainer.removeChild(element.parentElement);
    let scheduleElements = parentContainer.children;

    for (let i = 0; i < scheduleElements.length - 1; i++) {
        let iTime = new Date(new Date().toString().slice(0, 16) + scheduleElements[i].querySelector(".time-picker").value);
        if (iTime.valueOf() >= itemTime.valueOf()) {
            parentContainer.insertBefore(tempScheduleItem, scheduleElements[i]);
            updateScheduleInDB();
            return;
        }
    }

    parentContainer.insertBefore(tempScheduleItem, parentContainer.querySelector(".plus-button"));
    updateScheduleInDB();
}


function genericButtonEvent(element, addText, addCheck, addSecondCheck, addThirdCheck) {
    if (noteContent.value != "") noteContent.value += "\n"
    noteContent.value += addText;
    if (addCheck) addChecklistItem(addCheck);
    if (addSecondCheck) addChecklistItem(addSecondCheck);
    if (addThirdCheck) addChecklistItem(addThirdCheck);
}


// Checklist button functions

function checklistItemTick(tick, element, index) {
    if (tick) {
        switch (index) {
            case ITEM_ID:
                idCheck.selectedIndex = 1;
                break;
        
            case ITEM_DD_SCRIPT:
                noteContent.value = noteContent.value.replaceAll("MUST READ DD SCRIPT", "read script");
                break;
            case ITEM_EMAIL_SCRIPT:
                noteContent.value = noteContent.value.replaceAll("MUST READ EMAIL SCRIPT", "read script");
                break;
            case ITEM_AGR_SCRIPT:
                noteContent.value = noteContent.value.replaceAll("MUST READ AGR SCRIPT", "read script");
                break;
            case ITEM_QUOTE_VALID:
                noteContent.value = noteContent.value.replaceAll("MUST ADV 30 DAYS", "adv valid 30 days unless claiming");
                break;
            // Add remaining check buttons
            default:
                break;
        }

        currentCall.callStats[index] = STAT_COMPLETED;
    }
    else currentCall.callStats[index] = STAT_IGNORED;
    
    element.parentElement.outerHTML = "";
}



// Database functions

function initDB() {
	const dbName = "note_tool";
	const dbVersion = "1";

	const request = indexedDB.open(dbName, dbVersion);

	// on upgrade needed - runs when the db updates (you access it with a newer version than is stored)
	request.onupgradeneeded = e => {
		db = e.target.result;
		console.log("upgrade is called");
		console.log(db);

		// create an object store (kind of like an array in the db) with a key (like an identifier - unique for each item)
		// object stores can only be created during an upgrade (version change)
		//const coreData = db.createObjectStore("core_data", { keyPath: "title" });
		const scheduleInfo = db.createObjectStore("schedule_info");
		//const otherData = db.createObjectStore("other_data", { keyPath: "title" });
	};

	// on success - runs when you successfully access the database
	request.onsuccess = e => {
		db = e.target.result;
		//console.log("database accessed successfully");
		loadDataFromDB();
	};

	// on error
	request.onerror = e => {
		console.log("DATABASE ERROR: " + e.target.error.message);
	};
}

// Pulls the schedule stored in the database and loads it into an array
function loadDataFromDB() {
	const tx = db.transaction("schedule_info", "readonly");
	const scheduleInfo = tx.objectStore("schedule_info");
	const request = scheduleInfo.openCursor();
	request.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	request.onsuccess = e => {
		const cursor = e.target.result;

		if (cursor) {
			// Process the data here

			scheduleItems[cursor.key] = cursor.value;
            loadScheduleItem(cursor.value);

			cursor.continue(); // moves the cursor forward, calling onsuccess again
		}
		else {
			//resetTimeSidebar();
			//resetTimeCategoryButtons();
        }
	};
}

// Update the schedule in the DB to match the array
function updateScheduleInDB(clearDB) {
	const tx = db.transaction("schedule_info", "readwrite");
	tx.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	//tx.oncomplete = e => console.log(e);
	const scheduleInfo = tx.objectStore("schedule_info");

    if (clearDB) scheduleInfo.clear();

    scheduleItems = [];
    let scheduleItemElements = scheduleSection.querySelectorAll(".schedule-item");
	for (let i = 0; i < scheduleItemElements.length; i++) {
        let itemTime = scheduleItemElements[i].querySelector(".time-picker").value;
        let itemName = scheduleItemElements[i].querySelector(".schedule-item-name").value;
        scheduleItems[i] = {time: itemTime, name: itemName};
		const request = scheduleInfo.put(scheduleItems[i], i);
	}
}