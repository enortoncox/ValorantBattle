//Player Class that holds information about player itself such as how many agents they have remaining.
export class Player {
    constructor(playerName) {
      this.playerName = playerName;
      this.agentNameText = document.getElementById("agentNameText" + playerName);
      this.agentRoleText = document.getElementById("agentRoleText" + playerName);
      this.agentImage = document.getElementById("agentImage" + playerName);
      this.agentNameVsText = document.getElementById(
        "agentNameVsText" + playerName
      );
      this.agentsListElement = document.getElementById(
        "agentsListElement" + playerName
      );
      this.agentsRemainingText = document.getElementById(
        "agentsRemainingText" + playerName
      );
      this.agentsElementList = [];
      this.agentsObjectList = [];
      this.currentSelectedAgentElement = null;
      this.selectedAgent = null;
      this.agentsRemaining = 0;
      this.endGameText = document.getElementById("endGameText" + playerName);
      this.agentsDiv = document.getElementById("agentsDiv" + playerName);
      this.endGameDiv = document.getElementById("endGameDiv" + playerName);
    }
  
    playerRoundReset() {
      this.selectedAgent = null;
      this.agentNameText.textContent = `Name: `;
      this.agentRoleText.textContent = `Role: `;
      this.agentImage.setAttribute("src", `/images/valorant_logo.png`);
      this.agentNameVsText.textContent = "Unselected";
      if (this.currentSelectedAgentElement) {
        this.currentSelectedAgentElement.classList.toggle("in-combat");
      }
      this.currentSelectedAgentElement = null;
  
      for (let item of this.agentsElementList) {
        item.classList.remove("selected");
      }
    }
  }