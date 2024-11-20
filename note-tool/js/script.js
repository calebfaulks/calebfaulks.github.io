const STAT_MISSED       = 1;
const STAT_IGNORED      = 2;
const STAT_COMPLETED    = 3;

// Button categories
const CATEGORY_UPDATE       = 1;
const CATEGORY_CLAIM        = 2;
const CATEGORY_COVER        = 3;
const CATEGORY_PAYMENT      = 4;
const CATEGORY_DEPENDANT    = 5;
const CATEGORY_POLICY       = 6;
const CATEGORY_CALL         = 7;
const CATEGORY_TRANS_LOG    = 8;
const CATEGORY_HOSPITAL     = 9;

const ITEM_ID                       = 1;
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
const ITEM_QUOTE_TIER               = 26;
const ITEM_DIGI_COVER_CHECK         = 27;
const ITEM_NAME_CONFIRM_MEDICARE    = 28;
const ITEM_NAME_LOG_PAT             = 29;
const ITEM_NAME_CARDS               = 30;
const ITEM_HOSP_ENGAGE              = 31;
const ITEM_HOSP_BREAKDOWN           = 32;
const ITEM_HOSP_DISCOVERY           = 33;
const ITEM_HOSP_CONFIRM_INFO        = 34;
const ITEM_HOSP_CONFIRM_COVERED     = 35;
const ITEM_HOSP_CONFIRM_EXCESS      = 36;
const ITEM_HOSP_CHECK_PSYCH_REHAB   = 37;
const ITEM_HOSP_WARN_OOPS           = 38;
const ITEM_HOSP_RECOMMEND_IFC       = 39;
const ITEM_HOSP_WRAP                = 40;
const ITEM_HOSP_MED_RATE            = 41;
const ITEM_HOSP_MED_IFC             = 42;
const ITEM_HOSP_MED_OOPS            = 43;
const ITEM_HOSP_MED_MEDIGAP         = 44;
const ITEM_HOSP_APR_RATE            = 45;
const ITEM_HOSP_APR_OOPS            = 46;
const ITEM_HOSP_APR_IFC             = 47;
const ITEM_HOSP_APR_MEDIGAP         = 48;
const ITEM_HOSP_APR_PATH_RAD        = 49;
const ITEM_HOSP_MED_APR_WRAP        = 50;
const ITEM_HOSP_OFFER_CLAIM         = 51;
const ITEM_HOSP_CLAIM_AUTO          = 52;
const ITEM_HOSP_CLAIM_MEDIGAP       = 53;
const ITEM_HOSP_CLAIM_TWOWAY        = 54;
const ITEM_HOSP_OUTCOME_WRAP        = 55;
const ITEM_HOSP_INFO_MEDIGAP        = 56;
const ITEM_HOSP_INFO_IFC            = 57;
const ITEM_HOSP_INFO_AFTER_REHAB    = 58;
const ITEM_HOSP_INFO_DIGI           = 59;
const ITEM_HOSP_INFO_MYGOV          = 60;
const ITEM_HOSP_NC_UPGRADE          = 61;
const ITEM_HOSP_NC_SOLVE            = 62;
const ITEM_HOSP_WAIT_DATE           = 63;
const ITEM_HOSP_WAIT_DELAY          = 64;
const ITEM_HOSP_WAIT_SOLVE          = 65;
const ITEM_HOSP_CHECK_RECAP         = 66;
const ITEM_HOSP_CHECK_SEND_LINK     = 67;
const ITEM_HOSP_CHECK_WRAP          = 68;
const ITEM_HOSP_WISH_WELL           = 69;
const ITEM_MAIL_CLAIM_WARNING       = 70;
const ITEM_MAIL_CLAIM_FORM          = 71;
const ITEM_MAIL_CLAIM_WALKTHROUGH   = 72;

const ITEMS_END                     = 73;

// Official process guide processes
const PROCESS_ANCIL         = 1;
const PROCESS_ANCIL_CLAIM   = 2;
const PROCESS_AMB_ENQUIRY   = 3;
const PROCESS_AMB_CLAIM     = 4;
const PROCESS_WELCOME_CALL  = 5;
const PROCESS_COVER_ENQUIRY = 6;
const PROCESS_COVER_REVIEW  = 7;
const PROCESS_COVER_CHANGE  = 8;
const PROCESS_CANCELLATION  = 9;
const PROCESS_QUOTE         = 10;
const PROCESS_UPDATE_DD     = 11;
const PROCESS_ONE_PAYMENT   = 12;
const PROCESS_REFUND        = 13;
const PROCESS_DEP_ADD       = 14;
const PROCESS_DEP_REMOVE    = 15;
const PROCESS_SUSPENSION    = 16;
const PROCESS_RESUMPTION    = 17;
const PROCESS_CARD_PROBLEM  = 18;
const PROCESS_PENSION_CARD  = 19;
const PROCESS_LOGIN_PROBLEM = 20;

// Official process guide processes - hospital
const PROCESSES_START                   = 500;

const PROCESS_HOSP_CHECK_START          = PROCESSES_START + 1;
const PROCESS_HOSP_CHECK_COVERED_HOSP   = PROCESSES_START + 2;
const PROCESS_HOSP_CHECK_COVERED_MED    = PROCESSES_START + 3;
const PROCESS_HOSP_CHECK_COVERED_CLAIM  = PROCESSES_START + 4;
const PROCESS_HOSP_CHECK_INFO           = PROCESSES_START + 5;
const PROCESS_HOSP_CHECK_NOT_COVERED    = PROCESSES_START + 6;
const PROCESS_HOSP_CHECK_WAIT           = PROCESSES_START + 7;
const PROCESS_HOSP_CHECK_WRAP           = PROCESSES_START + 8;

const PROCESS_NAMES = [];
PROCESS_NAMES[PROCESS_HOSP_CHECK_START]         = "Hospital check";
PROCESS_NAMES[PROCESS_HOSP_CHECK_COVERED_HOSP]  = "Covered - hospital";
PROCESS_NAMES[PROCESS_HOSP_CHECK_COVERED_MED]   = "Covered - medical";
PROCESS_NAMES[PROCESS_HOSP_CHECK_COVERED_CLAIM] = "Covered - claiming";
PROCESS_NAMES[PROCESS_HOSP_CHECK_INFO]          = "More info required";
PROCESS_NAMES[PROCESS_HOSP_CHECK_NOT_COVERED]   = "Not covered";
PROCESS_NAMES[PROCESS_HOSP_CHECK_WAIT]          = "In waiting periods";
PROCESS_NAMES[PROCESS_HOSP_CHECK_WRAP]          = "Hospital check wrap-up";

//


const CHECKLIST_TRIGGERS = [];
CHECKLIST_TRIGGERS[PROCESS_ANCIL] = [];
CHECKLIST_TRIGGERS[PROCESS_ANCIL_CLAIM] = [];
CHECKLIST_TRIGGERS[PROCESS_AMB_ENQUIRY] = [];
CHECKLIST_TRIGGERS[PROCESS_AMB_CLAIM] = [];
CHECKLIST_TRIGGERS[PROCESS_WELCOME_CALL] = [];
CHECKLIST_TRIGGERS[PROCESS_COVER_ENQUIRY] = [];
CHECKLIST_TRIGGERS[PROCESS_COVER_REVIEW] = [];
CHECKLIST_TRIGGERS[PROCESS_COVER_CHANGE] = [];
CHECKLIST_TRIGGERS[PROCESS_CANCELLATION] = [];
CHECKLIST_TRIGGERS[PROCESS_QUOTE] = [];
CHECKLIST_TRIGGERS[PROCESS_UPDATE_DD] = [];
CHECKLIST_TRIGGERS[PROCESS_ONE_PAYMENT] = [];
CHECKLIST_TRIGGERS[PROCESS_REFUND] = [];
CHECKLIST_TRIGGERS[PROCESS_DEP_ADD] = [];
CHECKLIST_TRIGGERS[PROCESS_DEP_REMOVE] = [];
CHECKLIST_TRIGGERS[PROCESS_SUSPENSION] = [];
CHECKLIST_TRIGGERS[PROCESS_RESUMPTION] = [];
CHECKLIST_TRIGGERS[PROCESS_CARD_PROBLEM] = [];
CHECKLIST_TRIGGERS[PROCESS_PENSION_CARD] = [];
CHECKLIST_TRIGGERS[PROCESS_LOGIN_PROBLEM] = [];
CHECKLIST_TRIGGERS[PROCESS_HOSP_CHECK_START] = [ITEM_HOSP_ENGAGE, ITEM_HOSP_BREAKDOWN, ITEM_HOSP_DISCOVERY, ITEM_HOSP_CONFIRM_INFO];
CHECKLIST_TRIGGERS[PROCESS_HOSP_CHECK_COVERED_HOSP] = [ITEM_HOSP_CONFIRM_COVERED, ITEM_HOSP_CONFIRM_EXCESS, ITEM_HOSP_CHECK_PSYCH_REHAB, ITEM_HOSP_WARN_OOPS, ITEM_HOSP_RECOMMEND_IFC, ITEM_HOSP_WRAP];
CHECKLIST_TRIGGERS[PROCESS_HOSP_CHECK_COVERED_MED] = [ITEM_HOSP_MED_RATE, ITEM_HOSP_MED_IFC, ITEM_HOSP_MED_OOPS, ITEM_HOSP_MED_MEDIGAP, ITEM_HOSP_APR_RATE, ITEM_HOSP_APR_OOPS, ITEM_HOSP_APR_IFC, ITEM_HOSP_APR_MEDIGAP, ITEM_HOSP_APR_PATH_RAD, ITEM_HOSP_MED_APR_WRAP];
CHECKLIST_TRIGGERS[PROCESS_HOSP_CHECK_COVERED_CLAIM] = [ITEM_HOSP_OFFER_CLAIM, ITEM_HOSP_CLAIM_AUTO, ITEM_HOSP_CLAIM_MEDIGAP, ITEM_HOSP_CLAIM_TWOWAY];
CHECKLIST_TRIGGERS[PROCESS_HOSP_CHECK_INFO] = [ITEM_HOSP_INFO_MEDIGAP, ITEM_HOSP_INFO_IFC, ITEM_HOSP_INFO_AFTER_REHAB, ITEM_HOSP_INFO_DIGI, ITEM_HOSP_INFO_MYGOV];
CHECKLIST_TRIGGERS[PROCESS_HOSP_CHECK_NOT_COVERED] = [ITEM_HOSP_NC_UPGRADE, ITEM_HOSP_NC_SOLVE];
CHECKLIST_TRIGGERS[PROCESS_HOSP_CHECK_WAIT] = [ITEM_HOSP_WAIT_DATE, ITEM_HOSP_WAIT_DELAY, ITEM_HOSP_WAIT_SOLVE];
CHECKLIST_TRIGGERS[PROCESS_HOSP_CHECK_WRAP] = [ITEM_HOSP_CHECK_RECAP, ITEM_HOSP_CHECK_SEND_LINK, ITEM_HOSP_CHECK_WRAP, ITEM_HOSP_WISH_WELL];

// Buttons
const CASE_BUTTONS = [
    { name: "AGR", note: "Applied AGR, MUST READ AGR SCRIPT",
        triggers: [ITEM_AGR_SCRIPT], categories: catArray(CATEGORY_UPDATE, CATEGORY_PAYMENT) },
    { name: "DD", note: "Updated DD, MUST READ DD SCRIPT",
        triggers: [PROCESS_UPDATE_DD], categories: catArray(CATEGORY_UPDATE, CATEGORY_PAYMENT) },
    { name: "Email", note: "Updated email, MUST READ EMAIL SCRIPT",
        triggers: [ITEM_EMAIL_SCRIPT], categories: catArray(CATEGORY_UPDATE) },
    { name: "Home", note: "Updated home address",
        categories: catArray(CATEGORY_UPDATE) },
    { name: "Medicare", note: "Updated medicare card info",
        categories: catArray(CATEGORY_UPDATE) },
    { name: "Name", note: "Updated name, MUST CONFIRM MEDICARE INFO, MIGHT LOG WITH PAT, MUST ADV NEW CARDS",
        triggers: [ITEM_NAME_CONFIRM_MEDICARE, ITEM_NAME_LOG_PAT, ITEM_NAME_CARDS], categories: catArray(CATEGORY_UPDATE) },
    { name: "Pension", note: "Updated pension card info",
        categories: catArray(CATEGORY_UPDATE) },
    { name: "Phone", note: "Updated phone number",
        categories: catArray(CATEGORY_UPDATE) },
    { name: "Postal", note: "Updated postal address",
        categories: catArray(CATEGORY_UPDATE) },
    { name: "Spouse auth", note: "Added spouse auth for |spouse|",
        categories: catArray(CATEGORY_UPDATE) },
    { name: "Ancil check", note: "Saved ancil check",
        categories: catArray(CATEGORY_CLAIM) },
    { name: "Benefit enquiry", note: "Benefit enquiry |claim|",
        categories: catArray(CATEGORY_CLAIM) },
    { name: "Digi claim", note: "Walked through claiming online",
        categories: catArray(CATEGORY_CLAIM) },
    { name: "How to", note: "How to claim",
        categories: catArray(CATEGORY_CLAIM) },
    { name: "Low benefit", note: "Follow up on |category| claim, lower benefit than expected",
        categories: catArray(CATEGORY_CLAIM) },
    { name: "Mail claims", note: "Approved for mail claims, MUST SEND CLAIM FORMS, MUST ADV MAIL CLAIM PROCESS",
        categories: catArray(CATEGORY_CLAIM) },
    { name: "Not paid", note: "Follow up on |category| claim, why not paid",
        categories: catArray(CATEGORY_CLAIM) },
    { name: "Change", note: "Changed cover, MUST READ CHANGE SCRIPT, MUST ADV WAITS, MUST ADV UPCOMING PAYMENTS",
        triggers: [PROCESS_COVER_CHANGE], categories: catArray(CATEGORY_COVER) },


    { name: "Hosp check", note: "Hospital eligibility check\nPatient: |policy holder|\nHospital: \nItems: \nExcess: ",
        triggers: [PROCESS_HOSP_CHECK_START], categories: catArray(CATEGORY_HOSPITAL) }
];

let db = null;

let scheduleItems = [];

const CHECKLIST_ITEMS = [];
CHECKLIST_ITEMS[ITEM_ID] = {text: "Check ID"};
CHECKLIST_ITEMS[ITEM_AGENDA] = {text: "Clear agenda"};
CHECKLIST_ITEMS[ITEM_TIMEFRAME] = {text: "Timeframe"};
CHECKLIST_ITEMS[ITEM_UPDATE_DETAILS] = {text: "Check/update contact details"};
CHECKLIST_ITEMS[ITEM_DIGITAL_WALKTHROUGH] = {text: "Offer digital walkthrough"};
CHECKLIST_ITEMS[ITEM_RECAP] = {text: "Strong recap"};
CHECKLIST_ITEMS[ITEM_DD_SCRIPT] = {text: "DD script", required: true};
CHECKLIST_ITEMS[ITEM_EMAIL_SCRIPT] = {text: "Email script", required: true};
CHECKLIST_ITEMS[ITEM_AGR_SCRIPT] = {text: "AGR script", required: true};
CHECKLIST_ITEMS[ITEM_QUOTE_VALID] = {text: "Quote validity", required: true};
CHECKLIST_ITEMS[ITEM_RECORDED] = {text: "Call recorded disclaimer", required: true};
CHECKLIST_ITEMS[ITEM_COVER_REVIEW] = {text: "Cover review"};
CHECKLIST_ITEMS[ITEM_CSS_TURNAROUND] = {text: "CSS turnaround", required: true};
CHECKLIST_ITEMS[ITEM_CRT_TURNAROUND] = {text: "CRT turnaround", required: true};
CHECKLIST_ITEMS[ITEM_CHANGE_SCRIPT] = {text: "Cover change script", required: true};
CHECKLIST_ITEMS[ITEM_CHANGE_ADV_WAITS] = {text: "Cover change wait periods", required: true};
CHECKLIST_ITEMS[ITEM_CHANGE_ADV_PAYMENTS] = {text: "Cover change upcoming payments", required: true};
CHECKLIST_ITEMS[ITEM_CARD_DELIVERY] = {text: "Card delivery time", required: true};
CHECKLIST_ITEMS[ITEM_PROMOTE_DIGITAL_CARD] = {text: "Promote digital card"};
CHECKLIST_ITEMS[ITEM_SUSPENSION_ELIGIBILITY] = {text: "Suspension eligibility", required: true};
CHECKLIST_ITEMS[ITEM_SUSPENSION_IMPACTS] = {text: "Suspension impacts", required: true};
CHECKLIST_ITEMS[ITEM_CB_CALLBACK] = {text: "CB set callback"};
CHECKLIST_ITEMS[ITEM_CB_MESSAGE] = {text: "CB leave message"};
CHECKLIST_ITEMS[ITEM_TAX_PREFILLED] = {text: "Tax pre-filled", required: true};
CHECKLIST_ITEMS[ITEM_TAX_SELF] = {text: "Tax statement self-service", required: true};
CHECKLIST_ITEMS[ITEM_QUOTE_TIER] = {text: "Quote confirm AGR tier", required: true};
CHECKLIST_ITEMS[ITEM_DIGI_COVER_CHECK] = {text: "Check limits digitally"};
CHECKLIST_ITEMS[ITEM_HOSP_ENGAGE] = {text: "Engage re hospital admission"};
CHECKLIST_ITEMS[ITEM_HOSP_BREAKDOWN] = {text: "Give hospital check breakdown/timeframe"};
CHECKLIST_ITEMS[ITEM_HOSP_DISCOVERY] = {text: "Thorough discovery"};
CHECKLIST_ITEMS[ITEM_HOSP_CONFIRM_INFO] = {text: "Confirm member gave correct info"};
CHECKLIST_ITEMS[ITEM_HOSP_CONFIRM_COVERED] = {text: "Tell member they're covered"};
CHECKLIST_ITEMS[ITEM_HOSP_CONFIRM_EXCESS] = {text: "State excess payable"};
CHECKLIST_ITEMS[ITEM_HOSP_CHECK_PSYCH_REHAB] = {text: "Psych/Rehab: ask program name"};
CHECKLIST_ITEMS[ITEM_HOSP_WARN_OOPS] = {text: "Warn of possible OOPs"};
CHECKLIST_ITEMS[ITEM_HOSP_RECOMMEND_IFC] = {text: "Recommend hospital IFC"};
CHECKLIST_ITEMS[ITEM_HOSP_WRAP] = {text: "Check in with member"};
CHECKLIST_ITEMS[ITEM_HOSP_MED_RATE] = {text: "Covered to Medicare rate"};
CHECKLIST_ITEMS[ITEM_HOSP_MED_IFC] = {text: "Recommend IFC from specialist"};
CHECKLIST_ITEMS[ITEM_HOSP_MED_OOPS] = {text: "OOPs when charged beyond rate"};
CHECKLIST_ITEMS[ITEM_HOSP_MED_MEDIGAP] = {text: "Discuss/check medigap"};
CHECKLIST_ITEMS[ITEM_HOSP_APR_RATE] = {text: "Covered to Medicare rate"};
CHECKLIST_ITEMS[ITEM_HOSP_APR_OOPS] = {text: "Anything above that is an OOP"};
CHECKLIST_ITEMS[ITEM_HOSP_APR_IFC] = {text: "Recommend IFC from anaesthetist"};
CHECKLIST_ITEMS[ITEM_HOSP_APR_MEDIGAP] = {text: "Check anaesthetist medigap"};
CHECKLIST_ITEMS[ITEM_HOSP_APR_PATH_RAD] = {text: "Path/Radio covered only to Medicare rate"};
CHECKLIST_ITEMS[ITEM_HOSP_MED_APR_WRAP] = {text: "Check in with member"};
CHECKLIST_ITEMS[ITEM_HOSP_OFFER_CLAIM] = {text: "Offer to walk through claiming"};
CHECKLIST_ITEMS[ITEM_HOSP_CLAIM_AUTO] = {text: "Hosp submits their accounts to nib"};
CHECKLIST_ITEMS[ITEM_HOSP_CLAIM_MEDIGAP] = {text: "Medigap specialist claims for you"};
CHECKLIST_ITEMS[ITEM_HOSP_CLAIM_TWOWAY] = {text: "Otherwise 2-way claim to Medicare"};
CHECKLIST_ITEMS[ITEM_HOSP_OUTCOME_WRAP] = {text: "Confirm member understands everything"};
CHECKLIST_ITEMS[ITEM_HOSP_INFO_MEDIGAP] = {text: "Ask about medigap"};
CHECKLIST_ITEMS[ITEM_HOSP_INFO_IFC] = {text: "Get IFC"};
CHECKLIST_ITEMS[ITEM_HOSP_INFO_AFTER_REHAB] = {text: "Discuss aftercare/rehab"};
CHECKLIST_ITEMS[ITEM_HOSP_INFO_DIGI] = {text: "Promote website/app"};
CHECKLIST_ITEMS[ITEM_HOSP_INFO_MYGOV] = {text: "mygov?"};
CHECKLIST_ITEMS[ITEM_HOSP_NC_UPGRADE] = {text: "Offer to increase cover"};
CHECKLIST_ITEMS[ITEM_HOSP_NC_SOLVE] = {text: "Empathise and offer solutions"};
CHECKLIST_ITEMS[ITEM_HOSP_WAIT_DATE] = {text: "Advise wait period end date"};
CHECKLIST_ITEMS[ITEM_HOSP_WAIT_DELAY] = {text: "Discuss delaying surgery"};
CHECKLIST_ITEMS[ITEM_HOSP_WAIT_SOLVE] = {text: "Empathise and offer solutions"};
CHECKLIST_ITEMS[ITEM_HOSP_CHECK_RECAP] = {text: "Recap hospital check"};
CHECKLIST_ITEMS[ITEM_HOSP_CHECK_SEND_LINK] = {text: "Send GTH web link"};
CHECKLIST_ITEMS[ITEM_HOSP_CHECK_WRAP] = {text: "Confirm eveything answered"};
CHECKLIST_ITEMS[ITEM_HOSP_WISH_WELL] = {text: "Wish them well!"};
CHECKLIST_ITEMS[ITEM_MAIL_CLAIM_WARNING] = {text: "Add warning to policy"};
CHECKLIST_ITEMS[ITEM_MAIL_CLAIM_FORM] = {text: "Send mail claim form"};
CHECKLIST_ITEMS[ITEM_MAIL_CLAIM_WALKTHROUGH] = {text: "Walk through mail claiming incl address"};

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

function catArray(...categories) {
    let newArray = [];
    for (let i = 0; i < categories.length; i++) {
        newArray[categories[i]] = true;
    }
    return newArray;
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
    .replaceAll(", MUST OFFER SELF-SERVICE", "")
    .replaceAll(", MUST SEND CLAIM FORMS", "")
    .replaceAll(", MUST ADV MAIL CLAIM PROCESS", "");

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

function toggleChecklistItemDropdown(element) {
    element.parentElement.querySelector(".checklist-item-dropdown-content").classList.toggle("dropdown-expanded");
}

function addChecklistItem(item) {
    if (currentCall.callStats[item]) return;

    if (item > PROCESSES_START) {
        let insertContent = `
        <div class="checklist-item-dropdown">
            <div class="checklist-item-dropdown-heading" onclick="toggleChecklistItemDropdown(this)">
                <button class="tick-button" onclick="checklistItemDropdownTick(true, this)">Y</button>
                <button class="x-button" onclick="checklistItemDropdownTick(false, this)">N</button>
                <span>${PROCESS_NAMES[item]}</span>
            </div>
            <div class="checklist-item-dropdown-content">`;

        for (let i = 0; i < CHECKLIST_TRIGGERS[item].length; i++) {
            let cur = CHECKLIST_TRIGGERS[item][i];
            insertContent += `
            <div class="checklist-item">
                <button class="tick-button" onclick="checklistItemTick(true, this, ${cur})">Y</button>
                <button class="x-button" onclick="checklistItemTick(false, this, ${cur})">N</button>
                <span>${CHECKLIST_ITEMS[cur].text}</span>
            </div>`;
        }

        insertContent += `</div></div>`;
        checklist.innerHTML += insertContent;
    }
    else {
        currentCall.callStats[item] = STAT_MISSED;
        checklist.innerHTML += `
        <div class="checklist-item">
            <button class="tick-button" onclick="checklistItemTick(true, this, ${item})">Y</button>
            <button class="x-button" onclick="checklistItemTick(false, this, ${item})">N</button>
            <span>${CHECKLIST_ITEMS[item].text}</span>
        </div>`;
    }
}

function removeChecklistItem(item, complete) {
    let checklistChildren = checklist.children;

    for (let i = checklistChildren.length - 1; i >= 0; i--) {
        if (checklistChildren[i].querySelector("span").innerText == CHECKLIST_ITEMS[item].text) {
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
                <td>${CHECKLIST_ITEMS[i].text}</td>
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

function checklistItemDropdownTick(tick, element) {
    let childChecks;

    if (tick) childChecks = element.parentElement.parentElement.querySelectorAll(".tick-button");
    else childChecks = element.parentElement.parentElement.querySelectorAll(".x-button");

    for (let i = 0; i < childChecks.length; i++) {
        childChecks[i].click();
    }
}

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
            case ITEM_MAIL_CLAIM_FORM:
                noteContent.value = noteContent.value.replaceAll("MUST SEND CLAIM FORMS", "sent forms");
                break;
            case ITEM_MAIL_CLAIM_WALKTHROUGH:
                noteContent.value = noteContent.value.replaceAll("MUST ADV MAIL CLAIM PROCESS", "adv process & address");
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
    
    let dropdownParent = element.closest(".checklist-item-dropdown-content");
    element.parentElement.outerHTML = "";
    if (dropdownParent.children.length == 0) dropdownParent.parentElement.outerHTML = "";
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