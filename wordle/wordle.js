document.addEventListener("DOMContentLoaded", () => {
  //code to be executed when the DOM is loaded and parsed

  var triesGiven = 4;
  var wordLength = 4;

  let row = 0;
  let col = 0;
  let localStorage_dict = [];

  var gameEnd = false;
  var helpGiven = false;
  var themeLight = true;
  var rulesRequest = false;

  var wordList;
  var hintGiven;

  var themeChange_btn = document.getElementById("theme");
  var hintsAsked_btn = document.getElementById("hints");
  var rulesAsked_btn = document.getElementById("rules");
  let gameInit_btn = document.getElementById("startover");
  const btns = document.getElementsByTagName("button");

  function createGameTable() {
    const gameBoard = document.getElementById("board");
    for (let count1 = 0; count1 < triesGiven; count1++) {
      for (let count2 = 0; count2 < wordLength; count2++) {
        let square = document.createElement("div");
        square.id = count1.toString() + "-" + count2.toString();
        square.classList.add("square");
        square.innerText = "";
        gameBoard.appendChild(square);
      }
    }
  }

  var getServer_dict = async () => {
    let res = await fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
        "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
      },
    });

    let jsonPassed = await res.json();
    localStorage_dict = jsonPassed["dictionary"];
  };

  function wordCall() {
    var number = Number.parseInt(Math.random() * localStorage_dict.length);
    var {word, hint} = localStorage_dict[number];
    word = word.toUpperCase();
    wordList = word;
    hintGiven = hint;
  }

  window.onload = async function () {
    createGameTable();
    gameInit_btn.disabled = true;
    gameInit_btn.innerText = 'Loading...';

    await getServer_dict();
    wordCall();
    
    gameInit_btn.disabled = false;
    gameInit_btn.innerText = 'Start Over';

    document.addEventListener("keyup", (key) => {
      if (gameEnd) return;

      if ("KeyA" <= key.code && key.code <= "KeyZ") {
        if (col < wordLength) {
          let currentSquare = document.getElementById(row.toString() + "-" + col.toString());
          if (currentSquare.innerText == "") {
            currentSquare.innerText = key.code[3];
            currentSquare.classList.add("black");
            col += 1;
          }
        }
      }
      else if (key.code == "Backspace") {
          if (0 < col && col <= wordLength) {
            col -= 1;
          }
          let currentSquare = document.getElementById(row.toString() + "-" + col.toString());
          currentSquare.innerText = "";
      }
      else if (key.code == "Enter") {
        if (col == wordLength) {
          updated();
          row += 1;
          col = 0;
        }
        else {
          alert("Alert! You must complete the word before pressing ENTER");
        }
      }

      if (!gameEnd && row == triesGiven) {
        gameEnd = true;
        document.getElementById("answer").style.display = "visible";
        document.getElementById("answer").style.background = "red";
        document.getElementById("answer").innerHTML = "Alas! You lost and missed the word: <b><code>"+ wordList +"</code></b> ";
      }
    });

    function updated() {
        let found = 0;
        for (let count = 0; count < wordLength; count++) {
          let currentSquare = document.getElementById(row.toString() + "-" + count.toString());
          let letter = currentSquare.innerText;

          if (wordList[count] == letter) {
            currentSquare.classList.add("found");
            found += 1;
          }
          else if (wordList.includes(letter)) {
            currentSquare.classList.add("current-found");
          }
          else {
            currentSquare.classList.add("not-found");
          }

          if (found == wordLength) {
            document.getElementById("board").style.display = "none";
            document.getElementById("answer").innerHTML = "Congratulations! You got the right word: <b><code>" + wordList + "</code></b> ";
            document.getElementById("answer").style.display = "block";
            document.getElementById("answer").style.background = "#0e9601";
            document.getElementById("congos").style.display = "flex";
            gameEnd = true;
          }
        }
    }

    hintsAsked_btn.addEventListener("click", () => {
      if (helpGiven == false) {
        document.getElementById("answer").style.display = "block";
        console.log("pressed");
        document.getElementById("answer").innerHTML = "<b>Hint: </b>" + hintGiven;
        document.getElementById("answer").style.background = "yellow";
        helpGiven = true;
      }
      else {
        document.getElementById("answer").innerText = "";
        helpGiven = false;
      }
    });

    rulesAsked_btn.addEventListener("click", () => {
      if (rulesRequest == false) {
        document.getElementById("right-rulemenu").style.display = "flex";
        document.getElementById("answer").style.display = "none";
        rulesRequest = true;
      }
      else {
        document.getElementById("right-rulemenu").style.display = "none";
        document.getElementById("answer").style.display = "block";
        document.getElementById("answer").style.background = "yellow";
        rulesRequest = false;
      }
  });

    themeChange_btn.addEventListener("click", () => {
      if (themeLight == true) {
        document.getElementById("body").style.background = "black";
        document.getElementById("body").style.color = "white";
        document.getElementById("answer").style.color = "black";
        themeLight = false;
      }
      else if (themeLight == false) {
        document.getElementById("body").style.background = "white";
        document.getElementById("body").style.color = "black";
        document.getElementById("answer").style.color = "black";
        themeLight = true;
      }
    });

    gameInit_btn.addEventListener("click", async () => {
      document.getElementById("answer").innerText = "";
      document.getElementById("congos").style.display = "none";
      document.getElementById("answer").style.background = "yellow";

      
      for (let count1 = 0; count1 < triesGiven; count1++) {
        for (let count2 = 0; count2 < wordLength; count2++) { 
          document.getElementById("board").style.display = "visible";
          document.getElementById(count1.toString() + "-" + count2.toString()).remove();

          let square = document.createElement("div");
          square.id = count1.toString() + "-" + count2.toString()
          square.classList.add("square"); 
          square.innerText = "";
          
          document.getElementById("board").appendChild(square);
        }
      }

      wordCall();
      gameEnd = false;
      col = 0;
      row = 0;
    });
  };

  for (const button of btns) {
    button.addEventListener("keydown", (event) => {
      event.preventDefault();
    });
  }
});