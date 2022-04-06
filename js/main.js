document.addEventListener("DOMContentLoaded", () => {
  createSquares();


  const keys = document.querySelectorAll(".keyboard-row button");
  const modal = document.getElementById("myModal");
  const btn = document.getElementById("lead");
  const span = document.getElementsByClassName("close")[0];
  let guessedSolution = [[]];
  let availableSpace = 1;
  let playedAmount = 0;
  let wonAmount = 0;
  let wonPer = wonAmount/playedAmount;
  wonPer = Math.round(wonPer * 100) / 100
  let solution = "1*2+3*4";
  let guessedSolutionCount = 0;
  dailyStatistics();
  btn.onclick = function() {
    modal.style.display = "block";
  }
  
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  const leaderBoard = document.querySelector("#leader-btn");
  leaderBoard.onclick = ({ target }) => {
    const lead = target.getAttribute("data-key");
    if (lead === "lead") {
      modal.style.display = "block";
    }
    else {
      modal.style.display = "none";
    }
  };
  function getCurrentSolutionArr() {
    const numberOfGuessedSolution = guessedSolution.length;
    return guessedSolution[numberOfGuessedSolution - 1];
  }
  function updateGuessedNumbers(letter) {
    const currentSolutionArr = getCurrentSolutionArr();
    if (currentSolutionArr && currentSolutionArr.length < 7) {
      currentSolutionArr.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));
      availableSpace = availableSpace + 1;

      availableSpaceEl.textContent = letter;
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = solution.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInPos = solution.charAt(index);
    const isCorrectPos = letter === letterInPos;

    if (isCorrectPos) {
      return "rgb(83,141,78)";
    }
    return "rgb(181,159,59)";
  }
  function handleSubmitWord() {
    const currentSolutionArr = getCurrentSolutionArr();
    if (currentSolutionArr.length != 7) {
      window.alert("All boxes must be filled");
      currentSolutionArr = getCurrentSolutionArr();
    }

    const currentSolution = currentSolutionArr.join("");

    const firstLetterId = guessedSolutionCount * 7 + 1;
    const interval = 200;

    currentSolutionArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = getTileColor(letter, index);

        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(letterId);
        letterEl.classList.add("animate__headShake");
        letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
      }, interval);
    });
    guessedSolutionCount += 1;
    if (currentSolution === solution) {
      window.alert("Congratulations Winner");
      playedAmount += 1;
      wonAmount +=1;
      wonPer = wonAmount/playedAmount;
      wonPer = Math.round(wonPer * 100) / 100
      wonPer *= 100;
      dailyStatistics();
      setTimeout(() => {clearBoard()}, 3000);
      return;
    }

    if (guessedSolution.length === 6) {
      window.alert(`You Lost! Solution is: ${solution}`);
      playedAmount += 1;
      wonPer = wonAmount/playedAmount;
      wonPer = Math.round(wonPer * 100) / 100
      wonPer *= 100;
      guessedSolutionCount += 1;
      dailyStatistics();
      setTimeout(() => {clearBoard()}, 3000);
      return;
    }
    guessedSolution.push([]);
  }
  function createSquares() {
    const gameBoard = document.getElementById("board");
    for (let i = 0; i < 42; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", i + 1);
      gameBoard.appendChild(square);
    }
  }
  function clearBoard(){
    let lightBlue = "rgb(173, 216, 230)";
    let black = "rgb(0,0,0)";
    let temp = guessedSolutionCount;
    const currentSolutionArr = getCurrentSolutionArr();
    console.log(temp);
    if(temp == 7){
      temp -=1;     
    }
    for(let i = 0 ; i < temp*7 ; i ++){
      let letterEl = document.getElementById(i+1);
      console.log(letterEl);
      letterEl.style = `background-color:${lightBlue};border-color:${black}`;
      currentSolutionArr.pop();
      guessedSolution[guessedSolution.length - 1] = currentSolutionArr;
      let lastLetterEl = document.getElementById(String(availableSpace - 1));
      lastLetterEl.textContent = "";
      availableSpace -= 1;
    }
    guessedSolution = [[]];
    availableSpace = 1;
    guessedSolutionCount = 0;
    return;
  }
  function dailyStatistics() {
    sessionStorage.setItem("play", playedAmount);
    sessionStorage.setItem("won", wonAmount);
    sessionStorage.setItem("wonPer", wonPer);
    let played = sessionStorage.getItem("play");
    let wins = sessionStorage.getItem("won");
    let winPer = sessionStorage.getItem("wonPer");
    document.getElementById("Played").innerHTML = played;
    document.getElementById("Won").innerHTML = wins;
    document.getElementById("Percent").innerHTML = winPer;
  }

  function handleDeleteLetter() {
    const currentSolutionArr = getCurrentSolutionArr();

    currentSolutionArr.pop();
    guessedSolution[guessedSolution.length - 1] = currentSolutionArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace -= 1;
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const key = target.getAttribute("data-key");

      if (key === "enter") {
        handleSubmitWord();
        return;
      }
      if (key === "del") {
        handleDeleteLetter();
        return;
      }

      updateGuessedNumbers(key);
    };
  }
});
