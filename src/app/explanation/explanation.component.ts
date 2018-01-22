/**
 * Created by Roman T on 1/21/2018.
 */

import { Component } from '@angular/core';

@Component({
    selector: 'view-explanation',
    templateUrl: `./explanation.component.html`,
})

export class ExplanationComponent {
    private baseExplanation: string[];
    private levelUpExplanation: string[];

    constructor() {
        this.baseExplanation =[
            'The player “wins” if there are no other creatures on the map',
            'Click on anything to get more details',
            'The player is unaffected by the other npcs until it possesses someone.',
            'While not possessing, the player will gradually loose consciousness. Once the player looses all consciousness, the game is over',
            'Once the player possesses something, all other npcs become aggressive until the player leaves the body of possessed npc',
            'The player does not loose consciousness while possessing an npc',
            'The player can release the possessed creature, but will kill it in the process and take damage equal to its level',
            'The player can attack by pressing the movement arrow pointing at the field occupied by an npc',
            'If the possessed creature dies, it\'ll do damage to the player\'s Consciousness equal to its level amount',
            'Everything has a different movement rate. Once a player possesses an npc, it\'ll move according to it\'s movement rate. Other npcs will gain or lose additional turns per the player\'s turn accordingly',
            'DEX translates to a number of hit rolls. Only the highest roll counts',
            'AGI translates to a number of dodge rolls. Only the highest roll counts',
            'If the AGI roll is higher that the DEX roll, the defender dodges',
        ];

         this.levelUpExplanation = [
                'Creature levels are dependent on skill points the creatures have',
                'Possessed creatures receive exp equal to the killed creature\'s level',
                'Possessed creatures will gain a level every time you reach the possessed creature\'s level worth of exp',
                'Evey level grants the possessed creature 5 ability points'
        ];
    }

}
