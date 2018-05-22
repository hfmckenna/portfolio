searchInput.addEventListener("keyup", function () {//filters channels by name
    var searchBarFilter = document.getElementById("searchInput").value;

    mutateArray(searchBarFilter);
});

allBtn.addEventListener("click", function () {//all channels
    mutateArray();
});

liveBtn.addEventListener("click", function () {//only channels that are broadcasting
    var liveFilterBtn = [];
    for (var i = 0; i < twitchApp.channelResults.length; i++) {
        for (var j = 0; j < twitchApp.streamResults.length; j++) {
            if (twitchApp.channelResults[i].id == twitchApp.streamResults[j].id) {
                liveFilterBtn.push(twitchApp.channelResults[i]);
            }
        }
    }
    mutateArray(liveFilterBtn);
});

var twitchApp = {
    channelResults: [],
    streamResults: [],
    channels: [ //could add an input for people to add their own, rest of app should work, maybe with hover boxout for instructions how users can add
        "dryadtea",
        "mudfire",
        "toetoeenilation",
        "aurora_pine",
        "playinthemud",
        "dragonbackwards"
    ],
    screenSize: 8,
    mutatedArray: [],
    searchDisable: document.getElementById("searchInput"),
    liveDisable: document.getElementById("liveBtn"),
    allDisable: document.getElementById("allBtn")
};

function callchannels(data) {
    var chanArray = {};
    chanArray.name = data.display_name;
    chanArray.status = data.status;
    chanArray.url = data.url;
    chanArray.id = data._id;
    twitchApp.channelResults.push(chanArray);
    if (twitchApp.channelResults.length == twitchApp.channels.length) {
        timer(0, "streams");
    }
}

function callstreams(data) {
    // still needs setInterval to update stream status, around once per minute
    var streamArray = {};

    if (data.stream !== null) {
        streamArray.img = data.stream.preview.medium;//might add object value for small image for mobile, currently it crops this medium image on mobile so lots gets cut off
        streamArray.game = data.stream.game;
        streamArray.id = data.stream.channel._id;
        streamArray.live = true;
        twitchApp.streamResults.push(streamArray);
    } else {
        twitchApp.streamResults.push({});
    }
    console.log(twitchApp.streamResults.length);
    if (twitchApp.streamResults.length == twitchApp.channels.length) {
        mutateArray();
    }
}

function mutateArray(filtInput, pageNumInput) {//mutates global array to prevent too many API calls
    var paginationFooter = document.getElementById("pageNumbers");
    var initialPage = 0;
    while (paginationFooter.firstChild) {
        paginationFooter.removeChild(paginationFooter.firstChild);
    }
    if (window.innerWidth <= 1000 || undefined) {
        twitchApp.screenSize = 8;
    } else {
        twitchApp.screenSize = 4;
    }

    if (filtInput == null || "" || undefined) {
        twitchApp.mutatedArray = twitchApp.channelResults;
    } else if (typeof filtInput === "string") {
        twitchApp.mutatedArray = twitchApp.channelResults.filter(function (
            stringFilt
        ) {
            return (
                stringFilt.name.toLowerCase().indexOf(filtInput.toLowerCase()) !== -1
            );
        });
    } else if (typeof filtInput === "object") {
        twitchApp.mutatedArray = filtInput;
    }
    var pages = Math.ceil(twitchApp.mutatedArray.length / twitchApp.screenSize);

    for (var p = 1; p <= pages; p++) {
        var paginationBtn = document.createElement("button");
        paginationFooter.appendChild(paginationBtn);
        paginationBtn.innerHTML = p;
        paginationBtn.setAttribute("class", "btnNum" + p);
        paginationBtn.setAttribute(
            "onclick",
            "writeContent(twitchApp.mutatedArray,twitchApp.screenSize," +
            (p - 1) * twitchApp.screenSize +
            ")"
        );
    }

    writeContent(twitchApp.mutatedArray, twitchApp.screenSize, initialPage);
}

function writeContent(matchingNames, numberOfResults, firstPage) {//writes all the HTML for #results
    var mainHtml = document.getElementById("results");
    var i = firstPage;
    twitchApp.searchDisable.removeAttribute("disabled");
    twitchApp.liveDisable.removeAttribute("disabled");
    twitchApp.allDisable.removeAttribute("disabled");
    while (mainHtml.firstChild) {
        mainHtml.removeChild(mainHtml.firstChild);
    }
    for (i; i < firstPage + numberOfResults; i++) {
        var sectionChan = document.createElement("section");
        var imgChan = document.createElement("div");
        var headerChan = document.createElement("span");
        var paraChan = document.createElement("span");
        var linkChan = document.createElement("a");
        mainHtml.appendChild(sectionChan);
        headerChan.setAttribute("class", "headText");
        paraChan.setAttribute("class", "paraText");
        imgChan.setAttribute("class", "responsiveImg");
        linkChan.setAttribute("href", matchingNames[i].url);
        linkChan.setAttribute("target", "_blank");
        sectionChan.appendChild(imgChan);
        sectionChan.appendChild(headerChan);
        sectionChan.appendChild(paraChan);
        headerChan.appendChild(linkChan);
        linkChan.innerHTML = matchingNames[i].name;
        paraChan.innerHTML = matchingNames[i].status;
        imgChan.innerHTML = "Not Live";
        for (var j = 0; j < twitchApp.streamResults.length; j++) {
            if (matchingNames[i].id == twitchApp.streamResults[j].id) {//tried adding simple if statement to choose small image from API if numberOfResults = 8 but this broke the app
                imgChan.style.backgroundImage =
                    "url('" + twitchApp.streamResults[j].img + "')";
                imgChan.innerHTML = twitchApp.streamResults[j].game;
            }
        }
    }
}

function timer(i, selector) {
    twitchApp.searchDisable.setAttribute("disabled", "disabled");//ensures inputs disabled on refresh
    twitchApp.liveDisable.setAttribute("disabled", "disabled");
    twitchApp.allDisable.setAttribute("disabled", "disabled");
    setTimeout(function cycle() {
        var scriptChan = document.createElement("script");

        document.head.appendChild(scriptChan);

        scriptChan.setAttribute(
            "src",
            "https://wind-bow.gomix.me/twitch-api/" +
            selector +
            "/" +
            twitchApp.channels[i] +
            "?callback=call+" +
            selector
        );
        i++;
        if (i < twitchApp.channels.length) {
            scriptChan.parentNode.removeChild(scriptChan); // remove scripts from header

            timer(i, selector);
        } else {
            scriptChan.parentNode.removeChild(scriptChan);
        }
    }, 100); //limits rate of API calls
}
timer(0, "channels");
