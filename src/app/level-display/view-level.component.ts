/**
 * Created by aRTie on 28/10/2017.
 */


import { Component, OnInit } from '@angular/core';
import { WebService } from '../services/web.service';
import { MoveResolutionService } from '../services/move-resolution.service';
// import { BattleResolutionService } from '../services/battle-resolution.service';
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
        // private batSer: BattleResolutionService
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
            this.tilesIndex.push(this.player.doc._id);

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

            console.log(this.player);
            this.isLoading = false;

        });



    }

    checkAction (y, x) {
        console.log(y + '.' + x);
        this.actionField.activated = false;
        // this.currShowing = _.cloneDeep(this.tiles[this.tilesIndex.indexOf(this.mapLive[y][x])]);
        this.currShowing = this.tilesIndex.indexOf(this.mapLive[y][x]);
        switch (this.tiles[this.currShowing].doc.clickType) {
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
        const enterType = this.player.doc.wearingCreature ? 'canBodyEnter' : 'canEnter';
        if (
            this.player.doc.wearingCreature
            && this.tiles[this.tilesIndex.indexOf(this.mapLive[this.player.y + yChange][this.player.x + xChange])].doc.curHp
            && this.tilesIndex.indexOf(this.player.doc._id) !== this.tilesIndex.indexOf(this.mapLive[this.player.y + yChange][this.player.x + xChange])
        ) {
            this.tiles[this.tilesIndex.indexOf(this.mapLive[this.player.y + yChange][this.player.x + xChange])] = this.moveSer.initAttack(
                this.tilesIndex.indexOf(this.player.doc._id),
                this.tilesIndex.indexOf(this.mapLive[this.player.y + yChange][this.player.x + xChange]),
                this.player.doc.wearingCreature.doc.attckType,
                this.tiles
            );
            if (this.tiles[this.tilesIndex.indexOf(this.mapLive[this.player.y + yChange][this.player.x + xChange])].doc.curHp <= 0) {
                const creatureIndex = this.tilesIndex.indexOf(this.mapLive[this.player.y + yChange][this.player.x + xChange]);
                this.npcs.splice(this.npcs.indexOf(this.tiles[creatureIndex]), 1);
                this.tiles.splice(creatureIndex, 1);
                this.tilesIndex.splice(creatureIndex, 1);
                this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
            }
        } else {
            this.player = this.moveSer.initMove(this.tiles, this.tilesIndex,
                this.mapBase, this.mapLive, this.player, yChange, xChange, enterType);
        }
        if (this.player.doc.curHp <= 0) {
            this.gameOverDialog(true);
        }

        if (this.player.moved) {
            this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
            this.moveSer.moveObjects(this.tiles, this.tilesIndex, this.mapBase, this.mapLive, this.player, this.npcs);
            this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
            if (this.player.doc.wearingCreature && this.player.doc.wearingCreature.doc.curHp <= 0) {
                this.release();
            }
            if(this.npcs.length === 0) {
                this.gameOverDialog(false);
            }
        }

    }


    gameOverDialog(gameOver: boolean) {
        const dialogRef = this.dialog.open(GameOverDialogComponent, {
            width: '300px',
            disableClose: true,
            data: {
                gameOver: gameOver
            }

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
        this.player.doc.color = '#2f00ff';
        this.player.doc.displayAs = '@';
        this.player.doc.clickType = 'player';
        this.player.doc.wearingCreature = false;
        this.player.doc.curHp = _.cloneDeep(this.player.doc.hp);
        for (const oneNpc in this.npcs) {
            this.npcs[oneNpc].doc.curHp = _.cloneDeep(this.npcs[oneNpc].doc.baseHp);
            this.npcs[oneNpc].x = _.cloneDeep(this.npcs[oneNpc].doc.origX);
            this.npcs[oneNpc].y = _.cloneDeep(this.npcs[oneNpc].doc.origY);
        }
        this.moveSer.deleteMessages();
        this.moveSer.addMessages(['You enter a new world. Your consciousness is about to give in.'])
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
        this.player.doc.wearingCreature = creature;
        this.player.y = creature.y;
        this.player.x = creature.x;
        this.npcs.splice(this.npcs.indexOf(creature), 1);
        this.tiles.splice(creatureIndex, 1);
        this.tilesIndex.splice(creatureIndex, 1);
        this.mapLive = this.moveSer.updateMap(this.mapLive, this.mapBase, this.player, this.npcs);
        this.tiles = this.moveSer.setCreatureFocus(this.tiles, this.player.doc._id, false);
        this.moveSer.addMessages([this.player.doc.wearingCreature.doc.displayAs + ' is now a slave to your will.']);
    }

    release() {
        this.player.doc.curHp -= this.player.doc.wearingCreature.doc.curLvl;
        const message = this.player.doc.wearingCreature.doc.curHp <= 0 ?
            `Body of ${this.player.doc.wearingCreature.doc} becomes unusable and you are violently trust out` :
            `You tear yourself away from your borrowed body. It falls limp to the ground.`;

        if (this.player.doc.curHp <= 0) {
            this.gameOverDialog(true);
        } else {
            this.player.doc.wearingCreature = false;
        }

        this.tiles = this.moveSer.deleteCreatureFocus(this.tiles, this.player.doc._id);
        this.moveSer.addMessages([message, 'Your consciousness starts fading again.']);
    }

    viewCurFocus(currShowing){
        return this.tiles[currShowing];
    }

}
