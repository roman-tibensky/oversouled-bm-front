/**
 * Created by aRTie on 12/11/2017.
 */


import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {isNullOrUndefined} from "util";


@Injectable()
export class MoveResolutionService {
    initMove(tiles, tilesIndex, mapBase, mapLive, movedObject, yChange, xChange, howToEnter) {

        const enterDecissionTile = tiles[tilesIndex.indexOf(mapBase[movedObject.y + yChange][movedObject.x + xChange])].wearingCreature
            ? tiles[tilesIndex.indexOf(mapBase[movedObject.y + yChange][movedObject.x + xChange])].wearingCreature.doc[howToEnter]
            : tiles[tilesIndex.indexOf(mapBase[movedObject.y + yChange][movedObject.x + xChange])].doc[howToEnter];

        const enterDeciddionLive = tiles[tilesIndex.indexOf(mapLive[movedObject.y + yChange][movedObject.x + xChange])].wearingCreature
            ? tiles[tilesIndex.indexOf(mapLive[movedObject.y + yChange][movedObject.x + xChange])].wearingCreature.doc[howToEnter]
            : tiles[tilesIndex.indexOf(mapLive[movedObject.y + yChange][movedObject.x + xChange])].doc[howToEnter];

        if (enterDecissionTile && enterDeciddionLive) {
            movedObject.y += yChange;
            movedObject.x += xChange;

            if (movedObject.wearingCreature) {
                movedObject.wearingCreature.doc.curHp += movedObject.wearingCreature.doc.baseHpAdjust;
            } else {
                movedObject.curHp += movedObject.hpAdjust;
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
        mapLive[player.y][player.x] = player._id;
        return mapLive;
    }

    moveObjects(tiles, tilesIndex, mapBase, mapLive, player, movedObjects){

        const playerMovement = player.wearingCreature ? player.wearingCreature.doc.movement : player.movement;

        for (const oneObj in movedObjects) {
            if (
                movedObjects[oneObj].doc !== undefined
                && movedObjects[oneObj].doc.focus !== undefined
                && movedObjects[oneObj].doc.focus.trim() !== ''
            ) {
                this.focusedMove(tiles, tilesIndex, mapBase, mapLive, movedObjects[oneObj], playerMovement, 'canBodyEnter');
            } else {
                this.randomMove(tiles, tilesIndex, mapBase, mapLive, movedObjects[oneObj], playerMovement, 'canBodyEnter');
            }

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

    randomMove(tiles, tilesIndex, mapBase, mapLive, movedObj, playerMovement, canBodyEnter){

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

    focusedMove(tiles, tilesIndex, mapBase, mapLive, movedObj, playerMovement, canBodyEnter) {
        const focusedChar  = tiles[tilesIndex.indexOf(movedObj.doc.focus)];
        const diff = Math.floor(movedObj.doc.curMove + (movedObj.doc.movement / playerMovement )) - movedObj.doc.curMove;
        for (let i = 0; i < diff; i++ ) {
            let x = 0;
            let y = 0;
            if (focusedChar.x  < movedObj.x) {
                 x = -1;
            }
            if (focusedChar.x  > movedObj.x) {
                x = 1;
            }

            if (focusedChar.y  < movedObj.y) {
                y = -1;
            }
            if (focusedChar.y  > movedObj.y) {
                y = 1;
            }


            if (y !== 0 && x !== 0) {
                movedObj = this.initMove(tiles, tilesIndex, mapBase, mapLive, movedObj, y, x, canBodyEnter);
            }

        }

        movedObj.doc.curMove += (movedObj.doc.movement / playerMovement);
        return movedObj;

    }


}
