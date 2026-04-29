import { defineMachine } from 'https://esm.sh/yay-machine';

// yay-machine requires:
// - initialState: { name: 'stateName' }
// - transitions as objects: { to: 'nextState' }
// - the export is the machine definition (call .newInstance().start() in game.js)

export const rpgMachine = defineMachine({
  initialState: { name: 'start' },
  enableCopyDataOnTransition: true,
  states: {
    start: {
      on: {
        SEA:  { to: 'seaChoice' },
        LAND: { to: 'looters' }
      }
    },
    seaChoice: {
      on: {
        CREW:      { to: 'found' },
        ABANDONED: { to: 'holeInBoat' }
      }
    },
    found: {
      on: {
        TRICK: { to: 'trick' },
        FIGHT: { to: 'fight' }
      }
    },
    holeInBoat: {
      on: {
        SWIMORPATCH: { to: 'swim' }
      }
    },
    stealClothes: {
      on: {
        CONTINUEJOURNEY: { to: 'goalIsland' }
      }
    },
    stealBoat: {
      on: {
        CONTINUEJOURNEY: { to: 'holeInBoat' }
      }
    },
    fight: {
      on: {
        WIN_MINUS_TEN_ISLAND: { to: 'strollIn' },
        WIN_LAND:             { to: 'getInfo' },
        WIN_BOAT:             { to: 'stealBoat' },
        LOSE_MINUS_FIFTY:     { to: 'walkPlank' },
        LOSE_DIE:             { to: 'death' }
      }
    },
    trick: {
      on: {
        WINLAND:  { to: 'getInfo' },
        LOSELAND: { to: 'death' },
        WINBOAT:  { to: 'stealClothes' },
        LOSEBOAT: { to: 'fight' }
      }
    },
    walkPlank: {
      on: {
        SWIMORPATCH: { to: 'swim' }
      }
    },
    volcanoIsland: {
      on: {
        ENTERISLAND: { to: 'wildBeast' }
      }
    },
    wildBeast: {
      on: {
        WINORLOSE: { to: 'recover' }
      }
    },
    recover: {
      on: {
        RIGHTDAYS: { to: 'islandOptions' },
        WRONGDAYS: { to: 'death' }
      }
    },
    islandOptions: {
      on: {
        RECOVER: { to: 'recover' },
        LEAVE:   { to: 'goalIsland' }
      }
    },
    goalIsland: {
      on: {
        CASTLE: { to: 'fight' },
        CAVE:   { to: 'strollIn' }
      }
    },
    swim: {
      on: {
        SWIM_CLOSE: { to: 'volcanoIsland' },
        SWIM_FAR:   { to: 'goalIsland' }
      }
    },
    strollIn: {
      on: {
        FOUNDPERSON: { to: 'fightRandom' }
      }
    },
    fightRandom: {
      on: {
        WIN:  { to: 'victory' },
        LOSE: { to: 'death' }
      }
    },
    looters: {
      on: {
        FIGHT: { to: 'fight' },
        TRICK: { to: 'trick' },
        RUN:   { to: 'waterEdge' }
      }
    },
    waterEdge: {
      on: {
        FIGHT: { to: 'fight' },
        SWIM:  { to: 'swim' }
      }
    },
    getInfo: {
      on: {
        SEACHOICE: { to: 'seaChoice' }
      }
    },
    death: {
      on: {
        RESTART: { to: 'start' }
      }
    },
    victory: {
      on: {
        RESTART: { to: 'start' }
      }
    }
  }
});