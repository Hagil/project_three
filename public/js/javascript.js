// Create a "close" button and append it to each list item
console.log('tech loaded');
var myNodelist = document.getElementsByTagName("li");
var counter;
for (counter = 0; counter < myNodelist.length; counter++) {
    console.log('looping through lis')
    var span = document.createElement("span");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[counter].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var counter;
for (counter = 0; counter < close.length; counter++) {
    close[counter].onclick = function () {
        console.log('clicked')
        var div = this.parentElement;
        div.style.display = "none";
    }
}
// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    console.log(ev.target.tagName);
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("myInput").value;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("myUL").appendChild(li);
    }
    document.getElementById("myInput").value = "";

    var span = document.createElement("span");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (counter = 0; counter < close.length; counter++) {
        close[counter].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
}