$('textarea').each(function () {
    this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
}).on('input focus', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
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
const urlParams = new URLSearchParams(window.location.search);
var formID = urlParams.get("k")
const targetNode = document.getElementById('form');
var globalID = null

function editView() {
    document.getElementById("edit_form").classList.add("selected");
    document.getElementById("view_results").classList.remove("selected");

    document.getElementById("form").classList.remove("hidden")
    document.querySelector(".form-buttons").classList.remove("hidden")
    document.querySelector(".filters").classList.add("hidden")
    document.querySelector(".results-container").classList.add("hidden")


}

function resultsView() {
    document.getElementById("edit_form").classList.remove("selected");
    document.getElementById("view_results").classList.add("selected");

    document.getElementById("form").classList.add("hidden")
    document.querySelector(".form-buttons").classList.add("hidden")
    document.querySelector(".filters").classList.remove("hidden")
    document.querySelector(".results-container").classList.remove("hidden")
    // viewResults()
}

// const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
firebase.database().ref('/form-list/' + formID).once('value').then(function (snapshot) {
    targetNode.innerHTML = snapshot.val().content
    document.getElementById("form_title").innerText = snapshot.val().name
    globalID = snapshot.val().qID

    var ref = firebase.database().ref(`/form-list/${formID}/working-group`)
    //var data = {}
    ref.once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var participants = document.getElementById("participants")
            if (childSnapshot.hasChild("answers")) {
                //data[childSnapshot.key] = childSnapshot.val()
                participants.innerHTML += `<option value="${childSnapshot.key}">${childSnapshot.val().email}</option>`
            }
        });
    });

}, function (err) {
    targetNode.innerText = err;
    targetNode.innerText += "Please return Home and Login"
});


function viewResults() {
    // var results_body = document.getElementById("results-body")
    // console.log(answers)
    // for (var question of targetNode.children) {
    //     var qID = question.id
    //     var clarity = []
    //     var relevance = []
    //     var overall = []
    //     var comments = []
    //     for (var item of Object.values(data)) {
    //         // console.log(item.answers)
    //         const answerDict = new URLSearchParams(item.answers);
    //         console.log(answerDict)
    //         clarity.push(parseInt(answerDict.get(`clarity-${qID}`)))
    //         relevance.push(parseInt(answerDict.get(`relevance-${qID}`)))
    //         overall.push(answerDict.get(`overall-${qID}`))
    //         comments.push(answerDict.get(`${qID}`))
    //     }
    //     console.log(clarity)
    //     console.log(arrAvg(clarity))

    //     let avg_relevance = relevance.reduce((previous, current) => current += previous, 0) / relevance.length;

    //     const newArray = oldArray.filter(function (value) {
    //         return !Number.isNaN(value);
    //     });

    //     // let avg_c = clarity.reduce((previous, current) => current += previous) / clarity.length;

    //     var questionhtml = question.children[0].children[2].innerText
    //     results_body.innerHTML += `<tr>
    //                                     <td>${questionhtml}
    //                                     </td>
    //                                     <td>${1}</td>
    //                                     <td>${1}</td>
    //                                     <td>${1} <br> ${2} <br> ${3}</td>
    //                                     <td>Text</td>
    //                                 </tr>`
    // }
}


function updateResults(e) {
    firebase.database().ref(`/form-list/${formID}/working-group/${e}/answers`).once("value").then(function (snapshot) {
        var results_body = document.getElementById("results-body")
        results_body.innerHTML = ''
        var params = new URLSearchParams(snapshot.val())
        for (var question of targetNode.children) {
            var qID = question.id
            var opt_out = params.get(`opt-out-${qID}`)
            if (opt_out != "on") {
                var clarity = parseInt(params.get(`clarity-${qID}`))
                var relevance = parseInt(params.get(`relevance-${qID}`))
                var overall = params.get(`overall-${qID}`)
                var comment = params.get(`comment-${qID}`)
            } else {
                var clarity = relevance = overall = comment = "OPTOUT"
            }


            var questionhtml = question.children[0].children[2].innerText
            results_body.innerHTML += `<tr>
                                        <td>${questionhtml}
                                        </td>
                                        <td>${clarity}</td>
                                        <td>${relevance}</td>
                                        <td>${overall}</td>
                                        <td>${comment}</td>
                                    </tr>`
        }
    });
}


function save() {
    firebase.database().ref('/form-list/' + formID)
        .update({
            content: targetNode.innerHTML,
            name: document.getElementById("form_title").innerText,
            qID: globalID
        });
    var currDate = new Date().toLocaleString();
    document.getElementById("lastSaved").innerText = `Last Saved at: ${currDate}`
}


function addQuestion(place, parent) {
    var question = document.createElement("div")
    question.classList.add("question")
    question.setAttribute("name", place)
    if (parent == -1) {
        question.id = ++globalID
    } else {
        question.id = `${parent}.${document.getElementById(parent).getAttribute("data-childCount")}`
    }

    question.setAttribute("data-childCount", 0)

    var question_view = document.createElement("div")
    question_view.classList.add("question-view", "hidden")
    var pencil = document.createElement("i")
    pencil.classList.add("fa", "fa-pencil")
    pencil.setAttribute("onClick", "toggleEdit(this)")

    var child_condition = document.createElement("p")
    child_condition.classList.add("child-condition")
    if (parent == -1) {
        child_condition.classList.add("hidden")
    }

    var p = document.createElement("p")
    p.setAttribute("name", "question")

    var answers = document.createElement("div")
    answers.setAttribute("name", "answers")

    if (place == "text") {
        var input = document.createElement("input")
        input.classList.add("text-answer")
        input.type = place
        input.disabled = true
        input.placeholder = "Written Answer..."
        answers.append(input)
    }

    question.append(question_view)
    question_view.append(pencil, child_condition, p, answers)

    var add_child = document.createElement("div")
    add_child.classList.add("add-child")
    // add_child.setAttribute("onmouseout", "hideMenu(this)")

    var child_btn = document.createElement("button")
    child_btn.classList.add("child-btn")
    child_btn.innerText = "+"
    child_btn.setAttribute("onClick", "addChild(this)")


    var child_menu = document.createElement("div")
    child_menu.classList.add("child-menu")

    var p = document.createElement("p")
    p.innerText = 'Add a child question'
    var text_child = document.createElement("a")
    text_child.innerHTML = '<i class="fa fa-font"></i>Text'
    text_child.setAttribute("onClick", "incrementParent(this); addQuestion('text', this.parentNode.parentNode.parentNode.id); hideMenu(this)")

    var single_child = document.createElement("a")
    single_child.innerHTML = '<i class="far fa-dot-circle"></i>Single Select'
    single_child.setAttribute("onClick", "incrementParent(this);addQuestion('radio', this.parentNode.parentNode.parentNode.id); hideMenu(this)")

    var multi_child = document.createElement("a")
    multi_child.innerHTML = '<i class="fa fa-check-square"></i>Multi Select'
    multi_child.setAttribute("onClick", "incrementParent(this); addQuestion('checkbox', this.parentNode.parentNode.parentNode.id); hideMenu(this)")

    child_menu.append(p, text_child, single_child, multi_child)
    add_child.append(child_btn, child_menu)
    question.append(add_child)


    var edit_view = document.createElement("div")
    edit_view.classList.add("edit-view")

    var p = document.createElement("p")
    if (place == "text") {
        p.innerHTML = '<i class="fa fa-font"></i>TEXT QUESTION'
    } else if (place == "radio") {
        p.innerHTML = '<i class="far fa-dot-circle"></i>SINGLE SELECT QUESTION'
    } else {
        p.innerHTML = '<i class="fa fa-check-square"></i>MULTI SELECT QUESTION'
    }

    var input = document.createElement("input")
    input.type = "text"
    input.placeholder = "Enter your question here"

    var edit_buttons = document.createElement("div")
    edit_buttons.classList.add("edit-buttons")

    var delbtn = document.createElement("button")
    delbtn.classList.add("solid-btn", "red")
    delbtn.setAttribute("onClick", "deleteQuestion(this)")
    delbtn.innerText = "Delete"

    var div = document.createElement("div")
    var cancelbtn = document.createElement("button")
    cancelbtn.classList.add("outlined-btn")
    cancelbtn.setAttribute("onClick", "cancelEdit(this)")
    cancelbtn.innerText = "Cancel"

    var savebtn = document.createElement("button")
    savebtn.classList.add("solid-btn")
    savebtn.setAttribute("onClick", "saveEdit(this)")
    savebtn.innerText = "Save"

    question.append(edit_view)

    edit_view.append(p)

    var child_condition_select = document.createElement("div")
    if (parent != -1 && document.getElementById(parent).getElementsByTagName("label").length != 0) {
        child_condition_select.classList.add("child-condition-select")

        var condition_p = document.createElement("p")
        condition_p.innerText = "Show if Answered: "

        var condition_answers = document.createElement("select")

        parentQuestion = document.getElementById(parent)
        var option = document.createElement("option")

        for (var answer of parentQuestion.getElementsByTagName("label")) {
            var option = document.createElement("option")
            option.innerText = answer.innerText
            condition_answers.append(option)
        }
        child_condition_select.append(condition_p, condition_answers)
    }
    edit_view.append(child_condition_select, input)

    if (place != "text") {
        var textarea = document.createElement("textarea")
        textarea.placeholder = "Enter Line-Separated Answers"
        edit_view.append(textarea)
    }

    edit_view.append(edit_buttons)
    edit_buttons.append(delbtn, div)
    div.append(cancelbtn, savebtn)

    if (parent == -1) {
        document.getElementById("form").appendChild(question)
    } else if (parseInt(document.getElementById(parent).getAttribute("data-childCount")) == 1) {
        document.getElementById(parent).after(question)
    } else {
        var flag = false
        var childCount = parseInt(document.getElementById(parent).getAttribute("data-childCount"))
        for (var i = childCount; i > 0; i--) {
            var currentID = document.getElementById(`${parent}.${i}`)
            if (currentID != null) {
                currentID.after(question)
                flag = true
                break
            }
        }
        if (!flag) {
            document.getElementById(parent).after(question)
        }
    }

    window.scrollTo(0, document.body.scrollHeight);
    $('textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}


var form_title = document.getElementById("form_title")
form_title.onblur = function () {
    save()
}

function toggleEdit(e) {
    var question = e.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[2].classList.toggle("hidden")
}

function cancelEdit(e) {
    var question = e.parentNode.parentNode.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[2].classList.toggle("hidden")
}

function saveEdit(e) {
    var type = e.parentNode.parentNode.parentNode.parentNode.getAttribute("name")
    var qID = e.parentNode.parentNode.parentNode.parentNode.id
    var question_view = e.parentNode.parentNode.parentNode.parentNode.children[0]
    var edit_view = e.parentNode.parentNode.parentNode.parentNode.children[2]

    question_view.children[2].innerText = `${qID}. ${edit_view.children[2].value}`

    if (edit_view.getElementsByTagName("select").length != 0) {
        var answers = edit_view.getElementsByTagName("select")[0]
        question_view.children[1].innerText = `Child of: ${qID}, Condition: ${answers.options[answers.selectedIndex].text}`
    } else {
        question_view.children[1].innerText = `Child of: ${qID}`
    }

    if (type != "text") {
        question_view.children[3].innerHTML = ""
        var temp = edit_view.children[3].value.split(/\r?\n/);
        for (a of temp) {
            var input = document.createElement("input");
            input.type = type;
            input.disabled = true;
            var label = document.createElement("label");
            label.appendChild(input)
            label.appendChild(document.createTextNode(a))
            question_view.children[3].appendChild(label)
        }
    }
    var question = e.parentNode.parentNode.parentNode.parentNode.children
    question[0].classList.toggle("hidden")
    question[2].classList.toggle("hidden")
    save()
}

function deleteQuestion(e) {
    e.parentNode.parentNode.parentNode.remove()
}

function addChild(e) {
    e.classList.toggle("active")
    e.parentNode.children[1].classList.toggle("expand")
}

// function hideMenu(e) {
//     e.children[0].classList.remove("active")
//     e.children[1].classList.remove("expand")
// }

function hideMenu(e) {
    e.parentNode.parentNode.children[0].classList.remove("active")
    e.parentNode.classList.remove("expand")
}

function incrementParent(e) {
    var childCount = parseInt(e.parentNode.parentNode.parentNode.getAttribute("data-childCount"))
    e.parentNode.parentNode.parentNode.setAttribute("data-childCount", ++childCount)
}

// function decrementParent(e) {
//     var id = e.parentNode.parentNode.parenntNode.id
//     var parentID = id.substr(0, id.lastIndexOf("."));
//     var childCount = parseInt(document.getElementById(parentID).getAttribute("data-childCount"))
//     document.getElementById(parentID).setAttribute("data-childCount", Math.max(--childCount, 0))
// }

function share() {
    document.querySelector(".share").classList.toggle("hidden")
}

function toXML() {
    var form = document.getElementById("form")
    var prevLevel = -10
    var currLevel = null
    var xml = `<body title="${document.getElementById("form_title").innerText}">`
    for (var q of form.children) {

        var qID = q.id
        currLevel = qID.split(".").length
        var question = q.children[0].children[2].innerText
        var answers = q.children[0].children[3].innerText.split("\n")

        if (currLevel - prevLevel == 0) {
            xml += `</Question>`
        }

        if (currLevel - prevLevel == 1) {
            xml += `<ChildItems>`
        }

        if (currLevel - prevLevel <= -1) {
            var lvlchange = Math.abs(currLevel - prevLevel)
            xml += `</Question></ChildItems>`.repeat(lvlchange)
            xml += `</Question>`
        }

        if (q.getAttribute("name") == "text") {
            xml += `<Question title="${question}" ID="${qID}">
        <ResponseField><Response><string val=""/></Response></ResponseField>`
        }

        if (q.getAttribute("name") != "text") {
            var list_items = ""
            for (var item of answers) {
                list_items += `<ListItem title="${item}"/>`
            }
            xml +=
                `<Question title="${question}" ID="${qID}">
                <ListField><List>${list_items}</List></ListField>`
        }
        prevLevel = currLevel
    }

    xml += `</Question></ChildItems>`.repeat(currLevel - 1)
    xml += `</Question></body>`
    var blob = new Blob([xml], { type: "text/xml" });
    saveAs(blob, `${document.getElementById("form_title").innerText}.xml`)

}

function getShared() {
    document.getElementById("share-modal").style.display = "block";
    var ref = firebase.database().ref(`/form-list/${formID}/working-group`)
    ref.once('value').then(function (snapshot) {
        var output = document.getElementById("email-links")
        output.innerHTML = `<p id="share-msg">Click on each link to email it to the receiver:</p>`
        snapshot.forEach(function (childSnapshot) {
            var hashmail = childSnapshot.key;
            var email = childSnapshot.val().email
            var link = `/homework/?k=${formID}&u=${hashmail}`
            output.innerHTML += `<div class="share-email">
                                <label>${email}</label>
                                <a onclick="copyLink('${link}')"><i class="fas fa-copy"></i>Copy Link</a>
                                <a href="mailto:${email}?subject=Question Voting&body=Hello, please complete your voting at the following link: ${link}")"><i class="fas fa-paper-plane"></i>Send Email</a>
                                <a onclick="removeUser('${hashmail}')"><i class="fas fa-user-minus"></i>Remove User</a>
                                </div>`
        });
    });
};

function generateLinks() {
    var emails = document.getElementById("email-list").value.split(/\r?\n/);
    var ref = firebase.database().ref(`/form-list/${formID}/working-group`)
    ref.once('value').then(function (snapshot) {
        for (var email of emails) {
            var hashmail = CryptoJS.MD5(email) + "";
            if (!snapshot.hasChild(hashmail)) {
                ref.update({
                    [hashmail]: {
                        email: email
                    }
                })
            }
        }
        getShared()
    });

};

function copyLink(str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = { position: 'absolute', left: '-9999px' };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}

function removeUser(hashmail) {
    firebase.database().ref(`/form-list/${formID}/working-group/${hashmail}`).remove()
    getShared()
}


// When the user clicks on <span> (x), close the modal
function closeModal() {
    document.getElementById("share-modal").style.display = "none";
}