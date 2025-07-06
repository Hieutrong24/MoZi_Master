document.addEventListener('DOMContentLoaded', function () {
	//======================Dang ky==========================
	let loading = 1;
	const duration = 5000;
	const max = 100;
	const intervalTime = duration / max;
	//const biteIds = []
	const biteIds = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
	const numBites = biteIds.length;
	const biteTime = Math.floor(max / numBites);
	let bitesTaken = 0

	const interval = setInterval(() => {
		if (loading <= max) {
			if (loading == biteTime * (bitesTaken + 1)) {
				document.getElementById(biteIds[bitesTaken]).style.opacity = '1';
				bitesTaken++;
			}
			loading++;
		} else {
			// just cycle again
			// otherwise use clearInterval(interval);
			for (id in biteIds) {
				document.getElementById(biteIds[id]).style.opacity = '0';
			}
			loading = 0
			bitesTaken = 0
		}
	}, intervalTime);

	//====nut dieu huong
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el))

	//==========
	const currentPath = window.location.pathname.replace(/\/$/, "").toLowerCase();

	document.querySelectorAll(".nav-btn").forEach(btn => {
		const anchor = btn.closest("a");
		if (anchor) {
			const href = anchor.getAttribute("href").replace(/\/$/, "").toLowerCase();
			if (href === currentPath) {
				btn.classList.add("active");
			}
		}
	});
	
});