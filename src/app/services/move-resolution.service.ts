/**
 * Created by aRTie on 12/11/2017.
 */


import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {isNullOrUndefined} from "util";
// import { BattleResolutionService } from './battle-resolution.service';


@Injectable()
export class MoveResolutionService {
//    constructor(private batSer: BattleResolutionService){
//    }


    initMove(tiles, tilesIndex, mapBase, mapLive, movedObject, yChange, xChange, howToEnter) {

        const enterDecissionTile = tiles[tilesIndex.indexOf(mapBase[movedObject.y + yChange][movedObject.x + xChange])].doc.wearingCreature
            ? tiles[tilesIndex.indexOf(mapBase[movedObject.y + yChange][movedObject.x + xChange])].doc.wearingCreature.doc[howToEnter]
            : tiles[tilesIndex.indexOf(mapBase[movedObject.y + yChange][movedObject.x + xChange])].doc[howToEnter];

        let enterDeciddionLive = tiles[tilesIndex.indexOf(mapLive[movedObject.y + yChange][movedObject.x + xChange])].doc.wearingCreature
            ? tiles[tilesIndex.indexOf(mapLive[movedObject.y + yChange][movedObject.x + xChange])].doc.wearingCreature.doc[howToEnter]
            : tiles[tilesIndex.indexOf(mapLive[movedObject.y + yChange][movedObject.x + xChange])].doc[howToEnter];

        if(yChange === 0 && xChange === 0) {
            enterDeciddionLive = true;
        }

        if (enterDecissionTile && enterDeciddionLive) {
            movedObject.y += yChange;
            movedObject.x += xChange;

            if (movedObject.doc.wearingCreature) {
                movedObject.doc.wearingCreature.doc.curHp += movedObject.doc.wearingCreature.doc.baseHpAdjust;
            } else {
                movedObject.doc.curHp += movedObject.doc.hpAdjust ? movedObject.doc.hpAdjust : movedObject.doc.baseHpAdjust;
            }
            movedObject.moved = true;

        } else {
            movedObject.moved = false;
        }

        return movedObject;
    }


    updateMap(mapLive, mapBase, player, movedObjects) {
        mapLive = _.cloneDeep(mapBase);
        for (const oneObj of movedObjects) {
            mapLive[oneObj.y][oneObj.x] = oneObj._id;
        }
        mapLive[player.y][player.x] = player.doc._id;
        return mapLive;
    }

    moveObjects(tiles, tilesIndex, mapBase, mapLive, player, movedObjects) {

        const playerMovement = player.doc.wearingCreature ? player.doc.wearingCreature.doc.movement : player.doc.movement;

        for (const oneObj in movedObjects) {
            if (
                movedObjects[oneObj].doc !== undefined
                && movedObjects[oneObj].doc.focus !== undefined
                && movedObjects[oneObj].doc.focus.trim() !== ''
            ) {
                movedObjects = this.focusedMove(tiles, tilesIndex, mapBase, mapLive, oneObj, movedObjects, playerMovement, 'canBodyEnter');
            } else {
                this.randomMove(tiles, tilesIndex, mapBase, mapLive, movedObjects[oneObj], playerMovement, 'canBodyEnter');
            }

            mapLive = this.updateMap(mapLive, mapBase, player, movedObjects);
        }

        return movedObjects;
    }


    setCreatureFocus(creatures, focus, override) {
        for (const key in creatures) {
            if (
                creatures[key].doc !== undefined
                && creatures[key].doc.focus !== undefined
                && (override || creatures[key].doc.focus.trim() === '')
            ) {
                creatures[key].doc.focus = focus;
            }
        }

        return creatures;
    }

    deleteCreatureFocus(creatures, focus) {
        for (const key in creatures) {
            if (
                creatures[key].doc
                && creatures[key].doc.focus
                && creatures[key].doc.focus === focus
            ) {
                creatures[key].doc.focus = '';
            }
        }

        return creatures;
    }

    randomMove (tiles, tilesIndex, mapBase, mapLive, movedObj, playerMovement, canBodyEnter) {

        const diff = Math.floor(movedObj.doc.curMove + (movedObj.doc.movement / playerMovement )) - movedObj.doc.curMove;
        for (let i = 0; i < diff; i++ ) {

            let y = 0;
            let x = 0;
            const direschun = Math.floor(Math.random() * 9);
            switch (direschun) {
                case 1:
                    y = -1;
                    x = -1;
                    break;
                case 2:
                    y = -1;
                    x = 0;
                    break;
                case 3:
                    y = -1;
                    x = 1;
                    break;
                case 4:
                    y = 0;
                    x = -1;
                    break;
                case 5:
                    y = 0;
                    x = 1;
                    break;
                case 6:
                    y = 1;
                    x = -1;
                    break;
                case 7:
                    y = 1;
                    x = 0;
                    break;
                case 8:
                    y = 1;
                    x = 1;
                    break;
                default:
                    y = 0;
                    x = 0;
                    break;
            }

            if (y !== 0 && x !== 0) {
                movedObj = this.initMove(tiles, tilesIndex, mapBase, mapLive, movedObj, y, x, canBodyEnter);
            }
        }
        movedObj.doc.curMove += (movedObj.doc.movement / playerMovement);
        return movedObj;
    }

    focusedMove(tiles, tilesIndex, mapBase, mapLive, oneObj, movedObjects, playerMovement, canBodyEnter) {
        let focusedChar  = tiles[tilesIndex.indexOf(movedObjects[oneObj].doc.focus)];
        const diff = Math.floor(movedObjects[oneObj].doc.curMove + (movedObjects[oneObj].doc.movement / playerMovement )) - movedObjects[oneObj].doc.curMove;
        for (let i = 0; i < diff; i++ ) {
            let x = 0;
            let y = 0;
            if (focusedChar.x  < movedObjects[oneObj].x) {
                 x = -1;
            }
            if (focusedChar.x  > movedObjects[oneObj].x) {
                x = 1;
            }

            if (focusedChar.y  < movedObjects[oneObj].y) {
                y = -1;
            }
            if (focusedChar.y  > movedObjects[oneObj].y) {
                y = 1;
            }


            if (y !== 0 || x !== 0) {
                if (focusedChar.x === (movedObjects[oneObj].x + x) && focusedChar.y === (movedObjects[oneObj].y + y)) {
                    focusedChar = this.initAttack(
                        tilesIndex.indexOf(movedObjects[oneObj]._id || movedObjects[oneObj].doc._id),
                        tilesIndex.indexOf(focusedChar._id || focusedChar.doc._id),
                        movedObjects[oneObj].doc.wearingCreature ? movedObjects[oneObj].doc.wearingCreature.doc.attckTyp :  movedObjects[oneObj].doc.attckType,
                        tiles
                    )
                } else {
                    movedObjects[oneObj] = this.initMove(tiles, tilesIndex, mapBase, mapLive, movedObjects[oneObj], y, x, canBodyEnter);
                }

            }

        }

        movedObjects[oneObj].doc.curMove += (movedObjects[oneObj].doc.movement / playerMovement);
        return movedObjects;

    }

    initAttack(attacker, target, attackType, tiles) {
        const atckObj = tiles[attacker];
        let trgtObj = tiles[target];
        let atckDmg;
        switch (attackType) {
            case 'phys':
                atckDmg = atckObj.doc.wearingCreature ? atckObj.doc.wearingCreature.doc.baseStr : atckObj.doc.baseStr;
                if (trgtObj.doc.wearingCreature) {
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
                if (trgtObj.doc.wearingCreature) {
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

        trgtObj = this.setCreatureFocus([trgtObj], atckObj.doc._id, true)[0];

        return trgtObj;
    }


}
