window.onload = function() {
    console.log("Loading check 4");
}

console.log("top of page 5")
let poems1 = []

fetch("patsv.tsv")
  .then(response => response.text())
    .then(tsvText => {
        let lines = tsvText.trim().split("\n")
        let poems = []
        
        for (let i = 1; i < lines.length; i++) {
            let currentLine = lines[i].split("\t")
            poems.push({
                "title": currentLine[0],
                "first": parseFirst(currentLine[1]),
                "last": parseLast(currentLine[1]),
                "topics": currentLine[2].split(","),
                "link": currentLine[3]
            })
        }
        displayPoems(poems)
        poems1 = poems
    })
    .catch(error => console.error("Error loading TSV:", error))

        //console.log(poems1)
function displayPoems(poems) {
    //console.log(poems)
    let poemsDiv = document.querySelector("#listView")
    poemsDiv.innerHTML = ``

    for (let i = 0; i < poems.length; i++) {
      let culmulative = ""
        culmulative += `<div class = "item">`
        culmulative += `<h2><a href="${poems[i]["link"]}">${poems[i]["title"]}</a></h2>`
        culmulative += `<p>by   ${poems[i]["first"]} ${poems[i]["last"]}</p>`
        culmulative += '</div>'
        
        poemsDiv.innerHTML += culmulative
    }
}

navHead = document.getElementById("navHead").addEventListener("click", () => refresh())

let searchBarPoem = document.getElementById("searchBarPoem");
console.log("hi")
console.log(searchBarPoem);
searcher = document.getElementById("searcher").addEventListener("click", () => searchPoems(searchBarPoem.value));

//document.getElementById("searcher").addEventListener("click", () => searchPoems("angelou"))

function refresh() {
    displayPoems(poems1)
    var searchBarPoem = document.getElementById("searchBarPoem")
    searchBarPoem.value = ""
}

function searchPoems(userInput) {
    console.log(userInput)
    var toDisplay = []
    var userArr = userInput.split(" ")
    for (let i = 0; i < poems1.length; i++) {
      console.log(i)
      var relevanceIndex = 0
      var titleWords = poems1[i]["title"].split(" ")
      
      var keywords = [poems1[i]["first"].toString(), poems1[i]["last"].toString()]
      keywords = keywords.concat(titleWords)
      
      
      for (let j = 0; j < keywords.length; j++) {
          for (let k = 0; k < userArr.length; k++) {
              var check1 = keywords[j].toString()
              check1 = check1.toLowerCase()
              var check2 = userArr[k].toString()
              check2 = check2.toLowerCase()
              if (check1.includes(check2) || check2 == (check1)) {
                  if (check1 != "" && check2 != "") {
                    console.log("WORKED")
                    console.log(check1)
                    console.log(check2)
                    relevanceIndex += 1
                  }
              }
          }
      }
      console.log("POEM" + i)
      console.log(keywords)
      console.log(userArr)
      console.log(toDisplay)
      console.log(relevanceIndex)
      if (relevanceIndex > 0) {
          toDisplay.push(poems1[i])
      }
    }
    console.log("HI9")
    console.log(toDisplay)
    if (toDisplay.length > 0) {
        displayPoems(toDisplay)
    } else {
        let poemsDiv = document.querySelector("#listView")
        poemsDiv.innerHTML = `<p></p>`
        poemsDiv.innerHTML += `<p id="noResults">No results matched your search.</p>`
        poemsDiv.innerHTML += `<p></p>`
    }
}


function parseLast(fl ="") {
    let str = fl.toString()
    return str.slice(0, str.indexOf(","))
}

function parseFirst(fl ="") {
    let str = fl.toString()
    return str.slice(str.indexOf(",")+2, str.length)
}

let topicButtons = document.querySelectorAll(".dropdown-item")
console.log(topicButtons)

for (let i = 0; i < topicButtons.length; i++) {
    let txt = topicButtons[i].textContent
    console.log(txt)
    topicButtons[i].addEventListener("click", () => {
        searchByTopic(txt.trim())
    })
    // console.log(txt)
}

function searchByTopic(userInput) {
    //console.log(userInput)
    var toDisplay = []
    for (let i = 0; i < poems1.length; i++) {
        var topicList = poems1[i]["topics"]
        for (let j = 0; j < topicList.length; j++) {
            console.log(topicList[j])
            console.log(userInput)
            console.log(topicList[j].includes(userInput) && topicList[j] != " " && topicList[j] != null)
            if (topicList[j].includes(userInput)) {
                toDisplay.push(poems1[i])
            }
        }
        console.log(toDisplay)
    }
    displayPoems(toDisplay)
}