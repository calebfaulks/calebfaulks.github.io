let db = null;
let teamSectionsContainer;

document.addEventListener("DOMContentLoaded", page_load);

function page_load() {
    teamSectionsContainer = document.querySelector("main");
    document.querySelectorAll(".team-section").forEach((sec) => {
        sec.querySelector(".minus-button").addEventListener("click", score_minus);
        sec.querySelector(".plus-button").addEventListener("click", score_add);
        sec.querySelector(".left-button").addEventListener("click", team_left);
        sec.querySelector(".right-button").addEventListener("click", team_right);
        sec.querySelector(".team-name").addEventListener("click", team_rename);
    });
    initDB();

    // request a wake lock
    try {
    let wakeLock = navigator.wakeLock.request("screen");
    } catch (err) {
    
    }
}

function score_add(e) {
    let teamScore = e.target.closest(".team-section").querySelector(".team-score");
    teamScore.innerHTML = teamScore.innerHTML * 1 + 1;
    updateTeamsInDB();
}

function score_minus(e) {
    let teamScore = e.target.closest(".team-section").querySelector(".team-score");
    teamScore.innerHTML = teamScore.innerHTML * 1 - 1;
    updateTeamsInDB();
}

function team_left(e) {
    let teamSection = e.target.closest(".team-section");
    if (!(teamSection.previousElementSibling)) return;
    teamSection.parentElement.insertBefore(teamSection, teamSection.previousElementSibling);
    updateTeamsInDB();
}

function team_right(e) {
    let teamSection = e.target.closest(".team-section");
    if (!(teamSection.nextElementSibling)) return;
    teamSection.parentElement.insertBefore(teamSection, teamSection.nextElementSibling.nextElementSibling);
    updateTeamsInDB();
}

function team_rename(e) {
    let teamName = e.target.closest(".team-section").querySelector(".team-name");
    teamName.innerText = prompt("Change team name", teamName.innerText);
    updateTeamsInDB();
}

function team_add({score, name, color}) {
    teamSectionsContainer.innerHTML += `
        <div class="team-section" style="background-color: ${color};">
            <button class="minus-button">-</button>
            <div class="team-score">${score}</div>
            <button class="plus-button">+</button>
            <div class="team-name">${name}</div>
            <div class="buttons-container">
                <button class="left-button">←</button>
                <button class="right-button">→</button>
            </div>
        </div>`;
}

// Database functions

function initDB() {
	const dbName = "score_keeper";
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
		try {
            const scheduleInfo = db.createObjectStore("teams_info");
            updateTeamsInDB();
        } catch (error) {} 
	};

	// on success - runs when you successfully access the database
	request.onsuccess = e => {
		db = e.target.result;
		loadTeamsFromDB();
	};

	// on error
	request.onerror = e => {
		console.log("DATABASE ERROR: " + e.target.error.message);
	};
}

// Pulls the schedule stored in the database and loads it into an array
function loadTeamsFromDB() {
	const tx = db.transaction("teams_info", "readonly");
	const teamsStore = tx.objectStore("teams_info");
    const countRequest = teamsStore.count();
    countRequest.onsuccess = e => {
        let count = e.target.result;
        if (count === 0) return updateTeamsInDB();
        teamSectionsContainer.innerHTML = "";
        
        const request = teamsStore.openCursor();
        request.onerror = ev => console.log(`DATABASE ERROR: ${ev.target.error.message}`);
        request.onsuccess = ev => {
            const cursor = ev.target.result;

            if (cursor) {
                // Process the data here

                team_add(cursor.value);

                cursor.continue(); // moves the cursor forward, calling onsuccess again
            }
            else {
                document.querySelectorAll(".team-section").forEach((sec) => {
                    sec.querySelector(".minus-button").addEventListener("click", score_minus);
                    sec.querySelector(".plus-button").addEventListener("click", score_add);
                    sec.querySelector(".left-button").addEventListener("click", team_left);
                    sec.querySelector(".right-button").addEventListener("click", team_right);
                    sec.querySelector(".team-name").addEventListener("click", team_rename);
                });
            }
        };
    };
}

// Update the teams in the DB to match the page
function updateTeamsInDB() {
    let teamEntries = [];
    document.querySelectorAll(".team-section").forEach((sec) => {
        let score = sec.querySelector(".team-score").innerText * 1;
        let name = sec.querySelector(".team-name").innerText;
        let color = sec.style.backgroundColor;
        
        teamEntries.push({score, name, color});
    });

	const tx = db.transaction("teams_info", "readwrite");
	tx.onerror = e => console.log(`DATABASE ERROR: ${e.target.error.message}`);
	//tx.oncomplete = e => console.log(e);
	const teamsStore = tx.objectStore("teams_info");
    teamsStore.clear();

	for (let i = 0; i < teamEntries.length; i++) {
		const request = teamsStore.put(teamEntries[i], i);
	}
}