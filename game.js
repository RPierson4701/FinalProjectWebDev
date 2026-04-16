import {rpgMachine} from '.machine.js'

// Player stats
let playerHealth = 100;
let currentLocationOrigin = ""; // To track if we are on 'land' or 'sea'

// 2. The "Engine" function to update the UI
function updateUI() {
  const currentState = rpgMachine.getCurrentState();
  const display = document.getElementById('game-text');
  const actionArea = document.getElementById('actions');

  // Update text based on state// NEED TO UPDATE THIS TO MATCH OUR MACHINE STATES
  const content = {
    village: "You are in a peaceful village. The sun is shining.",
    forest: "The woods are dark. You hear a growl...",
    battle: "A wild goblin appears! What do you do?",
    game_over: "You fainted. The quest ends here."
  };

  display.innerText = content[currentState];
  actionArea.innerHTML = ''; // Clear old buttons

  // 3. Dynamically create buttons based on valid transitions
  // Yay-machine lets us see what keys are available in 'on'
  const transitions = rpgMachine.getTransitions(); 
  
  transitions.forEach(action => {

    //MUST FILTER SOME BUTTONS BASED ON RULES AKA FIGHT TRICK ETC AND PLAYER HEALTH (FOR WHICH ISLAND THEY CAN ACCESS)

    const btn = document.createElement('button');
    btn.innerText = action;
    btn.onclick = () => {
        // POTENTIALLY NEED TO CHECK/UPDATE HEALTH BEFORE TRANSITION
      rpgMachine.transition(action); // Change the state
      updateUI(); // Refresh the screen
    };
    actionArea.appendChild(btn);
  });
}

// Start the game UI
updateUI();