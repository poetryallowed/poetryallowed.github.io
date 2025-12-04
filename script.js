let poems1 = []

fetch("patsv.tsv")
  .then(response => response.text())
    .then(tsvText => {
        let lines = tsvText.trim().split("\n")
        let poems = []
        
        for (let i = 0; i < lines.length; i++) {
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

// displayPoems function: takes in an array of poems (taken from the tsv) and displays them in the html
function displayPoems(poems) {

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

navHead = document.getElementById("navHead")
navHead.addEventListener("click", () => refresh())

let searchBarPoem = document.getElementById("searchBarPoem")

searcher = document.getElementById("searcher")
searcher.addEventListener("click", () => searchPoems(searchBarPoem.value))


// refresh function: clears any searches and sets the page to its default state
function refresh() {
    displayPoems(poems1)
    searchBarPoem.value = ""
}

// searchPoems function: takes in a string for search input and displays poems whose authors or titles contain that string
// possible future update: prioritize results by relevance to search
function searchPoems(userInput) {
    let toDisplay = []
    let userArr = userInput.split(" ")
    for (let i = 0; i < poems1.length; i++) {
      let relevanceIndex = 0
      let titleWords = poems1[i]["title"].split(" ")
      
      let keywords = [poems1[i]["first"].toString(), poems1[i]["last"].toString()]
      keywords = keywords.concat(titleWords)
      
      
      for (let j = 0; j < keywords.length; j++) {
          for (let k = 0; k < userArr.length; k++) {
              let check1 = keywords[j].toString()
              check1 = check1.toLowerCase()
              let check2 = userArr[k].toString()
              check2 = check2.toLowerCase()
              if (check1.includes(check2) || check2 == (check1)) {
                  if (check1 != "" && check2 != "") {
                    relevanceIndex += 1
                  }
              }
          }
      }
      if (relevanceIndex > 0) {
          toDisplay.push(poems1[i])
      }
    }
    if (toDisplay.length > 0) {
        displayPoems(toDisplay)
    } else {
        let poemsDiv = document.querySelector("#listView")
        poemsDiv.innerHTML = `<p></p>`
        poemsDiv.innerHTML += `<p id="noResults">No results matched your search.</p>`
        poemsDiv.innerHTML += `<p></p>`
    }
}

//parseLast function: takes a name formatted as last, first and outputs the last name
function parseLast(fl ="") {
    return fl.slice(0, fl.indexOf(","))
}

//parseFirst function: takes a name formatted as last, first and outputs the first name
function parseFirst(fl ="") {
    return fl.slice(fl.indexOf(",")+2, fl.length)
}

let topicButtons = document.querySelectorAll(".dropdown-item")

for (let i = 0; i < topicButtons.length; i++) {
    let txt = topicButtons[i].textContent
    topicButtons[i].addEventListener("click", () => {
        searchByTopic(txt.trim())
    })
}

// searchByTopic function: takes in a topic (selected by user from dropdown button menu) and displays poems identified as relating to that topic
function searchByTopic(userInput) {
    let toDisplay = []
    for (let i = 0; i < poems1.length; i++) {
        let topicList = poems1[i]["topics"]
        for (let j = 0; j < topicList.length; j++) {
            if (topicList[j].includes(userInput)) {
                toDisplay.push(poems1[i])
            }
        }
    }
    displayPoems(toDisplay)
}