var pages, navLinks;
var pageNames = [
	"home",
	"about",
	"portfolio",
	"contact"
];

window.addEventListener('load', window_load);
window.addEventListener('hashchange', checkNavChange);

function loadPost() {
	if (location.hash) checkNavChange();
}
function window_load() {
	setTimeout(hideLoadOverlay, 250);
}

function checkNavChange(e) {
	if (!location.hash) return;
	var hash = location.hash.slice(1).toLowerCase();
	if (pageNames.includes(hash)) document.body.className = hash + "-active";
}

function hideLoadOverlay() {
	document.querySelector(".loading-overlay").classList.add("not-loading");
}