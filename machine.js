//document.querySelector("head").innerHTML="<title>"+location.pathname.substring(1)+"</title><link rel='stylesheet' href='"+location.hostname+"/style.css'>";

import { createMachine } from 'https://esm.sh/yay-machine';

// 1. Define the "Map" of your game
export const rpgMachine = createMachine({
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
    trick: { // Land plot tricks looters, sea plot tricks pirate
      on: { 
        WINLAND: 'getInfo', // Learn that you must travel by sea for the answers
        LOSELAND: 'death', // You are done for, they exploit your weaknesses and kill you for your possessions
        WINBOAT: 'stealClothes', //blend in with this pirate crew
        LOSEBOAT: 'fight' //fight anyways
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
    looters: { // When you encounter looters on land
      on: { 
        FIGHT: 'fight', //fight them for information
        TRICK: 'trick', //Trick them for information
        RUN: 'waterEdge' //Run from them you scaredy-cat
      }
    },
    waterEdge: { // When looters chase you to the waters edge
      on: { 
        FIGHT: 'fight', //fight them for information
        SWIM: 'swim' //Options to swim to closer or farther island, these looters dont do water
      }
    },
    getInfo: { // THEY TELL YOU TO GO TO THE SEA FOR WHAT YOU ARE LOOKING FOR
      on: { 
        SEACHOICE: 'seaChoice' //its the only way to get to your destination
      }
    },
    death: { //You are a failure, shame shame
      on: { 
        RESTART: 'start' //Restart game with new hero
      }
    },
    victory: { //You defeated the person, why were you fighting again?
      on: { 
        RESTART: 'start' //Restart game with new hero
      }
    }
  }
});
