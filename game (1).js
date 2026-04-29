import { rpgMachine } from './machine.js';

// Player stats
let playerHealth = 100;

// Start a machine instance (yay-machine API)
const game = rpgMachine.newInstance().start();

// Local map of valid events per state — used to build buttons.
// yay-machine doesn't expose .config, so we maintain this separately.
const transitions = {
  start: ['SEA', 'LAND'],
  seaChoice: ['CREW', 'ABANDONED'],
  found: ['TRICK', 'FIGHT'],
  holeInBoat: ['SWIMORPATCH'],
  stealClothes: ['CONTINUEJOURNEY'],
  stealBoat: ['CONTINUEJOURNEY'],
  fight: ['WIN_MINUS_TEN_ISLAND', 'WIN_LAND', 'WIN_BOAT', 'LOSE_MINUS_FIFTY', 'LOSE_DIE'],
  trick: ['WINLAND', 'LOSELAND', 'WINBOAT', 'LOSEBOAT'],
  walkPlank: ['SWIMORPATCH'],
  volcanoIsland: ['ENTERISLAND'],
  wildBeast: ['WINORLOSE'],
  recover: ['RIGHTDAYS', 'WRONGDAYS'],
  islandOptions: ['RECOVER', 'LEAVE'],
  goalIsland: ['CASTLE', 'CAVE'],
  swim: ['SWIM_CLOSE', 'SWIM_FAR'],
  strollIn: ['FOUNDPERSON'],
  fightRandom: ['WIN', 'LOSE'],
  looters: ['FIGHT', 'TRICK', 'RUN'],
  waterEdge: ['FIGHT', 'SWIM'],
  getInfo: ['SEACHOICE'],
  death: ['RESTART'],
  victory: ['RESTART'],
};

// Story text for every state
const content = {
  start: `Draymond Green.`,
  seaChoice: `You arrive at the docks. Two options: a well-crewed merchant vessel you could slip aboard, or a battered abandoned boat rotting at the far pier.`,
  found: `You've been discovered hiding below deck. A weathered pirate levels a blade at you. "Give me one reason I shouldn't throw you overboard."`,
  holeInBoat: `You're in the water. Two shapes on the horizon: a smoking volcanic island closer by, and a larger landmass further out.`,
  stealClothes: `Clever. You've talked the pirate out of their coat and hat. The ship sails on and nobody gives you a second look.`,
  stealBoat: `You've bested the pirate and seized the vessel — but the hull took damage. Water is already seeping through the boards.`,
  fight: `Steel rings against steel. Your opponent is skilled, but so are you. Every choice now could be your last.`,
  trick: `You weave a tale — half truth, half invention — and watch their eyes to see if they buy it.`,
  walkPlank: `At swordpoint you're marched to the plank's edge. The dark sea churns below.`,
  volcanoIsland: `You drag yourself ashore on the volcanic island. The air smells of sulfur. Something moves in the jungle ahead.`,
  wildBeast: `A massive creature bursts from the undergrowth — all teeth and fury. There's no running from this one.`,
  recover: `You lie in a makeshift shelter, wounds wrapped in torn cloth. Whether you rest enough will determine if you can continue.`,
  islandOptions: `You're feeling better — not great, but better. Push on now, or rest another day?`,
  goalIsland: `You've reached the island. The castle looms ahead, heavily guarded. Front gate, or a cave entrance around the back?`,
  swim: `The water is cold and dark. Two shapes in the distance — a closer volcanic island, or the far shore. Your arms are already tiring.`,
  strollIn: `You slip inside the castle undetected — for now. Rounding a corner, you come face to face with someone who shouldn't be here.`,
  fightRandom: `An epic clash erupts. This is what everything has been leading toward. Win, and it's over. Lose — and so are you.`,
  looters: `A gang of rough-looking looters blocks the road. They've spotted you and don't look friendly.`,
  waterEdge: `You've been chased to the water's edge. The looters fan out behind you, cutting off retreat.`,
  getInfo: `Your opponent, beaten and breathless, spills it: "Whatever you're after — it's on the islands. You need to get to the sea."`,
  death: `Your quest ends here. The darkness takes you — your goal unfulfilled. At least, not yet.`,
  victory: `You did it. Against every odd, every storm, every blade — you prevailed. What you sought is yours again.`,
};

// Human-readable button labels
const actionLabels = {
  SEA: '⛵ Travel by Sea',
  LAND: '🥾 Travel by Land',
  CREW: '🤫 Sneak aboard a crewed vessel',
  ABANDONED: '🚤 Take the abandoned boat',
  TRICK: '🎭 Try to trick them',
  FIGHT: '⚔️ Fight',
  SWIMORPATCH: '🌊 Into the water',
  CONTINUEJOURNEY: '➡️ Continue the journey',
  WIN_MINUS_TEN_ISLAND: '💪 Win (costly victory)',
  WIN_LAND: '🏆 Win the fight',
  WIN_BOAT: '⚓ Win and take the boat',
  LOSE_MINUS_FIFTY: '💀 Lose badly',
  LOSE_DIE: '☠️ Lose fatally',
  WINLAND: '✅ The trick works',
  LOSELAND: '❌ The trick fails',
  WINBOAT: '✅ The trick works (boat)',
  LOSEBOAT: '❌ The trick fails — fight!',
  ENTERISLAND: '🌋 Enter the volcanic island',
  WINORLOSE: '🐾 Face the beast',
  RIGHTDAYS: '🌅 Enough rest to continue',
  WRONGDAYS: '💀 Not enough rest',
  RECOVER: '🛌 Rest more',
  LEAVE: '⛵ Leave for the goal island',
  CASTLE: '🏰 Approach the castle gate',
  CAVE: '🕳️ Sneak in through the cave',
  SWIM_CLOSE: '🌋 Swim to the closer island',
  SWIM_FAR: '🏝️ Push on to the far island',
  FOUNDPERSON: '😤 Confront them',
  WIN: '🏆 Victory!',
  LOSE: '💀 Defeat',
  RUN: '🏃 Run away',
  SWIM: '🌊 Dive into the water',
  SEACHOICE: '⛵ Head to the docks',
  RESTART: '🔄 Start a new adventure',
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
    btn.onclick = () => {
      if (eventType === 'LOSE_MINUS_FIFTY') playerHealth = Math.max(0, playerHealth - 50);
      if (eventType === 'WIN_MINUS_TEN_ISLAND') playerHealth = Math.max(0, playerHealth - 10);
      if (eventType === 'WINORLOSE') playerHealth = Math.max(0, playerHealth - 20);
      if (eventType === 'RESTART') playerHealth = 100;

      game.send({ type: eventType });
      updateUI();
    };
    actionArea.appendChild(btn);
  });
}

updateUI();
                                                                                                                                                                                            }