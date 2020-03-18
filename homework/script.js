var tx = document.getElementsByTagName('textarea');
for (var i = 0; i < tx.length; i++) {
    tx[i].addEventListener("input", function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    }, false);
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
const urlParams = new URLSearchParams(window.location.search);
var formID = urlParams.get("k")
var userID = urlParams.get("u")
const targetNode = document.getElementById('form');


firebase.database().ref('/form-list/' + formID).once('value').then(function (snapshot) {
    targetNode.innerHTML = snapshot.val().content
}, function (err) {
    targetNode.innerText = err;
    targetNode.innerText += "\n\nPlease return Home and Login"
});

function save() {
    firebase.database().ref(`form-list/${formID}/${userID}`)
        .update({
            content: targetNode.innerHTML
        });
    var currDate = new Date().toLocaleString();
    document.getElementById("lastSaved").innerText = `Last Saved at: ${currDate}`
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

function setInactive(checkbox){

}