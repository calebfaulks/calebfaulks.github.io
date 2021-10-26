var pages, navLinks;
var pageNames = [
	"home",
	"about",
	"portfolio",
	"contact"
];

window.addEventListener('hashchange', checkNavChange);

function loadPost() {
	if (location.hash) checkNavChange();
}

function checkNavChange(e) {
	if (!location.hash) return;
	var hash = location.hash.slice(1).toLowerCase();
	if (pageNames.includes(hash)) document.body.className = hash + "-active";
}