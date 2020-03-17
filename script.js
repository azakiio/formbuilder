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
var database = firebase.database();
var ref = database.ref("/form-list");


function gotData(data) {
    var forms = data.val();
    var keys = Object.keys(forms);
    var formList_div = document.getElementById('formList')
    formList_div.innerHTML = ""
    for (var i = 0; i < keys.length; i++) {
        let k = keys[i];

        let outer_div = document.createElement("div")
        outer_div.classList.add("form-list-item")

        let name_p = document.createElement("p")

        let link_a = document.createElement("a")
        link_a.href = `/formbuilder/?k=${k}`
        link_a.innerText = forms[k].name;

        let date_p = document.createElement("p")
        date_p.innerText = forms[k].creationDate;

        let delete_button = document.createElement("span")
        delete_button.onclick = () => {
            database.ref("/form-list/" + k).remove()
        }
        delete_button.classList.add("del")
        delete_button.innerText = "\u2715"

        name_p.append(link_a)
        outer_div.append(name_p, date_p, delete_button)
        formList_div.append(outer_div)

    }
}


function errData(err) {
    console.log("Error");
    console.log(err);
}


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        document.getElementById("logged-in").style.display = "flex";
        document.getElementById("logged-out").style.display = "none";
        ref.on('value', gotData, errData);

    } else {
        // No user is signed in.
        document.getElementById("logged-in").style.display = "none";
        document.getElementById("logged-out").style.display = "flex";

    }
});

function newForm() {
    var data = {
        name: "Untitled",
        content: "",
        qID: 0,
        creationDate: new Date().toLocaleDateString()
    }
    var link = ref.push(data)
    window.location.href = `/formbuilder/?k=${link.name}`
}


function login() {
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        console.log(error.code)
        console.log(error.message)
        window.alert(error.message)
    });
}

function logout() {
    firebase.auth().signOut();
}