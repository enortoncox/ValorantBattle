import { Player } from './player.js';
import { allAgentsData } from './agentsData.js';

//Declare and initialise new player objects
let player1 = new Player("P1");
let player2 = new Player("P2");

//Agent Class
class Agent {
  constructor(name, role, imgName, strength) {
    this.name = name;
    this.role = role;
    this.imgName = imgName;
    this.strength = strength;
  }
}

//The battle div
const battleDiv = document.getElementById("battle");

//The text for the result of the battle
const battleResultText = document.getElementById("battleResultText");

//The gameOverBattle div
const gameOverBattleDiv = document.getElementById("gameOverBattle");

//The gameover battle text
const gameOverBattleText = document.getElementById("gameOverBattleText");

//Holds a reference to the resetArena setTimeout
let resetArenaTimer;

//Holds a reference to the simulatedBattle setTimeout
let simulatedBattleTimer;

//Checks if the buttons need to be disabled
let isDisabled = false;

//Checks if the game is running a simulated battle
let isSimulating = false;

//Checks if the game has ended
let gameOver = false;

//Buttons
const battleBtn = document.getElementById("battleBtn");
const simBattleBtn = document.getElementById("simBattleBtn");
const resetBtn = document.getElementById("resetBtn");
const randomAgentBtnP1 = document.getElementById("randomAgentBtnP1");
const randomAgentBtnP2 = document.getElementById("randomAgentBtnP2");
const newGameBtn = document.getElementById("newGameBtn");

//Add eventListeners to the buttons
battleBtn.addEventListener("click", battle);
simBattleBtn.addEventListener("click", simulatedBattle);
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
randomAgentBtnP1.addEventListener("click", randomAgentSelection);
randomAgentBtnP2.addEventListener("click", randomAgentSelection);

//Call the createAgents function to create the agents list for each player
createAgents(player1);
createAgents(player2);

//Creates the agents for the player passed in
function createAgents(player) {
  //Declare a set called randomAgents
  let randomAgents = new Set();

  //While randomAgents' size is not greater than 10, add agents to it
  while (randomAgents.size < 10) {
    let rand = Math.floor(Math.random() * allAgentsData.length);
    randomAgents.add(allAgentsData[rand]);
  }

  //Convert the set into an array
  let sortedAgents = Array.from(randomAgents);

  //Sort the array using the name property
  sortedAgents.sort(function (a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  //Set agentsRemaining
  player.agentsRemaining = sortedAgents.length;
  player.agentsRemainingText.textContent = `Agents: ${player.agentsRemaining}`;

  for (let agentData of sortedAgents) {
    //Set a random strength value between 25 and 100
    let strength = Math.floor(Math.random() * (100 - 25 + 1) + 25);

    //Create a new agent object with the data from sortedAgents
    let newAgent = new Agent(
      agentData.name,
      agentData.role,
      agentData.imgName,
      strength
    );

    //Push agent object to the agentsObjectList;
    player.agentsObjectList.push(newAgent);

    //Create a new li element
    let li = document.createElement("li");

    //Give the li the className of "agent-list-item" + the player's name
    li.className = `agent-list-item ${player.playerName}`;

    //Set the textContent of the li equal to the name propery of the agent object
    li.textContent = newAgent.name;

    //Add an eventLister to the li
    li.addEventListener("click", selectAgent);

    //Append the li to the agentsListElement Ul
    player.agentsListElement.append(li);

    //Push to the agentsElementList
    player.agentsElementList.push(li);
  }
}

//Called when an agent li is clicked. It selects the agent for battle
function selectAgent(e) {
  //Stop simulated battle if it's currently running
  if (isSimulating === true) {
    isSimulating = false;
    clearTimeout(simulatedBattleTimer);
  }

  if (isDisabled === false) {
    //Declare player variable
    let player;

    //If the clicked DOM Li element includes a className with "P1" in it, then assign player to player 1
    if (e.target.className.includes("P1")) {
      player = player1;
      //Otherwise assign player to player 2
    } else {
      player = player2;
    }

    //Check if an agent is already selected
    if (player.currentSelectedAgentElement !== null) {
      //If an agent is found then toggle the "selected" class
      player.currentSelectedAgentElement.classList.toggle("selected");
    }

    //Assign the clicked agent element to be the currentSelectedAgentElement
    player.currentSelectedAgentElement = e.target;

    //Toggle the "selected" class of the currentSelectedAgentElement
    player.currentSelectedAgentElement.classList.toggle("selected");

    //search the agentsObjectList to find the agent that matches the textContent of the clicked element
    player.selectedAgent = player.agentsObjectList.find(
      (agent) => agent.name == e.target.textContent
    );

    //Set agentNameText equal to the selected agent's name
    player.agentNameText.textContent = `Name: ${player.selectedAgent.name}`;

    //Set agentRoleText equal to the selected agent's role
    player.agentRoleText.textContent = `Role: ${player.selectedAgent.role}`;

    //Set agentImage equal to the selected agent's image
    player.agentImage.setAttribute(
      "src",
      `/images/${player.selectedAgent.imgName}`
    );

    //Set the agentNameVsText equal to the selected agent's name
    player.agentNameVsText.textContent = player.selectedAgent.name;

    //If both players have selected an agent then change the battleResultText
    if (player1.selectedAgent != null && player2.selectedAgent != null) {
      battleResultText.textContent = "Ready to Battle!";
    }
  }
}

//Called when the Random Agent button is pressed. It randomly selects an agent for the player
function randomAgentSelection(e) {
  if (isDisabled === false && gameOver === false) {
    //Declare player variable
    let player;

    //If the random agent button element includes an Id with "P1" in it, then assign player to player 1
    if (e.target.id.includes("P1")) {
      player = player1;
      //Otherwise assign player to player 2
    } else {
      player = player2;
    }

    //Check if an agent is already selected
    if (player.currentSelectedAgentElement !== null) {
      //If an agent is found then toggle the "selected" class
      player.currentSelectedAgentElement.classList.toggle("selected");
    }

    //Get a random number from 0 to the player's agentsObjectList.length
    let randOne = Math.floor(Math.random() * player.agentsObjectList.length);

    //The selectedAgent is chosen via the random index
    player.selectedAgent = player.agentsObjectList[randOne];

    //Set agentNameText equal to the selected agent's name
    player.agentNameText.textContent = `Name: ${player.selectedAgent.name}`;

    //Set agentRoleText equal to the selected agent's role
    player.agentRoleText.textContent = `Role: ${player.selectedAgent.role}`;

    //Set agentImage equal to the selected agent's image
    player.agentImage.setAttribute(
      "src",
      `/images/${player.selectedAgent.imgName}`
    );

    //Set the agentNameVsText equal to the selected agent's name
    player.agentNameVsText.textContent = player.selectedAgent.name;

    for (let agent of player.agentsElementList) {

      //Check if the textContent of an element matches the name of the selected agent
      if (agent.textContent === player.selectedAgent.name) {
        //Set currentSelectedAgentElement equal to the element that matches
        player.currentSelectedAgentElement = agent;

        //Toggle the "selected" class on the element
        agent.classList.toggle("selected");
      }
    }

    //If both players have selected an agent then change the battleResultText
    if (player1.selectedAgent != null && player2.selectedAgent != null) {
      battleResultText.textContent = "Ready to Battle!";
    }
  }
}

//Called when the Battle button is clicked. This starts a battle if both agents have been selected
function battle() {
  if (
    isDisabled === false &&
    player1.selectedAgent &&
    player2.selectedAgent &&
    gameOver === false
  ) {

    //Declare loser and winner variables
    let loser;
    let winner;

    //Set the agentNameVsText equal to the selected agent's strength
    player1.agentNameVsText.textContent = player1.selectedAgent.strength;
    player2.agentNameVsText.textContent = player2.selectedAgent.strength;

    //Toggle the "in-combat" class for the currentSelectedAgentElement
    player1.currentSelectedAgentElement.classList.toggle("in-combat");
    player2.currentSelectedAgentElement.classList.toggle("in-combat");

    //If player 1's agent has higher strength
    if (player1.selectedAgent.strength > player2.selectedAgent.strength) {
      //Set battleResultText
      battleResultText.textContent = `Player 1's ${player1.selectedAgent.name} wins!`;

      //Set player 2 as the loser and player 1 as the winner
      loser = player2;
      winner = player1;

      //If player 2's agent has higher strength
    } else if (
      player1.selectedAgent.strength < player2.selectedAgent.strength
    ) {
      //Set battleResultText
      battleResultText.textContent = `Player 2's ${player2.selectedAgent.name} wins!`;

      //Set player 1 as the loser and player 2 as the winner
      loser = player1;
      winner = player2;

      //If both agents have the same strength
    } else {
      battleResultText.textContent = `It's a tie!`;
    }

    //Set isDisabled to true
    isDisabled = true;

    //Clear any existing call to resetArenaTimer
    clearTimeout(resetArenaTimer);

    //Call setTimeout for resetArena
    resetArenaTimer = setTimeout(resetArena, 2000, loser, winner);
  }
}

//Called when the simulated battle button is pressed. The game will play itself using randomly chosen agents
function simulatedBattle() {
  if (isDisabled === false && gameOver === false) {
    //PLAYER 1
    //Set isSimulating to true
    isSimulating = true;

    //Create an object to hold the randomAgentBtnP1
    let elementP1 = {};

    //Set target equal to randomAgentBtnP1
    elementP1.target = randomAgentBtnP1;

    //Invoke randomAgentSelection passing in elementP1
    randomAgentSelection(elementP1);

    //PLAYER 2
    //Create an object to hold the randomAgentBtnP2
    let elementP2 = {};

    //Set target equal to randomAgentBtnP2
    elementP2.target = randomAgentBtnP2;

    //Invoke randomAgentSelection passing in elementP2
    randomAgentSelection(elementP2);

    //Invoke battle
    battle();

    //If the game hasn't ended then call the simulatedBattle setTimeout
    if (gameOver === false) {
      simulatedBattleTimer = setTimeout(simulatedBattle, 3000);
    }
  }
}

//Called when the reset and new game button is clicked. It completely resets the game to default
function resetGame() {
  //Stops the simulatedBattle setTimeout
  clearTimeout(simulatedBattleTimer);

  //Set isSimulating to false
  isSimulating = false;

  //Set isDisabled to false
  isDisabled = false;

  //Set battleResultText to `Choose your Agents!`;
  battleResultText.textContent = `Choose your Agents!`;

  //Remove all player 1's agent elements from the DOM
  for (let item of player1.agentsElementList) {
    item.remove();
  }

  //Remove all player 2's agent elements from the DOM
  for (let item of player2.agentsElementList) {
    item.remove();
  }

  if (gameOver === true) {
    //Toggle the "gameover" class for the agentDiv to reveal it.
    player1.agentsDiv.classList.toggle("gameover");
    player2.agentsDiv.classList.toggle("gameover");

    //Toggle the "gameover" class for the endGameDiv to hide it.
    player1.endGameDiv.classList.toggle("gameover");
    player2.endGameDiv.classList.toggle("gameover");

    //Toggle the "gameover" class for the battleDiv to reveal it.
    battleDiv.classList.toggle("gameover");

    //Toggle the "gameover" class for the gameOverBattleDiv to hide it.
    gameOverBattleDiv.classList.toggle("gameover");

    //Set gameOver to false
    gameOver = false;
  }

  //Reset player DOM stats
  player1.playerRoundReset();
  player2.playerRoundReset();

  //Create new player object to reset all values
  player1 = new Player("P1");
  player2 = new Player("P2");

  //Invoke createAgents to repopulate the agent lists
  createAgents(player1);
  createAgents(player2);
}

//Called after a battle has finished. Resets the agent selections
function resetArena(loser, winner) {
  //Check if there is a loser in case of tie
  if (loser) {
    //Find the index of the defeated agent element
    let defeatedAgentIndex = loser.agentsElementList.findIndex(
      (li) => li.textContent === loser.selectedAgent.name
    );

    //Remove defeated agent element from DOM
    loser.agentsElementList[defeatedAgentIndex].remove();

    //Remove defeated agent element from agentsElementList
    loser.agentsElementList.splice(defeatedAgentIndex, 1);

    //Remove defeated agent from agentsObjectList
    loser.agentsObjectList.splice(defeatedAgentIndex, 1);

    //Decrease agentsRemaining by 1
    loser.agentsRemaining--;

    //Update agentsRemainingText
    loser.agentsRemainingText.textContent = `Agents: ${loser.agentsRemaining}`;

    //Reduce the winning agent's strength by 20
    winner.selectedAgent.strength -= 20;

    //If the winning agents strength is less than 25, make it 25
    if (winner.selectedAgent.strength < 25) {
      winner.selectedAgent.strength = 25;
    }

    //Add the "damaged" class for the winning element
    winner.currentSelectedAgentElement.classList.add("damaged");

    //Check if the loser's agentsRemaining is less than or equal to 0
    if (loser.agentsRemaining <= 0) {
      //If it is then call playerWin passing in the winner and loser player objects
      playerWin(loser, winner);
    }
  }

  //Reset Player 1 DOM values
  player1.playerRoundReset();

  //Reset Player 2 DOM values
  player2.playerRoundReset();

  //Reset battle result text
  battleResultText.textContent = `Choose your Agents!`;

  //Set isDisabled to false
  isDisabled = false;
}

//Called when a player's agentsRemaining reaches 0
function playerWin(loser, winner) {
  //Set gameOver to true
  gameOver = true;

  //Set endGameText for the winner to "Win"
  winner.endGameText.textContent = "Win";

  //Set endGameText for the loser to "Lose"
  loser.endGameText.textContent = "Lose";

  //Toggle the "gameover" class for the agentDiv to hide it.
  winner.agentsDiv.classList.toggle("gameover");
  loser.agentsDiv.classList.toggle("gameover");

  //Toggle the "gameover" class for the endGameDiv to reveal it.
  winner.endGameDiv.classList.toggle("gameover");
  loser.endGameDiv.classList.toggle("gameover");

  //Toggle the "gameover" class for the battleDiv to hide it.
  battleDiv.classList.toggle("gameover");

  //Toggle the "gameover" class to the gameOverBattleDiv to reveal it.
  gameOverBattleDiv.classList.toggle("gameover");

  //Check if the winner is player 1
  if (winner.playerName === "P1") {
    //Set gameOverBattleText to "Player 1 wins!";
    gameOverBattleText.textContent = "Player 1 wins!";
  } else {
    //Set gameOverBattleText to "Player 2 wins!";
    gameOverBattleText.textContent = "Player 2 wins!";
  }
}
