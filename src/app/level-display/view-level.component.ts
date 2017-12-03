/**
 * Created by aRTie on 28/10/2017.
 */


import { Component, OnInit } from '@angular/core';
import { WebService } from '../services/web.service';
import { MoveResolutionService } from '../services/move-resolution.service';
import { MdDialog } from '@angular/material';
import { GameOverDialogComponent } from '../dialogs/game-over.component';
import * as _ from 'lodash';
// import { ReleaseNotesComponent } from './release-notes/release-notes.component';

@Component({
	selector: 'view-level',
	templateUrl: `./view-level.component.html`,
})

export class LevelViewComponent implements OnInit  {

	mapBase;
	mapLive;
	player;
	tiles;
	tilesIndex;
	isLoading;
	npcs;
	showCreature;
	showPlayer;
	showTile;
	currShowing;
	actionField;
	Math;

	constructor(
		private webSer: WebService,
		private dialog: MdDialog,
		private moveSer: MoveResolutionService,
	) {
		this.isLoading = true;
		this.tilesIndex = [];
		this.showCreature = false;
		this.showPlayer = false;
		this.showTile = false;
		this.currShowing = {};
		this.Math = Math;
		this.actionField = {
			activated: false,
			bgColor: '',
			canBodyEnter: false,
			canEnter: false,
			poxX: 0,
			posY: 0,
			radius: 0,
		};

	}



	ngOnInit() {
		this.webSer.loadFirstLevel().subscribe(result => {
			this.mapBase = result.mapData.tiles;

			this.tiles = result.tileData.rows;
			this.player = result.playerData;
			this.npcs = result.npcData;



			this.tilesIndex = this.tiles.map(oneTile => oneTile.id);
			this.tiles.push(this.player);
			this.tilesIndex.push(this.player._id);

			for (const oneNpc in this.npcs) {
				this.npcs[oneNpc].doc.curHp = _.cloneDeep(this.npcs[oneNpc].doc.baseHp);
				this.npcs[oneNpc].doc.curLvl = _.cloneDeep(this.npcs[oneNpc].doc.baseLevel);
				this.npcs[oneNpc].doc.origX = _.cloneDeep(this.npcs[oneNpc].x);
				this.npcs[oneNpc].doc.origY = _.cloneDeep(this.npcs[oneNpc].y);
				this.npcs[oneNpc].doc.curMove = 0;
				this.tiles.push(this.npcs[oneNpc]);
				this.tilesIndex.push(this.npcs[oneNpc]._id);
			}

			this.resetPlayer();

			this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);

			for (const yAxis in this.mapLive)  {
				for (const xAxis in this.mapLive[yAxis]) {
					console.log(this.actionField.activated === false || (((this.player.y - Number(yAxis) > this.player.possDistance) || (this.player.y - Number(yAxis) < -this.player.possDistance)) && ((this.player.x - Number(xAxis) > this.player.possDistance) && this.player.x - Number(xAxis) < -this.player.possDistance)));
				}
			}

			console.log(this.player);
			this.isLoading = false;

		});



    }

    checkAction (y, x) {
        console.log(y + '.' + x);
        this.actionField.activated = false;
        this.currShowing = _.cloneDeep(this.tiles[this.tilesIndex.indexOf(this.mapLive[y][x])]);
        switch (this.currShowing.doc.clickType) {
        case 'creature':
            this.showCreature = true;
            this.showPlayer = false;
            this.showTile = false;
            break;
        case 'player':
            this.showCreature = false;
            this.showPlayer = true;
            this.showTile = false;
            break;
        case 'tile':
            this.showCreature = false;
            this.showPlayer = false;
            this.showTile = true;
            break;
        default:
            this.showCreature = false;
            this.showPlayer = false;
            this.showTile = false;
            break;
        }
    }


    initMove (yChange, xChange) {
	    const enterType = this.player.wearingCreature ? 'canBodyEnter' : 'canEnter';
        this.player = this.moveSer.initMove(this.tiles, this.tilesIndex,
            this.mapBase, this.mapLive, this.player, yChange, xChange, enterType);

        if (this.player.curHp <= 0) {
            this.gameOverDialog();
        }

        if (this.player.moved) {
            this.moveSer.moveObjects(this.tiles, this.tilesIndex, this.mapBase, this.mapLive, this.player, this.npcs);
            this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
        }

    }


	gameOverDialog() {
		const dialogRef = this.dialog.open(GameOverDialogComponent, {
			width: '300px',
			disableClose: true
		});



		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog closed: ${result}`);
			this.resetPlayer();
			this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
		});
	}

	resetPlayer() {
		this.player.y = 7;
		this.player.x = 7;
		this.player.doc = {};
		this.player.doc.color = '#2f00ff';
		this.player.doc.displayAs = '@';
		this.player.doc.clickType = 'player';
        this.player.wearingCreature = false;
		this.player.curHp = _.cloneDeep(this.player.hp);
		for (const oneNpc in this.npcs) {
			this.npcs[oneNpc].doc.curHp = _.cloneDeep(this.npcs[oneNpc].doc.baseHp);
			this.npcs[oneNpc].x = _.cloneDeep(this.npcs[oneNpc].doc.origX);
			this.npcs[oneNpc].y = _.cloneDeep(this.npcs[oneNpc].doc.origY);
		}
	}

	activateArea(arType: string) {
		console.log(arType);
		switch (arType) {
			case 'possession':
				this.setPossessionArea();
				break;
			default:
				console.log('unknown action');
				break;
		}
	}

	setPossessionArea() {
		this.actionField = {
			activated: true,
			bgColor: '#140194', // '#0077FF',
			canBodyEnter: false,
			canEnter: false,
			poxX: 0,
			posY: 0,
			radius: 0,
		};
	}

    selectActiveArea(arType, yAxis, xAxis) {
        this.actionField.activated = false;
        switch(arType) {
            case 'possession':
                if (
                    this.tiles[this.tilesIndex.indexOf(this.mapLive[yAxis][xAxis])].doc
                    && this.tiles[this.tilesIndex.indexOf(this.mapLive[yAxis][xAxis])].doc.canPossess
                ) {
                    this.possessCreature(this.tiles[this.tilesIndex.indexOf(
                        this.mapLive[yAxis][xAxis])], this.tilesIndex.indexOf(this.mapLive[yAxis][xAxis]));
                } else {
                    console.log('no action');
                }
                break;
            default:
                console.log('Error: action no found!');
                break;

        }
    }

    possessCreature(creature, creatureIndex) {
        console.log(creature);
        this.player.wearingCreature = creature;
        this.player.y = creature.y;
        this.player.x = creature.x;
        this.npcs.splice(this.npcs.indexOf(creature), 1);
        this.tiles.splice(creatureIndex, 1);
        this.tilesIndex.splice(creatureIndex, 1);
        this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
        this.tiles = this.moveSer.setCreatureFocus(this.tiles, this.player._id, false);
        console.log(this.tiles);
    }

    release() {
	    this.player.curHp -= this.player.wearingCreature.doc.curLvl;
        if (this.player.curHp <= 0) {
            this.gameOverDialog();
        } else {
            this.player.wearingCreature = false;
        }

        this.tiles = this.moveSer.deleteCreatureFocus(this.tiles, this.player);
    }

}
