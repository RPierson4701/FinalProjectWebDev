//document.querySelector("head").innerHTML="<title>"+location.pathname.substring(1)+"</title><link rel='stylesheet' href='"+location.hostname+"/style.css'>";

import { createMachine } from 'https://esm.sh/yay-machine';

// 1. Define the "Map" of your game
const rpgMachine = createMachine({
  initial: 'start',
  states: {
    start: { //Create hero and start quest
      on: { // starting quest, pick path
        SEA: 'seaChoice', //Travel to the sea for answers
        LAND: 'looters'  //Travel by foot for the answers
      }
    },
    seaChoice: { //when traveling by sea
      on: { 
        CREW: 'found', // Sneak onto someones boat
        ABANDONED: 'holeInBoat' // Steal an abandoned boat
      }
    },
    found: { // When found on crew boat
      on: { 
        TRICK: 'trick', //Try to trick the pirate and steal their clothes
        FIGHT: 'fight' // Fight the pirate who found you on their ship
      }
    },
    holeInBoat: { // when successfully stolen boat (either abandoned or after fighting crew)
      on: { 
        SWIMORPATCH: 'swim', // EITHER WAY YOU SWIM
      }
    },
    stealClothes: { //when successfully tricked pirate on hijacked boat
      on: { 
        CONTINUEJOURNEY: 'goalIsland' //boat takes faux-pirate to correct island
      }
    },
    stealBoat: { //when traveling by sea 
      on: { 
        CONTINUEJOURNEY: 'holeInBoat' //steal boat after fight, then leads to hole in boat plot
      }
    },
    fight: { //Used for stealing boat, castle entrance fight, land fight
      on: { 
        WIN_MINUS_TEN_ISLAND: 'strollIn', //Far island fight
        WIN_LAND: 'getInfo', //deal with health in js -50 if epic fight -10 if major win
        WIN_BOAT: 'stealBoat', //someone finds you on boat
        LOSE_MINUS_FIFTY: 'walkPlank', // someone finds you on boat
        LOSE_DIE: 'death' //far island fight
      }
    },
    walkPlank: { // when stealing boat and lost the fight
      on: { 
        SWIMORPATCH: 'swim', // EITHER WAY YOU SWIM
      }
    },
    volcanoIsland: { //Enter the closer island
      on: { 
        ENTERISLAND: 'wildBeast'
      }
    },
    wildBeast: { //for the volcano island only
      on: { 
        WINORLOSE: 'recover' //Change health in JS based on result
      }
    },
    recover: { //for the volcano island only
      on: { 
        RIGHTDAYS: 'islandOptions', //choice of leaving of continue recovery
        WRONGDAYS: 'death' //you done for
      }
    },
    islandOptions: { // for the volcano island only
      on: { 
        RECOVER: 'recover', //recover some more
        LEAVE: 'goalIsland' //Continue towards goal quest (make sure health is enough)
      }
    },
    goalIsland: { //for the farther island only
      on: { 
        CASTLE: 'fight', //Duke it out with the guard at the gate
        CAVE: 'strollIn' //Enter the castle from the back entrance
      }
    },
    swim: { // used when boat has a hole (abandoned or stolen), after trying to patch boat, or walking the plank
      on: { 
        SWIM_CLOSE: 'volcanoIsland',
        SWIM_FAR: 'goalIsland'
      }
    },
    strollIn: { //Enter castle either from the cave entrance or after fight with the guard
      on: { 
        FOUNDPERSON: 'fightRandom' //Epic fight
      }
    },
    fightRandom: { //Epic fight
      on: { 
        WIN: 'victory', //Win game
        LOSE: 'death' //you done for
      }
    },
    getInfo: { //FILL IN
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
    death: { //You are a failure, shame shame
      on: { 
        RESTART: 'start' //Restart game with new hero
    },
    victory: { //You defeated the person, why were you fighting again?
      on: { 
        RESTART: 'start' //Restart game with new hero
      }
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