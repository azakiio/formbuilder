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
const formdata = document.createElement("div")

firebase.database().ref(`/form-list/${formID}`).once('value').then(function (snapshot) {
    formdata.innerHTML = snapshot.val().content
    document.getElementById("form-title").innerText = snapshot.val().name
    document.getElementById("custom_instructions").innerText = snapshot.val().instructions
    loadQuestions()
    document.querySelector(".numbers").children[1].innerText = formdata.children.length

    var newRef = snapshot.child(`working-group/${userID}`)
    if (newRef.hasChild("answers")) {
        var params = new URLSearchParams(newRef.val().answers)
        for (var param of params) {
            var question = document.getElementsByName(param[0])
            for (var answer of question) {
                if(answer.type == "radio" && answer.value == param[1]){
                    answer.checked = true

                }
                else if (answer.type == "text"){
                    answer.value = param[1]
                }
                else if (answer.type == "checkbox"){
                    answer.checked = true
                    updateScores(answer)
                }
            }

        }
    }
    updateOverall()




}, function (err) {
    console.log(err)
});

function submitForm(e) {
    firebase.database().ref(`/form-list/${formID}/working-group`).once("value").then(function(snapshot){
        if(snapshot.hasChild(userID)){
            firebase.database().ref(`/form-list/${formID}/working-group/${userID}`).update({
                answers: $('form').serialize()
            })
            var currDate = new Date().toLocaleString();
            document.getElementById("lastSaved").innerText = `Last Saved at: ${currDate}`
        
            if (e.innerText=="Submit")
            swal(
                'Thanks for submitting!',
                'Your answers have been submitted.',
                'success'
              )
        } else {
            console.log("Broken Link")
        }
    })
}

function updateScores(e) {
    if (e.checked) {
        e.parentNode.parentNode.parentNode.children[1].classList.add("inactive")
    } else {
        e.parentNode.parentNode.parentNode.children[1].classList.remove("inactive")
    }
    updateOverall()
}


function updateOverall(){
    var overalls = document.getElementsByClassName("overall-score")
    var checkedCount = 0
    for(var overall of overalls){
        // console.log(overall.parentNode.parentNode.children[0].children[0].children[0])
        if(overall.parentNode.parentNode.children[0].children[0].children[0].checked){
            checkedCount += 1
        } else{
            var labels = overall.children[1]
            for (var label of labels.children){
                checkedCount += label.children[0].checked ? 1 : 0;
            }
        }
    // console.log(overall, checkedCount)
    }
    document.querySelector(".numbers").children[0].innerText = checkedCount
}

function toggleComment(e) {
    e.classList.toggle("hidden")
    e.parentNode.children[0].classList.toggle("active")
}


function loadQuestions() {
    var main_container = document.getElementById("main")

    for (var question of formdata.children) {
        var qID = question.id
        var conditionhtml = question.children[0].children[1].outerHTML
        var questionhtml = question.children[0].children[2].outerHTML
        var answerhtml = question.children[0].children[3].outerHTML
        main_container.innerHTML +=
            `<div id="${qID}" class="question-container">
    <div class="left-container">
        <label class="opt-out">
            <input type="checkbox" id="opt-out-${qID}" name="opt-out-${qID}" onchange="updateScores(this)"> <span class="label-text"> Opt Out</span>
        </label>
        ${conditionhtml}
        ${questionhtml}
        ${answerhtml}
    </div>

    <div class="right-container">
        <div class="clarity-relevance">
            <div class="clarity-score">
                <p>Clarity</p>
                <div class="scale">
                    <label>Unclear</label>
                    <label class="score-label">1<input value="1" name="clarity-${qID}" type="radio"></label>
                    <label class="score-label">2<input value="2" name="clarity-${qID}" type="radio"></label>
                    <label class="score-label">3<input value="3" name="clarity-${qID}" type="radio"></label>
                    <label class="score-label">4<input value="4" name="clarity-${qID}" type="radio"></label>
                    <label class="score-label">5<input value="5" name="clarity-${qID}" type="radio"></label>
                    <label>Clear</label>
                </div>
            </div>

            <div class="relevance-score">
                <p>Relevance</p>
                <div class="scale">
                    <label>Irrelevant</label>
                    <label class="score-label">1<input value="1" name="relevance-${qID}" type="radio"></label>
                    <label class="score-label">2<input value="2" name="relevance-${qID}" type="radio"></label>
                    <label class="score-label">3<input value="3" name="relevance-${qID}" type="radio"></label>
                    <label class="score-label">4<input value="4" name="relevance-${qID}" type="radio"></label>
                    <label class="score-label">5<input value="5" name="relevance-${qID}" type="radio"></label>
                    <label>Relevant</label>
                </div>
            </div>
        </div>

        <div class="overall-score" onchange="updateOverall()">
            <p>Overall</p>
            <div>
                <label><input value="Include" name="overall-${qID}" type="radio">Include</label>
                <label><input value="Optional" name="overall-${qID}" type="radio">Optional</label>
                <label><input value="Do Not Include" name="overall-${qID}" type="radio">Do not include</label>
            </div>
        </div>
    </div>

    <div class="comment">
        <button class="comment-btn" onclick="toggleComment(this.parentNode.children[1])"><i class="fas fa-plus"></i>Comment</button>
        <div class="comment-box hidden">
            <p>ADD COMMENT</p>
            <input name="comment-${qID}" type="text" placeholder="Enter your comment here">
            <div class="comment-buttons">
                <button class="main-btn" onclick="toggleComment(this.parentNode.parentNode)">Save</button>
            </div>  
        </div>
    </div>
</div>`
    }

    main_container.innerHTML += `<button onclick="submitForm(this)" class="submit-btn">Submit</button>`

}


function showInstructions(e) {
    document.getElementById("score-instructions").classList.toggle("hidden");
    e.classList.toggle("oh-blue");
    console.log(e.innerHTML);

    if (e.innerHTML === `<i class="fas fa-minus-circle" aria-hidden="true"></i>Click to hide instructions`) {
        e.innerHTML = `<i class="fas fa-plus-circle"></i>Click to show instructions`
    } else {
        e.innerHTML = `<i class="fas fa-minus-circle" aria-hidden="true"></i>Click to hide instructions`;
    }
}