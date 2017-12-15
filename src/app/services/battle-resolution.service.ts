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
        let atckObj = tiles[attacker];
        let trgtObj = tiles[target];
        switch(attackType) {
            case 'phys':
                trgtObj.doc.curHp = (atckObj.doc.baseStr - trgtObj.doc.baseDef <= 0)
                    ? trgtObj.doc.curHp - atckObj.doc.baseStr - trgtObj.doc.baseDef
                    : trgtObj.doc.curHp;
                break;
            case 'mag':
                trgtObj.doc.curHp = (atckObj.doc.baseStr - trgtObj.doc.baseRes <= 0)
                    ? trgtObj.doc.curHp - atckObj.doc.baseStr - trgtObj.doc.baseRes
                    : trgtObj.doc.curHp;
                break;
        }

        return tiles;
    }
}


