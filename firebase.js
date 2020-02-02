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
ref.on('value', gotData, errData);


function gotData(data) {
    var forms = data.val();
    var keys = Object.keys(forms);
    var ol = document.getElementById("formList")
    ol.innerHTML = ""
    for (var i = 0; i < keys.length; i++) {
        let k = keys[i];
        var name = forms[k].name;
        var li = document.createElement("li");

        var link = document.createElement("a");
        link.href = "formbuilder.html?k=" + k

        var delbtn = document.createElement("img")
        delbtn.src = "icons8-delete.svg"
        delbtn.setAttribute("class", "delbtn")
        delbtn.onclick = function(){
            database.ref("/form-list/"+k).remove()

        }

        link.innerText = name
        li.appendChild(link)
        li.appendChild(delbtn)
        ol.appendChild(li)
    }
}


function errData(err) {
    console.log("Error");
    console.log(err);
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
  
      document.getElementById("user_div").style.display = "block";
      document.getElementById("login_div").style.display = "none";
      ref.on('value', gotData, errData);
      
    } else {
      // No user is signed in.
  
      document.getElementById("user_div").style.display = "none";
      document.getElementById("login_div").style.display = "block";
  
    }
  }); 

function newForm(formName) {
    var data = {
        name: formName,
        content: ""
    }
    ref.push(data)
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

function logout(){
    firebase.auth().signOut();
  }