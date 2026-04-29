import { rpgMachine } from './machine.js';


// Start a machine instance (yay-machine API)
const game = rpgMachine.newInstance().start();

// Player stats
let playerHealth = 100;
let opponentHealth = 100;
let currentLocationOrigin = ``; // To track if we are on 'land' or 'sea'
let weapon = ``;
let specialItem = ``;
let armor = ``;
let heroName = ``;

const weaponOptions = [`Sword`, `Sorcery`, `Ax`, `Bow and Arrow`];
const specialItemOptions = [`Water`, `Pet Monkey`, `Monocular`];
const armorOptions = [`Cloak`, ``, ``];
const heroOptions = [`Blaze`, `Seraphina`, `Bob`];

// Local map of valid events per state — used to build buttons.
// Updated to match the specific fight/trick state split.
const transitions = {
  start:         ['SEA', 'LAND'],
  seaChoice:     ['CREW', 'ABANDONED'],
  found:         ['TRICK', 'FIGHT'],
  holeInBoat:    ['PATCH', 'SWIM'],
  stealClothes:  ['CONTINUEJOURNEY'],
  stealBoat:     ['CONTINUEJOURNEY'],
  fightBoat:     ['WIN_BOAT', 'LOSE_MINUS_FIFTY'],
  fightCastle:   ['WIN_MINUS_TEN_ISLAND', 'LOSE_DIE'],
  fightLooters:  ['WIN_LAND'],
  trickLooters:  ['WINLAND', 'LOSELAND'],
  trickBoat:     ['WINBOAT', 'LOSEBOAT'],
  walkPlank:     ['PATCH', 'SWIM'],
  volcanoIsland: ['ENTERISLAND'],
  wildBeast:     ['WINORLOSE'],
  recover:       ['CHOICEONE', 'CHOICETWO', 'CHOICETHREE'],
  islandOptions: ['RECOVER', 'LEAVE'],
  goalIsland:    ['CASTLE', 'CAVE'],
  swim:          ['SWIM_CLOSE', 'SWIM_FAR'],
  strollIn:      ['FOUNDPERSON'],
  fightRandom:   ['WIN', 'LOSE'],
  looters:       ['FIGHT', 'TRICK', 'RUN'],
  waterEdge:     ['FIGHT', 'SWIM'],
  getInfo:       ['SEACHOICE'],
  death:         ['RESTART'],
  victory:       ['RESTART'],
};

// Story text for every state
// Update text based on state// NEED TO UPDATE THIS TO MATCH OUR MACHINE STATES
  const content = {
    start: `There is a thief in distant lands who has stolen your likeness. They have committed countless crimes, sullied your name, and emptied your life savings. Your mission is to find this thief and take back your life.`,
    seaChoice: `You start near port. Nearby, there is ship unattended beside a pirate ship leaving for an unknown destination. Should you steal the unattended ship or stow away on the pirate's vessel?`,
    looters: `You make your way inward on a narrow path. You turn to your left and eyes peer through the brush; then to the right and another set lay upon you. You are being followed... As this revelation hits you, the looters move in closer for attack. What shall you do?`,
    waterEdge: `You make a break for it. These looters are no match for ` + heroName + `! You race away from any familiar lands and stumble across the waters edge. The looters quickly catch up... what shall you do now?`, 
    trickLooters: `You attempt to decieve these fools posing as looters. Using your secret weapon, ` + weapon + ` you attempt to beguile these looters for information. Let us see how they will respond...`,
    found: `The crew has found you on the boat. You now have the choice to either try to trick them or fight them. Choose wisely, for the choice you make may determin whether you survive or not.`,
    holeInBoat: `The abandoned boat you found has a hole in it making it not safe for travel. Your choice now is to try to patch the hole or you can decide to abandon ship and swim to your destination.`,
    stealClothes: `You have been successful in tricking the pirates by means of stealing their clothes. You are now seen as a member of their crew and are able to ride along with them to your destination.`,
    stealBoat: `You succeed in battle against the nefarious pirates with brute force. Now that the pirates have been dispatched, you take the ship for yourself and continue towards your destination.`,
    fightLooters: `You draw your weapon and choose to face the looters head on! Steel yourself, for it is time to fight!`,
    fightBoat: `The pirates have found you on the ship and know that you do not belong. They are preparing for a fight against you. You must  do the same so that you can protect your self and have any chance of staying on board the ship so you can get back your life.`,
    fightCastle: `Upon entering the castle, you enter a large gloomy hallway. As you take a step forward, a large Gargoyle soon descends upon you! All you can do is battle!`,
    trickBoat: `You attempt to deceive the pirates by matching their attire using your, ` + weapon + `! If they believe to be one of their own, you can hitch a ride... let's see if it works...`,
    walkPlank: `Unfortunately you've been bested by the pirates... Luckily they leave you alive, but you have to pay for your insolence they force you to walk the plank. How cruel. `,
    volcanoIsland: `You arrive at a pecuilar island housing a lone volcano. The surroundings don't tell you very much, so it would be wise to investigate further.`,
    wildBeast: `You're alerted by the sound of a ghastly roar! You turn around and find yourself at the mercy of a wild beast! You draw your, ` weapon + ` and begin the fight for your life.`,
    recover: `You lie in a makeshift shelter, resting to recover from your wounds.`,
    islandOptions: `Your respit`,

    //If your special item is a Monocular, an extra piece of text will appear indicating to go to the cave, both options should still be available.
    goalIsland: `The island, once nearly disguised by the mist, now stands before you in all its glory. Upon the island, you see a large castle and a cave enterance. You know that the thief is on this island, but where could they be hiding? Do you approach the castle head on or do you try to find a secret entrance around back?`,
    swim: `In the murky waters, two islands loom in the distance. The closer emits a faint plume of smoke, while the farther is nearly obscured by mist. Your arms ache with fatigue, and the waves grow more turbulent. Do you swim towards the volcanic island, hoping to find shelter, or do you push on towards the distant shore, risking exhaustion?`,
    strollIn: `The castle gates part for you with a dead behhemoth at your feet. You step inside and find yourself in a dimly lit hallway. You begin to explore the catle and stumble across a figure in the shadows. As you approach, the figure steps forward and you ee your own likeness. The thief who sullied your good name stands before you.`,
    fightRandom: `This is your chance, no, your destiny. You are face to face with the thief who has stolen your identity. This is the moment you have been preparing for. Do you have what it takes to win this fight and reclaim your life?`,
    getInfo: `Your battle, fought to the brink of death, has ended in victory. You offer your opponent a chance to survive in exchhange for information pertaining to the thief you are after. Your opponent, beaten and breathless, recounts: "The villain you're after, they are on the far island. You need to get to the sea."`,
    death: `Your quest ends here. The darkness takes you with your goal unfulfilled. Your name will become infamous for the crimes you did not commit and your family will die penniless.`,
    victory: `Huzzah! You have reclaimed your identity and restored your live savings. Now you may start anew... hopefully people will forget about the crimes that your doppelganger committed.`
  };

const actionLabels = {

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
  PATCH: "Patch the Leak",
  SWIM: "Dive into the Waves",
  SWIM_CLOSE: "Swim to the Volcano Island",
  SWIM_FAR: "Swim for the Distant Island",
 
  // Volcano Island Sequence
  ENTERISLAND: "Step onto the Ashy Shore",
  WINORLOSE: "Survival of the Fittest",
  CHOICEONE: "Wait for the Right Moment",
  CHOICETWO: "Scavenge for Supplies",
  CHOICETHREE: "Sleep in Your Crafted Shelter",
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
  SEACHOICE: "Head to the Docks",
 
  // Game Endings
  RESTART: "Begin a New Hero's Journey"
};

function updateUI() {
  const stateName = game.state.name;
  const display = document.getElementById('game-text');
  const actionArea = document.getElementById('actions');
  const healthDisplay = document.getElementById('health');

  display.innerText = content[stateName] ?? `Unknown state: ${stateName}`;
  if (healthDisplay) healthDisplay.innerText = `❤️ Health: ${playerHealth}`;
  actionArea.innerHTML = '';

  const events = transitions[stateName] ?? [];
  events.forEach(eventType => {
    const btn = document.createElement('button');
    btn.innerText = actionLabels[eventType] ?? eventType;
    
    //If you lack health to swim far
    if (eventType === 'SWIM_FAR' && playerHealth <= 90){
      btn.disabled = true;
    }
    //Wrong weapon at castle gates, do not create this option at all
    else if (eventType === 'WIN_MINUS_TEN_ISLAND' && (weapon != 'Sword' || weapon === 'Bow and Arrow')){
      return;
    } 
    //Correct weapon at castle gates, do not create this option at all
    else if (eventType === 'LOSE_DIE' && (weapon === 'Sword' || weapon === 'Bow and Arrow')){
      return;
    } 
    //Wrong weapon and attempted to trick
    else if (eventType === 'WINBOAT' && weapon != 'Sorcery'){
      return;
    }
    //Correct weapon and attempted to trick
    else if (eventType === 'LOSEBOAT' && weapon === 'Sorcery'){
      return;
    }
    //Wrong weapon and attempted to fight
    else if (eventType === 'WIN_BOAT' && (weapon != 'Sword' || weapon === 'Bow and Arrow')){
      return;
    }
    // We will not lose this fight
    else if (eventType === 'LOSE_MINUS_FIFTY' && (weapon === 'Sword' || weapon === 'Bow and Arrow')){
      return;
    }
    // Can not make it to the far island yet
    else if (eventType === 'LEAVE' && playerHealth < 90){
      return;
    }
    //Not ready for this button option yet
    else if (eventType === 'WIN' && opponentHealth != 0){
      return;
    }
    //Not ready for this button option yet
    else if (eventType === 'LOSE' && playerHealth != 0){
      return;
    }
    
    btn.onclick = () => {

      //remove any text that is based on the state, only shown as additional text
      const oldText = document.querySelectorAll('state-based-text');
      oldText.forEach(el => el.remove());


      if (eventType === 'LOSE_MINUS_FIFTY') playerHealth = Math.max(0, playerHealth - 50);
      if (eventType === 'WIN_MINUS_TEN_ISLAND') playerHealth = Math.max(0, playerHealth - 10);
      if (eventType === 'WINORLOSE') playerHealth = Math.max(0, playerHealth - 20);
      if (eventType === 'WIN_LAND'||eventType === 'WIN_BOAT'||eventType === 'WINLAND'||eventType === 'WINBOAT') playerHealth = Math.max(0, playerHealth - 2);
      if (eventType === 'LOSEBOAT') playerHealth = Math.max(0, playerHealth - 10);
      if (eventType === 'PATCH') playerHealth = Math.max(0, playerHealth - 5);

      //Death.
      if (eventType === 'LOSELAND'||eventType === 'LOSE_DIE') playerHealth = 0;

      //Reset player stats and options
      if (eventType === 'RESTART') {
        playerHealth = 100;
        weapon = '';
        specialItem = '';
        armor = '';
        heroName = '';
        currentLocationOrigin = '';
      } 
      
      //Create an additional clue for our players if they chose this special item
      if ((eventType === 'LEAVE' || eventType === 'STEALCLOTHES' || eventType === 'SWIM_FAR') && specialItem === 'Monocular'){
        let monocular = document.createElement('p');
        monocular.addClassName('state-based-text');
        monocular.innerText = "Your Monocular reveals a hidden doorway within the cave! This must be the way!";
        document.appendChild(monocular);
      }

      game.send({ type: eventType });
      saveGame();
      updateUI();
    };
    actionArea.appendChild(btn);
  });
}

const saveGame = () => {
  localStorage.setItem('rpgGameSave', JSON.stringify({
    stateName: game.state.name,
    playerHealth,
    weapon,
    specialItem,
    armor,
    heroName,
    currentLocationOrigin
  }));
};

// const loadGame = () => {
//   const saved = localStorage.getItem('rpgGameSave');
//   if (!saved) return;

//   const data = JSON.parse(saved);
//   playerHealth = data.playerHealth ?? 100;
//   weapon = data.weapon ?? '';
//   specialItem = data.specialItem ?? '';
//   armor = data.armor ?? '';
//   heroName = data.heroName ?? '';
//   currentLocationOrigin = data.currentLocationOrigin ?? '';

//   if (data.stateName) {
//     game.start();
//     game.send({ type: data.stateName });
//   }
// };

// loadGame();
updateUI();