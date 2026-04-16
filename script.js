//document.querySelector("head").innerHTML="<title>"+location.pathname.substring(1)+"</title><link rel='stylesheet' href='"+location.hostname+"/style.css'>";

import { createMachine } from 'https://esm.sh/yay-machine';

// 1. Define the "Map" of your game
const rpgMachine = createMachine({
  initial: 'start',
  states: {
    start: {
      on: { 
        SEA: 'seaChoice', //Travel to the sea for answers
        LAND: 'looters'  //Travel by foot for the answers
      }
    },
    seaChoice: {
      on: { 
        CREW: 'found', // Sneak onto someones boat
        ABANDONED: 'holeInBoat' // Steal an abandoned boat
      }
    },
    found: {
      on: { 
        TRICK: 'trick', //Try to trick the pirate and steal their clothes
        FIGHT: 'fight' // Fight the pirate who found you on their ship
      }
    },
    holeInBoat: {
      on: { 
        SWIMORPATCH: 'swim', // EITHER WAY YOU SWIM
      }
    },
    stealClothes: {
      on: { 
        CONTINUEJOURNEY: 'goalIsland' //boat takes faux-pirate to correct island
      }
    },
    stealBoat: {
      on: { 
        CONTINUEJOURNEY: 'holeInBoat' //steal boat after fight, then leads to hole in boat plot
      }
    },
    fight: { //FILL IN
      on: { 
        WIN_MINUS_TEN_ISLAND: 'strollIn', //Far island fight
        WIN_LAND: 'getInfo', //deal with health in js -50 if epic fight -10 if major win
        WIN_BOAT: 'stealBoat', //someone finds you on boat
        LOSE_MINUS_FIFTY: 'walkPlank', // someone finds you on boat
        LOSE_DIE: 'death' //far island fight
      }
    },
    walkPlank: { //FILL IN
      on: { 
        SWIMORPATCH: 'swim', // EITHER WAY YOU SWIM
      }
    },
    volcanoIsland: { //FILL IN
      on: { 
        SWIM_CLOSE: 'volcanoIsland',
        SWIM_FAR: 'goalIsland',
        PATCH: 'swim' 
      }
    },
    goalIsland: { //FILL IN
      on: { 
        SWIM_CLOSE: 'volcanoIsland',
        SWIM_FAR: 'goalIsland',
        PATCH: 'swim' 
      }
    },
    swim: { 
      on: { 
        SWIM_CLOSE: 'volcanoIsland',
        SWIM_FAR: 'goalIsland'
      }
    },
    looters: { //FILL IN
      on: { 
        SWIM_CLOSE: 'volcanoIsland',
        SWIM_FAR: 'goalIsland',
        PATCH: 'swim' 
      }
    },
    death: { //FILL IN
      on: { 
        SWIM_CLOSE: 'volcanoIsland',
        SWIM_FAR: 'goalIsland',
        PATCH: 'swim' 
      }
    },
    victory: { //FILL IN
      on: { 
        SWIM_CLOSE: 'volcanoIsland',
        SWIM_FAR: 'goalIsland',
        PATCH: 'swim' 
      }
    },
    game_over: {
      on: { RESTART: 'village' }
    }
  }
});

// 2. The "Engine" function to update the UI
function updateUI() {
  const currentState = rpgMachine.getCurrentState();
  const display = document.getElementById('game-text');
  const actionArea = document.getElementById('actions');

  // Update text based on state
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
    const btn = document.createElement('button');
    btn.innerText = action;
    btn.onclick = () => {
      rpgMachine.transition(action); // Change the state
      updateUI(); // Refresh the screen
    };
    actionArea.appendChild(btn);
  });
}

// Start the game UI
updateUI();