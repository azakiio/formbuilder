var tx = document.getElementsByTagName('textarea');
for (var i = 0; i < tx.length; i++) {
    tx[i].addEventListener("input", () => {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    }, false);
}

$(function () {
    $("ol.example").sortable({
        distance: 10
    });
});


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


firebase.database().ref('/form-list/' + formID).once('value').then(function (snapshot) {
    targetNode.innerHTML = snapshot.val().content
    setbtns()
}, function (err) {
    targetNode.innerText = err;
    targetNode.innerText += "\n\nPlease return Home and Login"
});

function save() {
    firebase.database().ref('/form-list/' + formID)
        .update({
            content: targetNode.innerHTML
        });
    var currDate = new Date().toLocaleString();
    document.getElementById("lastSaved").innerText = `Last Saved at: ${currDate}`
}

// var coll = document.getElementsByClassName("collapsible");
// for (var i = 0; i < coll.length; i++) {
//     coll[i].addEventListener("click", function () {
//         this.classList.toggle("active");
//         var content = this.nextElementSibling;
//         if (content.style.display === "block") {
//             content.style.display = "none";
//         } else {
//             content.style.display = "block";
//         }
//     });
// }

function textAnswer(question) {
    var form = document.getElementById("form")
    var item = document.createElement("li")
    var sublist = document.createElement("ol")
    item.appendChild(document.createTextNode(question))

    var delbtn = document.createElement("img")
    delbtn.src = "/assets/icons8-delete.svg"
    delbtn.setAttribute("class", "delbtn")
    item.appendChild(delbtn)

    var input = document.createElement("input");
    input.type = "text";
    input.disabled = true;
    item.appendChild(input)
    item.appendChild(sublist)
    form.appendChild(item)
    setbtns()
}

function otherAnswer(type, question, answers) {
    var form = document.getElementById("form");
    var item = document.createElement("li")
    var sublist = document.createElement("ol")
    item.appendChild(document.createTextNode(question))

    var delbtn = document.createElement("img")
    delbtn.src = "/assets/icons8-delete.svg"
    delbtn.setAttribute("class", "delbtn")
    item.appendChild(delbtn)

    var temp = answers.split(/\r?\n/);
    for (a of temp) {
        var input = document.createElement("input");
        input.type = type;
        input.disabled = true;
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

// function section(title){
//     var form = document.getElementById("form")
//     var item = document.createElement("li")
//     var sublist = document.createElement("ol")
//     item.appendChild(document.createTextNode(title)) 
//     item.appendChild(sublist)
//     form.appendChild(item)
//     setbtns()
// }

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

var form_title = document.getElementById("form_title")
form_title.onblur = () => {
    //Save title to firebase
    console.log("test")
}