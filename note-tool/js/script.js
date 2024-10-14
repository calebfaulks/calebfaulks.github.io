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
checklistItems[ITEM_COVER_REVIEW] = {text: "Cover Review"};

let currentCall;

let callsArchive = [];

let memberName, idCheck, noteContent, extraNotes, checklist, clearButton, copySaveButton, notesArchive;

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

    clearButton.addEventListener("click", clearCall, false);
    copySaveButton.addEventListener("click", copySaveButton_click, false);

    resetCurrentCall();
    resetChecklist();
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
    notesArchive.innerHTML = `
    <p class="archived-note">${call.callMemberName} - 
    ${idCheck.children[call.callID].innerText}<br>
    ${call.callNotes}</p>
    ${notesArchive.innerHTML}`
}


function addScheduleItem(element) {
    element.outerHTML = `
    <div class="schedule-item">
        <button class="minus-button" onclick="removeScheduleItem(this)">-</button><input type="time" class="time-picker" value="12:00" onchange="updateScheduleOrder(this)"><input type="text" value="New Item">
    </div>
    ${element.outerHTML}`;
}

function removeScheduleItem(element) {
    element.parentElement.outerHTML = "";
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
            return;
        }
    }

    parentContainer.insertBefore(tempScheduleItem, parentContainer.querySelector(".plus-button"));
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
            default:
                break;
        }

        currentCall.callStats[index] = STAT_COMPLETED;
    }
    else currentCall.callStats[index] = STAT_IGNORED;
    
    element.parentElement.outerHTML = "";
}