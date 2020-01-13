var index = 0;

var tx = document.getElementsByTagName('textarea');
for (var i = 0; i < tx.length; i++) {
    tx[i].addEventListener("input", OnInput, false);
}

$(function () {
    $("ol.example").sortable({
        distance: 100
    });
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
    item.appendChild(document.createTextNode(question))

    var delbtn = document.createElement("button")
    delbtn.innerText = "Delete"
    delbtn.setAttribute("class", "delbtn")
    delbtn.onclick = function () {
        item.parentNode.removeChild(item);
    }
    item.appendChild(delbtn)

    var delbtn = document.createElement("button")
    delbtn.innerText = "Delete"
    delbtn.setAttribute("class", "delbtn")
    delbtn.onclick = function () {
        item.parentNode.removeChild(item);
    }
    item.appendChild(delbtn)

    var input = document.createElement("input");
    input.type = "text";
    input.name = index
    item.appendChild(input)
    item.appendChild(sublist)
    form.appendChild(item)
}

function otherAnswer(index, type, question, answers) {
    var form = document.getElementById("form");
    var item = document.createElement("li")
    var sublist = document.createElement("ol")
    item.appendChild(document.createTextNode(question))

    var delbtn = document.createElement("button")
    delbtn.innerText = "Delete"
    delbtn.setAttribute("class", "delbtn")
    delbtn.onclick = function () {
        item.parentNode.removeChild(item);
    }
    item.appendChild(delbtn)

    var temp = answers.split(/\r?\n/);
    for (a of temp) {
        var input = document.createElement("input");
        input.type = type;
        input.name = index;
        var label = document.createElement("label");
        label.appendChild(input)
        label.appendChild(document.createTextNode(a))
        item.appendChild(label)
    }
    item.appendChild(sublist)
    form.appendChild(item)
}