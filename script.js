var index = 1

var tx = document.getElementsByTagName('textarea');
for (var i = 0; i < tx.length; i++) {
    tx[i].addEventListener("input", OnInput, false);
}

$(function () {
    $("ol.example").sortable();
});

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
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
    var input = document.createElement("input");
    input.type = "text";
    input.name = index;
    var label = document.createElement("label");
    label.setAttribute("for", index);
    label.innerText = question
    item.appendChild(label)
    item.appendChild(input)
    item.appendChild(sublist)
    form.appendChild(item)
}

// function textAnswer(index, question) {
//     var form = document.getElementById("form")
//     var input = document.createElement("input");
//     input.type = "text";
//     input.name = index;
//     var label = document.createElement("label");
//     label.setAttribute("for", index);
//     label.innerText = index + ". " + question
//     form.appendChild(label)
//     form.appendChild(input)
//     form.innerHTML += "<br>"
// }

function radioAnswer(index, question, answers) {
    var form = document.getElementById("form");
    var title = document.createElement("p");
    title.innerText = index + ". " + question
    form.appendChild(title)

    var temp = answers.split(/\r?\n/);
    for (a of temp) {
        var input = document.createElement("input");
        input.type = "radio";
        input.name = index;
        var label = document.createElement("label");
        label.setAttribute("for", index);
        label.innerText = a
        form.appendChild(label)
        form.appendChild(input)
    }
    form.innerHTML += "<br>"
}

function boxAnswer(index, question, answers) {
    var form = document.getElementById("form");
    var title = document.createElement("p");
    title.innerText = index + ". " + question
    form.appendChild(title)
    for (a of answers) {
        var input = document.createElement("input");
        input.type = "checkbox";
        input.name = index;
        var label = document.createElement("label");
        label.setAttribute("for", index);
        label.innerText = a
        form.appendChild(label)
        form.appendChild(input)
    }
    form.innerHTML += "<br>"
}