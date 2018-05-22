submitBtn.addEventListener("click", function () {
    var searchText = document.getElementById("searchInput").value;
    searchIf(searchText);
});

searchInput.addEventListener("keyup", function (p) {
    if (p.keyCode === 13) {
        var searchText = document.getElementById("searchInput").value;
        searchIf(searchText);
    }
});

function searchIf(choices) {
    if (choices.toLowerCase() == "random") {
        window.open("https://en.wikipedia.org/wiki/Special:Random");
        return; //possibly a bit hacky
    }
    if (choices != "") {
        getText(choices);
    }
    else { };
}

function getText(inText) {
    var elements = document.getElementById("entries");
    while (elements.firstChild) {
        elements.removeChild(elements.firstChild);
    }

    var request = new XMLHttpRequest();
    request.open(
        "GET",
        "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&maxlag=3&uselang=user&errorlang=uselang&origin=*&search=" +
        inText,
        true
    );

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var data = JSON.parse(this.responseText);
                getData(data);
            } else {
                //API state or status response error
            }
        }
    };
    request.send();
    request = null;
}

function getData(wiki) {
    if (wiki[1] != "") {
        for (var i = 0; i < wiki[1].length; i++) {
            var newRow = document.createElement("tr");
            var newCol1 = document.createElement("td");
            newCol1.setAttribute(
                "style",
                "background-color: #FFC200; border:3px groove #C59600;"
            );
            var newCol2 = document.createElement("td");
            var newName = document.createTextNode(wiki[1][i]);
            var newContent = document.createTextNode(wiki[2][i]);
            var a = document.createElement("a");
            a.setAttribute("target", "about_blank");
            a.href = wiki[3][i];
            a.innerHTML = wiki[1][i];

            newCol1.appendChild(a);
            newCol2.appendChild(newContent);

            var currentTab = document.getElementById("entries");

            currentTab.appendChild(newRow);
            newRow.appendChild(newCol1);
            newRow.appendChild(newCol2);
            newCol1.setAttribute("width", "helloButton");
            window.getComputedStyle(newCol1).opacity; // recalculate initial opacity value to allow transition fade
            window.getComputedStyle(newCol2).opacity;
            newCol1.className = "in";
            newCol2.className = "in";
        }
    } else { alert("No Match for:" + wiki[0]) }//maybe come up with something more elegant than an alert

}
