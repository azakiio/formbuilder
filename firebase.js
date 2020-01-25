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
var ref = database.ref("form-list");
ref.on('value', gotData, errData);


function gotData(data) {
    var forms = data.val();
    var keys = Object.keys(forms);
    var ol = document.getElementById("formList")
    ol.innerHTML = ""
    for (var i = 0; i < keys.length; i++){
        let k = keys[i];
        var name = forms[k].name;
        var content = forms[k].content;
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.href = "index.html?k=" + k
        link.innerText = name
        li.appendChild(link)
        ol.appendChild(li)
    }
}



function errData(err) {
    console.log("Error");
    console.log(err);
}

function newForm(formName) {
    var data = {
        name: formName,
        content: ""
    }
    ref.push(data)
}