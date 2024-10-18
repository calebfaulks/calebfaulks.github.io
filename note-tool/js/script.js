const STAT_MISSED       = 1;
const STAT_IGNORED      = 2;
const STAT_COMPLETED    = 3;

const ITEM_ID                       = 1; // Unused
const ITEM_AGENDA                   = 2;
const ITEM_TIMEFRAME                = 3;
const ITEM_UPDATE_DETAILS           = 4;
const ITEM_DIGITAL_WALKTHROUGH      = 5;
const ITEM_RECAP                    = 6;
const ITEM_DD_SCRIPT                = 7;
const ITEM_EMAIL_SCRIPT             = 8;
const ITEM_AGR_SCRIPT               = 9;
const ITEM_QUOTE_VALID              = 10;
const ITEM_RECORDED                 = 11;
const ITEM_COVER_REVIEW             = 12;
const ITEM_CSS_TURNAROUND           = 13;
const ITEM_CRT_TURNAROUND           = 14;
const ITEM_CHANGE_SCRIPT            = 15;
const ITEM_CHANGE_ADV_WAITS         = 16;
const ITEM_CHANGE_ADV_PAYMENTS      = 17;
const ITEM_CARD_DELIVERY            = 18;
const ITEM_PROMOTE_DIGITAL_CARD     = 19;
const ITEM_SUSPENSION_ELIGIBILITY   = 20;
const ITEM_SUSPENSION_IMPACTS       = 21;
const ITEM_CB_CALLBACK              = 22;
const ITEM_CB_MESSAGE               = 23;
const ITEM_TAX_PREFILLED            = 24;
const ITEM_TAX_SELF                 = 25;

const ITEMS_END                     = 26;

let db = null;

let scheduleItems = [];

let checklistItems = [];
checklistItems[ITEM_ID] = {text: "Check ID"};
checklistItems[ITEM_AGENDA] = {text: "Clear agenda"};
checklistItems[ITEM_TIMEFRAME] = {text: "Timeframe"};
checklistItems[ITEM_UPDATE_DETAILS] = {text: "Check/update contact details"};
checklistItems[ITEM_DIGITAL_WALKTHROUGH] = {text: "Offer digital walkthrough"};
checklistItems[ITEM_RECAP] = {text: "Strong recap"};
checklistItems[ITEM_DD_SCRIPT] = {text: "DD script", required: true};
checklistItems[ITEM_EMAIL_SCRIPT] = {text: "Email script", required: true};
checklistItems[ITEM_AGR_SCRIPT] = {text: "AGR script", required: true};
checklistItems[ITEM_QUOTE_VALID] = {text: "Quote validity", required: true};
checklistItems[ITEM_RECORDED] = {text: "Call recorded disclaimer", required: true};
checklistItems[ITEM_COVER_REVIEW] = {text: "Cover review"};
checklistItems[ITEM_CSS_TURNAROUND] = {text: "CSS turnaround", required: true};
checklistItems[ITEM_CRT_TURNAROUND] = {text: "CRT turnaround", required: true};
checklistItems[ITEM_CHANGE_SCRIPT] = {text: "Cover change script", required: true};
checklistItems[ITEM_CHANGE_ADV_WAITS] = {text: "Cover change wait periods", required: true};
checklistItems[ITEM_CHANGE_ADV_PAYMENTS] = {text: "Cover change upcoming payments", required: true};
checklistItems[ITEM_CARD_DELIVERY] = {text: "Card delivery time", required: true};
checklistItems[ITEM_PROMOTE_DIGITAL_CARD] = {text: "Promote digital card"};
checklistItems[ITEM_SUSPENSION_ELIGIBILITY] = {text: "Suspension eligibility", required: true};
checklistItems[ITEM_SUSPENSION_IMPACTS] = {text: "Suspension impacts", required: true};
checklistItems[ITEM_CB_CALLBACK] = {text: "CB set callback"};
checklistItems[ITEM_CB_MESSAGE] = {text: "CB leave message"};
checklistItems[ITEM_TAX_PREFILLED] = {text: "Tax pre-filled", required: true};
checklistItems[ITEM_TAX_SELF] = {text: "Tax statement self-service", required: true};

let statsCompleted = [];
let statsMissed = [];
let statsIgnored = [];

let currentCall;

let callsArchive = [];

let updateMyNotes = false;

let memberName, idCheck, noteContent, extraNotes, checklist, clearButton, copySaveButton, notesArchive, scheduleSection, schedulePlusButton, statsTable, myNotes;

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
    statsTable = document.getElementById("stats-table");
    myNotes = document.getElementById("my-notes");
    let tabButtons = document.querySelectorAll(".tab-button");

    myNotes.addEventListener("change", myNotes_change, false);
    clearButton.addEventListener("click", clearCall, false);
    copySaveButton.addEventListener("click", copySaveButton_click, false);

    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].addEventListener("click", tabButton_click, false);
    }

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
    // If there's nothing to copy & save, don't run the function
    if (memberName.value == "" && idCheck.selectedIndex == 0 && noteContent.value == "") return;

    // If shift was held, dismiss everything in the checklist
    if (event.shiftKey) {
        dismissChecklist();
    }

    // Replace useless values with more useful ones
    if (memberName.value == "") memberName.value = "Unknown caller";
    let idText = ` - ${idCheck.children[idCheck.selectedIndex].innerText}`;
    if (!idText.includes("full ID")) idText = "";
    filterNoteContent();
    
    // Turn the member name, ID and notes into a single string, then copy it to the clipboard
    let finalNote = `${memberName.value}${idText}\n${noteContent.value}`;
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

function filterNoteContent() {
    noteContent.value = noteContent.value.replaceAll(", MUST READ DD SCRIPT", "")
    .replaceAll(", MUST READ EMAIL SCRIPT", "")
    .replaceAll(", MUST READ AGR SCRIPT", "")
    .replaceAll(", MUST ADV 30 DAYS", "")
    .replaceAll(", MUST ADV CSS TURNAROUND", "")
    .replaceAll(", MUST ADV CRT TURNAROUND", "")
    .replaceAll(", MUST READ CHANGE SCRIPT", "")
    .replaceAll(", MUST ADV WAITS", "")
    .replaceAll(", MUST ADV UPCOMING PAYMENTS", "")
    .replaceAll(", MUST ADV DELIVERY", "")
    .replaceAll(", MUST PROMOTE DIGITAL CARD", "")
    .replaceAll("\nMUST CHECK ELIGIBLE", "")
    .replaceAll(", MUST ADV IMPACTS", "")
    .replaceAll(", MUST RESET CALLBACK/LEAVE MESSAGE", "")
    .replaceAll("\nMUST ADV PRE-FILLED", "")
    .replaceAll(", MUST OFFER SELF-SERVICE", "");
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

function removeChecklistItem(item, complete) {
    let checklistChildren = checklist.children;

    for (let i = checklistChildren.length - 1; i >= 0; i--) {
        if (checklistChildren[i].querySelector("span").innerText == checklistItems[item].text) {
            checklist.removeChild(checklistChildren[i]);
            if (complete) currentCall.callStats[item] = STAT_COMPLETED;
            else currentCall.callStats[item] = undefined;
            break;
        }
    }
}

function addCallToArchive(call) {
    callsArchive.push(call);
    document.querySelector(".notes-archive-heading").innerText = `${callsArchive.length} Calls`;
    let idText = ` - ${idCheck.children[call.callID].innerText}`;
    if (!idText.includes("full ID")) idText = "";
    notesArchive.innerHTML = `
    <p class="archived-note">${call.callMemberName}${idText}<br>
    ${call.callNotes}</p>
    ${notesArchive.innerHTML}`
    addCallToStats(call);
}

function addCallToStats(call) {
    for (let i = 0; i < ITEMS_END; i++) {
        switch (call.callStats[i]) {
            case STAT_COMPLETED:
                if (!statsCompleted[i]) statsCompleted[i] = 0;
                statsCompleted[i]++;
                break;
            case STAT_MISSED:
                if (!statsMissed[i]) statsMissed[i] = 0;
                statsMissed[i]++;
                break;
            case STAT_IGNORED:
                if (!statsIgnored[i]) statsIgnored[i] = 0;
                statsIgnored[i]++;
                break;
            default:
                break;
        }
    }

    updateStatsTable();
}

function updateStatsTable() {
    statsTable.innerHTML = "";

    for (let i = 0; i < ITEMS_END; i++) {
        if (statsCompleted[i] || statsMissed[i] || statsIgnored[i]) {
            if (!statsCompleted[i]) statsCompleted[i] = 0;
            if (!statsMissed[i]) statsMissed[i] = 0;
            if (!statsIgnored[i]) statsIgnored[i] = 0;
            let quality = statsCompleted[i] / (statsCompleted[i] + statsMissed[i]) * 100;
            if (!quality) quality = 0;
            quality = Math.round(quality);
            statsTable.innerHTML += `
            <tr>
                <td>${checklistItems[i].text}</td>
                <td>${statsCompleted[i]}</td>
                <td>${statsMissed[i]}</td>
                <td>${statsIgnored[i]}</td>
                <td>${quality}%</td>
            </tr>`;
        }
    }
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
    scheduleSection.removeChild(element.parentElement);
    let scheduleElements = scheduleSection.children;

    for (let i = 0; i < scheduleElements.length - 1; i++) {
        let iTime = new Date(new Date().toString().slice(0, 16) + scheduleElements[i].querySelector(".time-picker").value);
        if (iTime.valueOf() >= itemTime.valueOf()) {
            scheduleSection.insertBefore(tempScheduleItem, scheduleElements[i]);
            updateScheduleInDB();
            return;
        }
    }

    scheduleSection.insertBefore(tempScheduleItem, scheduleSection.querySelector(".plus-button"));
    updateScheduleInDB();
}

function tabButton_click(event) {
    let element = event.target;
    let tabsHeadings = element.closest(".tabs-headings");
    let tabsContainer = tabsHeadings.nextElementSibling;

    tabsHeadings.querySelector(".tab-active").classList.remove("tab-active");
    tabsContainer.querySelector(".tab-active").classList.remove("tab-active");

    for (let i = 0; i < tabsHeadings.children.length; i++) {
        if (tabsHeadings.children[i] === element) {
            element.classList.add("tab-active");
            tabsContainer.children[i].classList.add("tab-active");
        }
    }
}


function genericButtonEvent(element, addText, ...addChecks) {
    if (noteContent.value != "") noteContent.value += "\n"
    let addStart = noteContent.value.length;
    noteContent.value += addText.replaceAll("|", "");
    if (addText.includes("|")) {
        let firstChar = addText.indexOf("|")
        noteContent.selectionStart = addStart + firstChar;
        noteContent.selectionEnd = addStart + addText.indexOf("|", firstChar + 1) - 1;
    }
    noteContent.value = noteContent.value.replaceAll(", digital card\nWalked through using digital card", "\nWalked through using digital card");
    noteContent.focus();

    for (let i = 0; i < addChecks.length; i++) {
        if (addChecks[i]) addChecklistItem(addChecks[i]);
    }
}


function myNotes_change(event) {
    if (updateMyNotes) return;
    updateMyNotes = true;
    setTimeout(storeMyNotesToDB, 1000);
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
            case ITEM_COVER_REVIEW:
                if (!noteContent.value.toLowerCase().includes("cover review")) noteContent.value += "\nCover review";
                break;
            case ITEM_CSS_TURNAROUND:
                noteContent.value = noteContent.value.replaceAll("MUST ADV CSS TURNAROUND", "adv next working day call back");
                break;
            case ITEM_CRT_TURNAROUND:
                noteContent.value = noteContent.value.replaceAll("MUST ADV CRT TURNAROUND", "adv turnaround");
                break;
            case ITEM_CHANGE_SCRIPT:
                noteContent.value = noteContent.value.replaceAll("MUST READ CHANGE SCRIPT", "read script");
                break;
            case ITEM_CHANGE_ADV_WAITS:
                noteContent.value = noteContent.value.replaceAll("MUST ADV WAITS", "adv waits");
                noteContent.value = noteContent.value.replaceAll("adv waits, adv upcoming payments", "adv waits & upcoming payments");
                break;
            case ITEM_CHANGE_ADV_PAYMENTS:
                noteContent.value = noteContent.value.replaceAll("MUST ADV UPCOMING PAYMENTS", "adv upcoming payments");
                noteContent.value = noteContent.value.replaceAll("adv waits, adv upcoming payments", "adv waits & upcoming payments");
                break;
            case ITEM_CARD_DELIVERY:
                noteContent.value = noteContent.value.replaceAll("MUST ADV DELIVERY", "adv 7-14 days delivery");
                noteContent.value = noteContent.value.replaceAll("adv 7-14 days delivery, promoted digital card", "adv 7-14 days delivery, digital card");
                break;
            case ITEM_PROMOTE_DIGITAL_CARD:
                noteContent.value = noteContent.value.replaceAll("MUST PROMOTE DIGITAL CARD", "promoted digital card");
                noteContent.value = noteContent.value.replaceAll("adv 7-14 days delivery, promoted digital card", "adv 7-14 days delivery, digital card");
                break;
            case ITEM_SUSPENSION_ELIGIBILITY:
                noteContent.value = noteContent.value.replaceAll("MUST CHECK ELIGIBLE", "Confirmed eligible");
                break;
            case ITEM_SUSPENSION_IMPACTS:
                noteContent.value = noteContent.value.replaceAll("MUST ADV IMPACTS", "adv impacts");
                break;
            case ITEM_CB_CALLBACK:
                noteContent.value = noteContent.value.replaceAll("MUST RESET CALLBACK/LEAVE MESSAGE", "set callback");
                removeChecklistItem(ITEM_CB_MESSAGE);
                break;
            case ITEM_CB_MESSAGE:
                noteContent.value = noteContent.value.replaceAll("MUST RESET CALLBACK/LEAVE MESSAGE", "left message to call us back");
                removeChecklistItem(ITEM_CB_CALLBACK);
                break;
            case ITEM_TAX_PREFILLED:
                noteContent.value = noteContent.value.replaceAll("MUST ADV PRE-FILLED", "adv pre-filled");
                break;
            case ITEM_TAX_SELF:
                noteContent.value = noteContent.value.replaceAll("MUST OFFER SELF-SERVICE", "walked through downloading statement online");
                break;
            default:
                break;
        }

        currentCall.callStats[index] = STAT_COMPLETED;
    }
    else {
        currentCall.callStats[index] = STAT_IGNORED;
        switch (index) {
            case ITEM_TAX_SELF:
                noteContent.value = noteContent.value.replaceAll("MUST OFFER SELF-SERVICE", "member declined self-service\nSent to member");
                currentCall.callStats[index] = STAT_COMPLETED;
                break;
            default:
                break;
        }
    }
    
    element.parentElement.outerHTML = "";
}

function dismissChecklist() {
    let xButtons = checklist.querySelectorAll(".x-button");
    for (let i = 0; i < xButtons.length; i++) {
        xButtons[i].click();
    }
}



// Database functions

function initDB() {
	const dbName = "note_tool";
	const dbVersion = "2";

	const request = indexedDB.open(dbName, dbVersion);

	// on upgrade needed - runs when the db updates (you access it with a newer version than is stored)
	request.onupgradeneeded = e => {
		db = e.target.result;
		console.log("upgrade is called");
		console.log(db);

		// create an object store (kind of like an array in the db) with a key (like an identifier - unique for each item)
		// object stores can only be created during an upgrade (version change)
		//const coreData = db.createObjectStore("core_data", { keyPath: "title" });
		try {
            const scheduleInfo = db.createObjectStore("schedule_info");
        } catch (error) {} 
		try {
            const otherData = db.createObjectStore("other_data");
        } catch (error) {}
	};

	// on success - runs when you successfully access the database
	request.onsuccess = e => {
		db = e.target.result;
		loadScheduleFromDB();
        loadMyNotesFromDB();
	};

	// on error
	request.onerror = e => {
		console.log("DATABASE ERROR: " + e.target.error.message);
	};
}

// Pulls the schedule stored in the database and loads it into an array
function loadScheduleFromDB() {
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
        }
	};
}

function loadMyNotesFromDB() {
	const tx = db.transaction("other_data", "readonly");
	const otherData = tx.objectStore("other_data");
	const request = otherData.openCursor();
	request.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	request.onsuccess = e => {
		const cursor = e.target.result;

		if (cursor) {
			// Process the data here

			if (cursor.key == "my_notes") {
                updateMyNotes = true;
                myNotes.value = cursor.value;
                updateMyNotes = false;
            }

			cursor.continue(); // moves the cursor forward, calling onsuccess again
		}
		else {
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

function storeMyNotesToDB() {
	updateMyNotes = false;

    const tx = db.transaction("other_data", "readwrite");
	tx.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	const otherData = tx.objectStore("other_data");
	const request = otherData.put(myNotes.value, "my_notes");
}