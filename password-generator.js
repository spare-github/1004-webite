window.onload = function() {
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
