import {rpgMachine} from '.machine.js'

// Player stats
let playerHealth = 100;
let currentLocationOrigin = ""; // To track if we are on 'land' or 'sea'
let weapon = "";
let specialItem = "";
let armor = "";
let heroName = ""; 

// 2. The "Engine" function to update the UI
function updateUI() {
  const currentState = rpgMachine.getCurrentState();
  const display = document.getElementById('game-text');
  const actionArea = document.getElementById('actions');

  // Update text based on state// NEED TO UPDATE THIS TO MATCH OUR MACHINE STATES
  const content = {
    start: "There is a thief in distant lands who has stolen your likeness. They have committed countless crimes, sullied your name, and emptied your life savings. Your mission is to find this thief and take back your life.",
    seaChoice: "You start near port. Nearby, there is ship unattended beside a pirate ship leaving for an unknown destination. Should you steal the unattended ship or stow away on the pirate's vessel?",
    found: "",
    holeInBoat: "",
    stealClothes: "",
    stealBoat: "",
    fight: "",
    trick: "",
    walkPlank: "",
    volcanoIsland: "",
    wildBeast: "",
    recover: "",
    islandOptions: "",
    goalIsland: "",
    swim: "",
    strollIn: "",
    fightRandom: "",
    looters: "",
    waterEdge: "", 
    getInfo: "",
    death: "",
    victory: ""
  };

  display.innerText = content[currentState];
  actionArea.innerHTML = ''; // Clear old buttons

  // 3. Dynamically create buttons based on valid transitions
  // Yay-machine lets us see what keys are available in 'on'
  const transitions = rpgMachine.getTransitions(); 
  
  transitions.forEach(action => {
    


/*
  // 1. Filter by Health
  if (action === 'FIGHT' && playerHealth < 10) return; // Too weak to fight!

  // 2. Filter by Location (Custom Logic)
  // Our machine uses 'WIN_LAND' and 'WIN_BOAT' inside one state
  if (action.includes('LAND') && currentLocationOrigin !== 'land') return;
  if (action.includes('BOAT') && currentLocationOrigin !== 'sea') return;

  // 3. Filter by "Secret" transitions
  if (action === 'SWIM_FAR' && playerHealth < 80) return; // Only elite swimmers see this
*/


  // If it passes all checks, build the button
  const btn = document.createElement('button');

  const buttonLabels = {
  // Start / Navigation
  SEA: "Travel by Sea",
  LAND: "Travel by Foot",
  
  // Sea Path
  CREW: "Sneak onto a Crew's Boat",
  ABANDONED: "Take an Abandoned Boat",
  TRICK: "Attempt to Trick Them",
  FIGHT: "Engage in Combat",
  CONTINUEJOURNEY: "Continue the Journey",
  
  // Fight Outcomes (General & Specific)
  WIN_MINUS_TEN_ISLAND: "Victory",
  WIN_LAND: "Defeat the Looters",
  WIN_BOAT: "Seize the Vessel",
  LOSE_MINUS_FIFTY: "Overpowered and Captured",
  LOSE_DIE: "Meet Your End",
  
  // Trick Outcomes
  WINLAND: "Successful Deception",
  LOSELAND: "The Ruse Fails",
  WINBOAT: "Successful Deception",
  LOSEBOAT: "The Ruse Fails",
  
  // Boat / Swimming
  SWIMORPATCH: "Try to Stay Afloat",
  SWIM_CLOSE: "Swim to the Volcano Island",
  SWIM_FAR: "Swim for the Distant Island",
  
  // Volcano Island Sequence
  ENTERISLAND: "Step onto the Ashy Shore",
  WINORLOSE: "Survival of the Fittest",
  RIGHTDAYS: "Wait for the Right Moment",
  WRONGDAYS: "Wait Too Long",
  RECOVER: "Rest and Heal",
  LEAVE: "Depart the Island",
  
  // Final Reach / Goal Island
  CASTLE: "Approach the Front Gate",
  CAVE: "Find the Secret Back Entrance",
  FOUNDPERSON: "Confront the Presence",
  WIN: "Total Victory",
  LOSE: "Defeat at the Finish Line",
  
  // Land Specifics
  RUN: "Flee Toward the Water's Edge",
  SWIM: "Dive into the Waves",
  SEACHOICE: "Head to the Docks",
  
  // Game Endings
  RESTART: "Begin a New Hero's Journey"
};

  // If we have a string for that button label use it else use the state transition label"
  btn.innerText = buttonLabels[action] || action;

  btn.onclick = () => {
    handleCombatMath(action); // Handle health drops before moving
    rpgMachine.transition(action);
    updateUI();
  };
  actionArea.appendChild(btn);
});

// Start the game UI
updateUI();