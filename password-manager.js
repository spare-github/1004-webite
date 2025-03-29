class PasswordTable {
	constructor() {
		this.entries = [[[]]];
		for()
	}

}

function editRow(id) {
	var row = document.getElementById(`row ${id}`);
	var username = row.cells[0].innerHTML;
	var password = row.cells[1].innerHTML;
	var url = row.cells[2].children[0].href;
	row.innerHTML = `<form id=\"edit ${id}\"></form><td><input form=\"edit ${id}\" type=\"text\" name=\"username\" value=\"${username}\"></td><td><input form=\"edit ${id}\" type=\"text\" name=\"password\" value=\"${password}\"></td><td><input form=\"edit ${id}\" type=\"text\" name=\"url\" value=\"${url}\"></td><td><input form=\"edit ${id}\" type=\"submit\" value=\"submit\"  onclick=\"submitRow(${id})\"></td>`;
}

function submitRow(id) {
	var form = document.getElementById(`edit ${id}`);
	var usernameValue = form.elements.namedItem("username").value;
	var passwordValue = form.elements.namedItem("password").value;
	var urlValue = form.elements.namedItem("url").value;
	var row = document.getElementById(`row ${id}`);
	row.innerHTML = "";
	var username = row.insertCell(0);
	var password = row.insertCell(1);
	var url = row.insertCell(2);
	var edit = row.insertCell(3);
	username.innerHTML = usernameValue;
	password.innerHTML = passwordValue;
	password.classList.add("password");
	url.innerHTML = `<a href=\"${urlValue}\">${urlValue}</a>`;
	edit.innerHTML = `<button type=\"button\" onclick=\"editRow(${id})\">edit</button>`;
}

function createRow() {
	var row = document.getElementById("mainTable").insertRow(-1);
	var id = document.getElementById("mainTable").rows.length;
	row.id = `row ${id}`;
	var username = row.insertCell(0);
	var password = row.insertCell(1);
	var url = row.insertCell(2);
	var edit = row.insertCell(3);
	username.innerHTML = "username";
	password.innerHTML = "password";
	url.innerHTML = "<a href=\"https://example.com\">https://example.com<a>";
	edit.innerHTML = `<button type=\"button\" onclick=\"editRow(${id})\">edit</button>`;
	editRow(id);
}

function createTableObject() {

}

function save() {
	var table = document.getElementById("mainTable");
	var password = document.getElementById("passwordBox");
	var row;
	var data = "";
	for(var i = 1; i < table.rows.length; i++) {
		row = table.rows[i];
		data = data + "\n" + row.innerText;
	}
	data = btoa(data);
	data = encrypt(data, document.getElementById("passwordBox"))
	console.log(data.salt);
}

async function encrypt(data, password) {
	var encoder = new TextEncoder();
	var salt = window.crypto.getRandomValues(new Uint8Array(32))
	password = await window.crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);
	var key = await window.crypto.subtle.deriveKey({name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256"}, password, {name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);
	data = await window.crypto.subtle.encrypt({name: "AES-GCM", iv: window.crypto.getRandomValues(new Uint8Array(12))}, key, encoder.encode(data));
	return {data: data, salt: salt};
}
