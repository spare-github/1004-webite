function widthCheck() {
	var width = window.innerWidth;
	//console.log(width); 1300
	var cssLink = document.getElementById("cssLink");
	if(width > 1300) {
		cssLink.href = "left-right.css";
	} else {
		cssLink.href = "top-bottom.css";
	}
}

window.onload = function() {
	widthCheck();
	initSlider();
	initTable();
}
