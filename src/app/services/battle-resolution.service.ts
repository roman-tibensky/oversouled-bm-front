/**
 * Created by aRTie on 15/12/2017.
 */

import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {isNullOrUndefined} from "util";


@Injectable()
export class BattleResolutionService {
    initAttack(attacker, target, attackType, tiles) {
        const atckObj = tiles[attacker];
        const trgtObj = tiles[target];
        let atckDmg;
        switch(attackType) {
            case 'phys':
                atckDmg = atckObj.doc.wearingCreature ? atckObj.doc.wearingCreature.doc.baseStr : atckObj.doc.baseStr;
                if (trgtObj.doc.wearingCreature){
                    trgtObj.doc.wearingCreature.doc.curHp = (atckDmg - trgtObj.doc.wearingCreature.doc.baseDef > 0)
                        ? trgtObj.doc.wearingCreature.doc.curHp - atckDmg + trgtObj.doc.wearingCreature.doc.baseDef
                        : trgtObj.doc.wearingCreature.doc.curHp;
                } else {
                    trgtObj.doc.curHp = (atckDmg - trgtObj.doc.baseDef > 0)
                        ? trgtObj.doc.curHp - atckDmg + trgtObj.doc.baseDef
                        : trgtObj.doc.curHp;
                }
                break;
            case 'mag':
                atckDmg = atckObj.doc.wearingCreature ? atckObj.doc.wearingCreature.doc.baseMgc : atckObj.doc.baseMgc;
                if (trgtObj.doc.wearingCreature){
                    trgtObj.doc.wearingCreature.doc.curHp = (atckDmg - trgtObj.doc.wearingCreature.doc.baseRes > 0)
                        ? trgtObj.doc.wearingCreature.doc.curHp - atckDmg + trgtObj.doc.wearingCreature.doc.baseRes
                        : trgtObj.doc.wearingCreature.doc.curHp;
                } else {
                    trgtObj.doc.curHp = (atckDmg - trgtObj.doc.baseRes > 0)
                        ? trgtObj.doc.curHp - atckDmg + trgtObj.doc.baseRes
                        : trgtObj.doc.curHp;
                }

                break;
        }

        return tiles;
    }
}

