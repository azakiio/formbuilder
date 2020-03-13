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


// firebase.database().ref('/form-list/' + formID).once('value').then(function (snapshot) {
//     targetNode.innerHTML = snapshot.val().content
//     setbtns()
// }, function (err) {
//     targetNode.innerText = err;
//     targetNode.innerText += "\n\nPlease return Home and Login"
// });

function save() {
    firebase.database().ref('/form-list/' + formID)
        .update({
            content: targetNode.innerHTML
        });
    var currDate = new Date().toLocaleString();
    document.getElementById("lastSaved").innerText = `Last Saved at: ${currDate}`
}


function addQuestion(place) {
    var question = document.createElement("div")
    question.classList.add("question")
    question.setAttribute("name", place)

    var question_view = document.createElement("div")
    question_view.classList.add("question-view", "hidden")
    var pencil = document.createElement("i")
    pencil.classList.add("fa")
    pencil.classList.add("fa-pencil")
    pencil.onclick = function() {
        toggleEdit(this)
    }
    var p = document.createElement("p")
    p.setAttribute("name", "question")

    var answers = document.createElement("div")
    answers.setAttribute("name", "answers")

    var input = document.createElement("input")
    input.classList.add("text-answer") //TODO
    input.type = place
    input.disabled = true
    input.placeholder = "Written Answer..."
    
    question.append(question_view)
    question_view.append(pencil, p, answers)
    answers.append(input)

    var edit_view = document.createElement("div")
    edit_view.classList.add("edit-view")

    var p = document.createElement("p")
    p.innerHTML = '<i class="fa fa-font"></i>TEXT QUESTION'
    var input = document.createElement("input")
    input.type = "text"
    input.placeholder = "Enter your question here"

    var edit_buttons = document.createElement("div")
    edit_buttons.classList.add("edit-buttons")

    var delbtn = document.createElement("button")
    delbtn.classList.add("solid-btn", "red")
    delbtn.onclick = function() {
        deleteQuestion(this)
    }
    delbtn.innerText = "Delete"

    var div = document.createElement("div")
    var cancelbtn = document.createElement("button")
    cancelbtn.classList.add("outlined-btn")
    cancelbtn.onclick = function() {
        cancelEdit(this)
    }
    cancelbtn.innerText = "Cancel"
    
    var savebtn = document.createElement("button")
    savebtn.classList.add("solid-btn")
    savebtn.onclick = function() {
        saveEdit(this)
    }
    savebtn.innerText = "Save"

    question.append(edit_view)
    edit_view.append(p,input,edit_buttons)
    edit_buttons.append(delbtn,div)
    div.append(cancelbtn,savebtn)
    
    
    document.getElementById("form").appendChild(question)

}


var form_title = document.getElementById("form_title")
form_title.onblur = function() {
    //Save title to firebase
    console.log("test")
}

function toggleEdit(e) {
    var question = e.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[1].classList.toggle("hidden")
}

function cancelEdit(e) {
    var question = e.parentNode.parentNode.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[1].classList.toggle("hidden")
}

function saveEdit(e) {
    var type = e.parentNode.parentNode.parentNode.parentNode.getAttribute("name")
    var question_view = e.parentNode.parentNode.parentNode.parentNode.children[0]
    var edit_view = e.parentNode.parentNode.parentNode.parentNode.children[1]
    
    question_view.children[1].innerText = edit_view.children[1].value

    if (type != "text") {
        question_view.children[2].innerHTML = ""
        var temp = edit_view.children[2].value.split(/\r?\n/);
        for (a of temp) {
            var input = document.createElement("input");
            input.type = type;
            input.disabled = true;
            var label = document.createElement("label");
            label.appendChild(input)
            label.appendChild(document.createTextNode(a))
            question_view.children[2].appendChild(label)
        }
    }
    var question = e.parentNode.parentNode.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[1].classList.toggle("hidden")
}

function deleteQuestion(e) {
    e.parentNode.parentNode.parentNode.remove()
}