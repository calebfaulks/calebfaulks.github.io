document.addEventListener("DOMContentLoaded", page_load);

function page_load() {
    document.querySelectorAll(".team-section").forEach((sec) => {
        sec.querySelector(".minus-button").addEventListener("click", score_minus);
        sec.querySelector(".plus-button").addEventListener("click", score_add);
        sec.querySelector(".left-button").addEventListener("click", team_left);
        sec.querySelector(".right-button").addEventListener("click", team_right);
    });
}

function score_add(e) {
    let teamScore = e.target.closest(".team-section").querySelector(".team-score");
    teamScore.innerHTML = teamScore.innerHTML * 1 + 1;
}

function score_minus(e) {
    let teamScore = e.target.closest(".team-section").querySelector(".team-score");
    teamScore.innerHTML = teamScore.innerHTML * 1 - 1;
}

function team_left(e) {
    let teamSection = e.target.closest(".team-section");
    if (!(teamSection.previousElementSibling)) return;
    teamSection.parentElement.insertBefore(teamSection, teamSection.previousElementSibling)
}

function team_right(e) {
    let teamSection = e.target.closest(".team-section");
    if (!(teamSection.nextElementSibling)) return;
    teamSection.parentElement.insertBefore(teamSection, teamSection.nextElementSibling.nextElementSibling)
}