var table = 0;
var tableArray = [];

class PasswordTable {
	constructor(title) {
		this.entries = [];
		this.title = title;
	}

	saveTable() {
		this.entries = [];
		var table = document.getElementById("mainTable");
		for(var i = 1; i < table.rows.length; i++) {
			this.entries.push([table.rows[i].cells[0].innerText, table.rows[i].cells[1].innerText, table.rows[i].cells[2].innerText]);
		}
	}

	loadTable() {
		var table = document.getElementById("mainTable");
		for(var i = table.rows.length; i > 1 ; i--) {
			table.deleteRow(1);
		}
		for(var i = 0; i < this.entries.length; i++) {
			var row = table.insertRow(-1);
			var id = table.rows.length;
			row.id = `row ${id}`;
			var username = row.insertCell(0);
			var password = row.insertCell(1);
			var url = row.insertCell(2);
			var edit = row.insertCell(3);
			username.innerHTML = this.entries[i][0];
			password.innerHTML = this.entries[i][1];
			password.classList.add("password");
			var urlValue = this.entries[i][2];
			url.innerHTML = `<a href=\"${urlValue}\">${urlValue}</a>`;
			edit.innerHTML = `<button type=\"button\" onclick=\"editRow(${id})\">edit</button><button type=\"button\" onclick=\"deleteRow(${id})\">delete</button>`;
		}
	}
}

function initTable() {
	tableArray.push(new PasswordTable("default"));
}

function editRow(id) {
	var row = document.getElementById(`row ${id}`);
	var username = row.cells[0].innerHTML;
	var password = row.cells[1].innerHTML;
	var url = row.cells[2].children[0].href;
	row.innerHTML = `<form id=\"edit ${id}\"></form><td><input form=\"edit ${id}\" type=\"text\" name=\"username\" value=\"${username}\"></td><td><input form=\"edit ${id}\" type=\"text\" name=\"password\" value=\"${password}\"></td><td><input form=\"edit ${id}\" type=\"text\" name=\"url\" value=\"${url}\"></td><td><input form=\"edit ${id}\" type=\"submit\" value=\"submit\"  onclick=\"submitRow(${id})\"></td>`;
}

function swapTable() {
	var newTable = document.getElementById("tableDropdown").value;
	tableArray[table].saveTable();
	tableArray[newTable].loadTable();
	table = newTable;
}

function createTable() {
	if (document.getElementById("newTableName").value == "") {
		alert("Name required");
	} else {
		var dropdown = document.getElementById("tableDropdown");
		var name = document.getElementById("newTableName").value;
		var newOption = document.createElement("option");
		newOption.text = name;
		newOption.value = tableArray.length;
		dropdown.add(newOption);
		tableArray.push(new PasswordTable(name));
		document.getElementById("newTableName").value = "";
	}
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
	edit.innerHTML = `<button type=\"button\" onclick=\"editRow(${id})\">edit</button><button type=\"button\" onclick=\"deleteRow(${id})\">delete</button>`;
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

function deleteRow(row) {
	mainTable = document.getElementById("mainTable");
	mainTable.deleteRow(row - 1);
	tableArray[table].saveTable();
	tableArray[table].loadTable();
}

async function save() {
	var password = document.getElementById("passwordBox");
	tableArray[document.getElementById("tableDropdown").value].saveTable();
	var data = JSON.stringify(tableArray);
	data = btoa(data);
	data = await encrypt(data, document.getElementById("passwordBox"));
	data.data = new Uint8Array(data.data);
	console.log(data)
	data.data = data.data.toBase64();
	data.salt = data.salt.toBase64();
	data.iv = data.iv.toBase64();
	data = JSON.stringify(data);
	console.log(data);
	var downloadLink = document.createElement("a");
	downloadLink.download = "database.txt";
	var file = new Blob([data], {type: "text/plain"});
	downloadLink.href = window.URL.createObjectURL(file);
	downloadLink.click();
}

function load() {
	tableArray = []
	document.getElementById("tableDropdown").innerHTML = "";
	var data = "";
	var targetFile = document.getElementById("fileSelection");
	var f = targetFile.files[0];
	if(f) {
		var reader = new FileReader();
		reader.onload = async function(e) {
			data = e.target.result;
			data = JSON.parse(data);
			data = await decrypt(Uint8Array.fromBase64(data.data), Uint8Array.fromBase64(data.salt), Uint8Array.fromBase64(data.iv), document.getElementById("passwordBox").value);
			console.log(data);
			data = atob(data);
			data = JSON.parse(data);
			for(var i = 0; i < data.length; i++) {
				var newTable = new PasswordTable(data[i].title);
				newTable.entries = data[i].entries;
				tableArray.push(newTable);
			}
			var dropdown = document.getElementById("tableDropdown");
			var newOption;
			for(var i = 0; i < tableArray.length; i++) {
				newOption = document.createElement("option");
				newOption.text = tableArray[i].title;
				newOption.value = tableArray.length - 1;
				dropdown.add(newOption);
			}
			table = 0;
			tableArray[0].loadTable();
		};
		reader.readAsText(f);
	} else {
		alert("File read error");
	}
}

async function encrypt(data, password) {
	var encoder = new TextEncoder();
	var salt = window.crypto.getRandomValues(new Uint8Array(32));
	var iv = window.crypto.getRandomValues(new Uint8Array(12));
	password = await window.crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);
	var key = await window.crypto.subtle.deriveKey({name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256"}, password, {name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);
	data = await window.crypto.subtle.encrypt({name: "AES-GCM", iv: iv}, key, encoder.encode(data));
	return {data: data, salt: salt, iv: iv};
}

async function decrypt(data, salt, iv, password) {
	var encoder = new TextEncoder();
	password = await window.crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);
	var key = await window.crypto.subtle.deriveKey({name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256"}, password, {name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);
	return window.crypto.subtle.decrypt({name: "AES-GCM", iv}, key, data);
}
