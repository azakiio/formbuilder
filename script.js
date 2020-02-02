var index = 0;

var tx = document.getElementsByTagName('textarea');
for (var i = 0; i < tx.length; i++) {
    tx[i].addEventListener("input", OnInput, false);
}

$(function () {
    $("ol.example").sortable({
        distance: 10
    });
});

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

var firebaseConfig = {
    apiKey: "AIzaSyAltMfeb-pzQUfQz-pfTnh2jfwBFVzhPq0",
    authDomain: "ohforms.firebaseapp.com",
    databaseURL: "https://ohforms.firebaseio.com",
    projectId: "ohforms",
    storageBucket: "ohforms.appspot.com",
    messagingSenderId: "1039072712651",
    appId: "1:1039072712651:web:42c05751974f27287b084e",
    measurementId: "G-5T2BPCY1LF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var formID = window.location.search.slice(3)
const targetNode = document.getElementById('form');
var currtime = window.performance.now()

firebase.database().ref('/form-list/' + formID).once('value').then(function (snapshot) {
    targetNode.innerHTML = snapshot.val().content
    setbtns()
});

function save() {
    firebase.database().ref('/form-list/' + formID)
        .update({
            content: targetNode.innerHTML
        });
}

var coll = document.getElementsByClassName("collapsible");
for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

function textAnswer(index, question) {
    var form = document.getElementById("form")
    var item = document.createElement("li")
    var sublist = document.createElement("ol")
    item.appendChild(document.createTextNode(question))

    var delbtn = document.createElement("button")
    delbtn.innerText = "Delete"
    delbtn.setAttribute("class", "delbtn")
    item.appendChild(delbtn)

    var input = document.createElement("input");
    input.type = "text";
    input.name = index
    item.appendChild(input)
    item.appendChild(sublist)
    form.appendChild(item)
    setbtns()
}

function otherAnswer(index, type, question, answers) {
    var form = document.getElementById("form");
    var item = document.createElement("li")
    var sublist = document.createElement("ol")
    item.appendChild(document.createTextNode(question))

    var delbtn = document.createElement("img")
    delbtn.src = "icons8-delete.svg"
    delbtn.setAttribute("class", "delbtn")
    item.appendChild(delbtn)

    var temp = answers.split(/\r?\n/);
    for (a of temp) {
        var input = document.createElement("input");
        input.type = type;
        input.name = index;
        var label = document.createElement("label");
        label.appendChild(input)
        label.appendChild(document.createTextNode(a))
        item.appendChild(label)
        item.appendChild(document.createElement("ol"))
    }
    item.appendChild(document.createElement("hr"))
    item.appendChild(sublist)
    form.appendChild(item)
    setbtns()
}

function section(title){
    var form = document.getElementById("form")
    var item = document.createElement("li")
    var sublist = document.createElement("ol")
    item.appendChild(document.createTextNode(title)) 
    item.appendChild(sublist)
    form.appendChild(item)
    setbtns()
}

function setbtns() {
    delbtns = document.getElementsByClassName("delbtn")
    for (let delbtn of delbtns) {
        delbtn.onclick = function () {
            item = delbtn.parentNode
            item.parentNode.removeChild(item);
            return false;
        }
    }
}