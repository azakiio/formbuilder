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

firebase.database().ref('/form-list/' + formID).once('value').then(function (snapshot) {
    formdata.innerHTML = snapshot.val().content
    loadQuestions()
}, function (err) {
    console.log(err)
});

function submitForm(e) {
    e.preventDefault()
    console.log($('form').serialize())

}

function toggleScores(e) {
    e.parentNode.parentNode.parentNode.children[1].classList.toggle("inactive")
}

function toggleComment(e){
    e.classList.toggle("hidden")
    e.parentNode.children[0].classList.toggle("active")
}


function loadQuestions() {
    var main_container = document.getElementById("main")

    for (var question of formdata.children) {
        var qID = question.id
        var questionhtml = question.children[0].children[2].innerHTML
        var answerhtml = question.children[0].children[3].innerHTML


        main_container.innerHTML +=
            `<div id="${qID}" class="question-container">
    <div class="left-container">
        <label class="opt-out">
            <input type="checkbox" id="opt-out-${qID}" name="opt-out-${qID}" onclick="toggleScores(this)"> <span class="label-text"> Opt Out</span>
        </label>
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

        <div class="overall-score">
            <p>Overall</p>
            <div>
                <label><input value="include" name="overall-${qID}" type="radio">Include</label>
                <label><input value="optional" name="overall-${qID}" type="radio">Optional</label>
                <label><input value="exclude" name="overall-${qID}" type="radio">Do not include</label>
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
}