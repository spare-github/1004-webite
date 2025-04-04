function initSlider() {
	var slider = document.getElementById("lengthSlider");
	slider.oninput = function() {
		document.getElementById("sliderLabel").innerHTML = `${document.getElementById("lengthSlider").value} characters`;
	}
}

function getRandomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function generatePassword() {
	var password = "";
	var validCharacters = "";
	if(document.getElementById("lowercaseToggle").checked) {
		validCharacters = validCharacters + "abcdefghijklmnopqrstuvwxyz";
	}
	if(document.getElementById("uppercaseToggle").checked) {
		validCharacters = validCharacters + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}
	if(document.getElementById("numberToggle").checked) {
		validCharacters = validCharacters + "0123456789";
	}
	if(document.getElementById("specialToggle").checked) {
		validCharacters = validCharacters + "!\"#$%&'()*+,-./:;<=>?@[\\]^_`~";
	}
	if(document.getElementById("extendedToggle").checked) {
		validCharacters = validCharacters + "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
	}
	for(var i = 0; i < Number(document.getElementById("lengthSlider").value); i++) {
		password = password + validCharacters[getRandomNumber(0, (validCharacters.length - 1))];
	}
	document.getElementById("generatorBox").value = password;
}

function checkQuality() {
	var table = document.getElementById("mainTable");
	var textBox = document.getElementById("qualityResults");
	var text = "";
	textBox.innerHTML = "";
	for(var i = 1; i < table.rows.length; i++) {
		password = table.rows[i].cells[1].innerText;
		if(password === "password") {
			text = text + `password for ${table.rows[i].cells[2].innerText} is still set to the default<br>`;
		}
		if(password.length < 15) {
			text = text + `password for ${table.rows[i].cells[2].innerText} is too short<br>`;
		}
		if(Array.from(new Set(password)).length < (password.length / 2)) {
			text = text + `password for ${table.rows[i].cells[2].innerText} has poor character variety<br>`;
		}
	}
	textBox.innerHTML = text;
}
