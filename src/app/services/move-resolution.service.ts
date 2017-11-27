/**
 * Created by aRTie on 12/11/2017.
 */


import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';


@Injectable()
export class MoveResolutionService {
	initMove(tiles, tilesIndex, mapBase, mapLive, movedObject, yChange, xChange, howToEnter) {

		if (
			tiles[tilesIndex.indexOf(mapBase[movedObject.y + yChange][movedObject.x + xChange])].doc[howToEnter]
			&& (howToEnter !== 'canBodyEnter'
				|| tiles[tilesIndex.indexOf(mapLive[movedObject.y + yChange][movedObject.x + xChange])].doc[howToEnter]
			)
		) {
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

		for(const oneObj in movedObjects) {
			const diff = Math.floor(movedObjects[oneObj].doc.curMove + movedObjects[oneObj].doc.movement) - movedObjects[oneObj].doc.curMove;
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
					movedObjects[oneObj] = this.initMove(tiles, tilesIndex, mapBase, mapLive, movedObjects[oneObj], y, x, 'canBodyEnter');
				}
			}
			movedObjects[oneObj].doc.curMove += movedObjects[oneObj].doc.movement;

		}

		return movedObjects;
	}



}
