(function () {
    'use strict';

    var _GAME_WIDTH = 1200, _GAME_HEIGHT = 750;
    var _GUN_WIDTH = 832, _GUN_HEIGHT = 464;

    var map;
    var gun;
    var ammo;
    var nbAmmo = 0;
    var heart;
    var wave;
    var life = 3;
    var lifeText;
    var nbFire = 0;
    var viewfinder;
    var fire;
    var sounds = [];
    var impact;
    var impacts = [];
    var bird;
    var birds = [];
    var nbBirds = 10;
    var birdsKilled = 0;
    var birdSpeed = 120;
    var explosions;
    var explosionAnimation;
    var wavesText;
    var scoreText;
    var statusText;
    var ammoText;
    var bonus;
    var suite = 0;
    var suiteName = '';
    var points = 0;
    var waves = 1;
    var gameover;
    var factor = 1;
    var best = 0;
    if (typeof localStorage != 'undefined') {
        if ('best' in localStorage) {
            best = localStorage.getItem('best');
        } else {
            best = 0;
        }
    } else {
        best = 0;
    }

    var game = new Phaser.Game(_GAME_WIDTH, _GAME_HEIGHT, Phaser.AUTO, 'gameContainer', {
        preload: preload,
        create: create,
        update: update
    });

    function preload() {
        game.load.image('map', 'sprites/map.jpg');                            // WALLPAPER
        game.load.image('gun', 'sprites/gun.png');                            // GUN
        game.load.image('ammo', 'sprites/ammo.png');                          // AMMO
        game.load.image('heart', 'sprites/heart.png');                        // HEART
        game.load.image('wave', 'sprites/wave.png');                          // WAVE
        game.load.image('viewfinder', 'sprites/viewfinder.png');              // VIEWFINDER
        game.load.image('fire', 'sprites/fire.png');                          // FIRE
        game.load.image('impact', 'sprites/impact.png');                      // IMPACT
        game.load.spritesheet('bird', 'sprites/bird.png', 79, 54, 3);         // BIRDS
        game.load.spritesheet('explode', 'sprites/explode.png', 100, 100, 5); // EXPLOSIONS
        game.load.audio('gun', 'sounds/gun.wav');                             // GUN SOUND
        game.load.audio('reload', 'sounds/reload.wav');                       // RELOAD
        game.load.audio('dry', 'sounds/dry.wav');                             // DRY
        game.load.audio('chicken', 'sounds/chicken.wav');                     // CHICKEN SOUND
        game.load.audio('music', 'sounds/music.wav');                         // MUSIC

        // LOADING QUAKE SOUND MOD
        game.load.audio('firstblood', 'sounds/quake/firstblood.wav');   // FIRSTBLOOD
        game.load.audio('headshot', 'sounds/quake/headshot.wav');       // HEADSHOT
        game.load.audio('prepare', 'sounds/quake/prepare.wav');         // PREPARE
        game.load.audio('perfect', 'sounds/quake/perfect.wav');         // PERFECT
        game.load.audio('dominating', 'sounds/quake/dominating.wav');   // DOMINATING
        game.load.audio('humiliation', 'sounds/quake/humiliation.wav'); // HUMILIATION
        game.load.audio('holyshit', 'sounds/quake/holyshit.wav');       // HOLYSHIT
        game.load.audio('monsterkill', 'sounds/quake/monsterkill.wav'); // MONSTERKILL
    }

    function create() {
        map = game.add.tileSprite(0, 0, _GAME_WIDTH, _GAME_HEIGHT, 'map');
        scoreText = game.add.text(game.world.centerX, 20, '', {
            font: '18px Arial',
            fill: '#ffffff',
            align: 'right'
        });
        scoreText.anchor.setTo(0.5, 0.5);

        birds = game.add.group();
        birds.enableBody = true;
        birds.physicsBodyType = Phaser.Physics.ARCADE;

        impacts = game.add.group();
        impacts.enableBody = true;
        impacts.physicsBodyType = Phaser.Physics.ARCADE;
        impacts.createMultiple(30, null);
        impacts.setAll('anchor.x', 0.5);
        impacts.setAll('anchor.y', 0.5);
        impacts.setAll('outOfBoundsKill', true);
        impacts.setAll('checkWorldBounds', true);

        fire = game.add.sprite(0, 0, 'fire');
        fire.anchor.setTo(0.5, 0.5);
        fire.visible = false;

        gun = game.add.sprite(game.world.centerX + _GUN_WIDTH * 2, game.world.centerY + _GUN_HEIGHT * 2, 'gun');
        gun.anchor.setTo(0.5, 0.5);

        heart = game.add.sprite(_GAME_WIDTH - 45, 20, 'heart');
        heart.anchor.setTo(0.5, 0.5);

        wave = game.add.sprite(22, 20, 'wave');
        wave.anchor.setTo(0.5, 0.5);

        lifeText = game.add.text(_GAME_WIDTH - 15, 22, life, {
            font: '20px Arial',
            fill: 'red',
            align: 'center'
        });
        lifeText.anchor.setTo(0.5, 0.5);
        lifeText.stroke = '#000';
        lifeText.strokeThickness = 4;


        ammo = game.add.sprite(_GAME_WIDTH - 95, _GAME_HEIGHT - 60, 'ammo');
        ammo.anchor.setTo(0.5, 0.5);
        ammoText = game.add.text(_GAME_WIDTH - 45, _GAME_HEIGHT - 50, nbAmmo, {
            font: '40px Arial',
            fill: 'white',
            align: 'center'
        });
        ammoText.anchor.setTo(0.5, 0.5);
        ammoText.stroke = '#000';
        ammoText.strokeThickness = 4;

        statusText = game.add.text(game.world.centerX, 50, suiteName, {
            font: '20px Arial',
            fill: 'white',
            align: 'center'
        });
        statusText.anchor.setTo(0.5, 0.5);
        statusText.stroke = '#000';
        statusText.strokeThickness = 8;

        wavesText = game.add.text(50, 23, life, {
            font: '20px Arial',
            fill: 'white',
            align: 'center'
        });
        wavesText.anchor.setTo(0.5, 0.5);
        wavesText.stroke = '#000';
        wavesText.strokeThickness = 4;

        viewfinder = game.add.sprite(game.input.mousePointer.x, game.input.mousePointer.y, 'viewfinder');
        viewfinder.anchor.setTo(0.5, 0.5);

        sounds['gun'] = game.add.audio('gun', 0.5);
        sounds['reload'] = game.add.audio('reload');
        sounds['dry'] = game.add.audio('dry');
        sounds['chicken'] = game.add.audio('chicken', 0.5);
        sounds['music'] = game.add.audio('music', 0.5);

        sounds['firstblood'] = game.add.audio('firstblood');
        sounds['headshot'] = game.add.audio('headshot');
        sounds['prepare'] = game.add.audio('prepare');
        sounds['perfect'] = game.add.audio('perfect');
        sounds['dominating'] = game.add.audio('dominating');
        sounds['humiliation'] = game.add.audio('humiliation');
        sounds['holyshit'] = game.add.audio('holyshit');
        sounds['monsterkill'] = game.add.audio('monsterkill');

        game.input.onDown.add(fireBullet);

        explosions = game.add.group();
        for (var i = 0; i < nbBirds; i++) {
            var explodeAnimation = explosions.create(0, 0, 'explode', [0], false);
            explodeAnimation.anchor.setTo(0.5, 0.5);
            explodeAnimation.animations.add('explode');
        }

        createBirds();
        setTimeout(function () {
            sounds['music'].loop = true;
            sounds['music'].play();
        }, 4000);
    }

    function update() {
        wavesText.setText(waves);
        if (best != 0) {
            scoreText.setText('Score : ' + points + ' - Best score : ' + best);
        } else {
            scoreText.setText(points);
        }

        fire.position.x = gun.position.x - 160;
        fire.position.y = gun.position.y - 250;
        fire.angle = 230;

        viewfinder.position.x = game.input.mousePointer.x;
        viewfinder.position.y = game.input.mousePointer.y;

        lifeText.setText(life);
        statusText.setText(suiteName);
        ammoText.setText(nbAmmo);

        gun.position.x = game.input.mousePointer.x + _GUN_WIDTH / 2 - 145;
        if (game.input.mousePointer.y > game.world.centerY - _GUN_HEIGHT / 2) {
            gun.position.y = game.input.mousePointer.y + 145 + _GUN_HEIGHT / 2;
        }

        game.physics.arcade.overlap(impact, birds, hitBird, null, this);

        for (var i = 0; i < birds.length; i++) {
            var birdWidth = birds.children[i].body.width;
            if ((birds.children[i].getBounds().x + birdWidth) > _GAME_WIDTH + birdWidth) {
                birds.children[i].destroy();
                checkAliveBirds(false)
            }
        }

        if (typeof localStorage != 'undefined') {
            if (('best' in localStorage) && points > localStorage.getItem('best')) {
                localStorage.setItem('best', points);
                best = localStorage.getItem('best');
            }
        } else {
            best = 0;
        }
    }

    function reset() {
        life = 3;
        points = 0;
        waves = 1;
        suite = 0;
        suiteName = '';
        birdSpeed = 120;
        sounds = [];
        impacts = [];
        create();
    }

    function checkAliveBirds(success) {
        if (birds.length == 0) {
            birdSpeed += 30;
            waves++;
            createBirds();
        }

        if (!success) {
            life--;
            if (life == 0) {
                birds.destroy();
                sounds['music'].destroy();

                gameover = game.add.text(game.world.centerX, game.world.centerY, 'Game Over !', {
                    font: '65px Arial',
                    fill: 'red',
                    align: 'center'
                });

                gameover.anchor.setTo(0.5, 0.5);
                gameover.stroke = '#000';
                gameover.strokeThickness = 6;
                setTimeout(function () {
                    reset();
                }, 2000);
            }
        }
    }

    function createBirds() {
        nbFire = 0;
        birdsKilled = 0;

        setTimeout(function () {
            sounds['reload'].play();
            nbAmmo = 12;
        }, 1000);

        setTimeout(function () {
            sounds['prepare'].play();
        }, 2000);
        setTimeout(function () {
            for (var x = 0; x < nbBirds; x++) {
                bird = birds.create(x * 100, Math.floor((Math.random() * 300) + 1), 'bird');
                bird.anchor.setTo(0.5, 0.5);
                bird.animations.add('fly', [0, 1, 2, 3]);
                bird.animations.play('fly', 24, true);
                bird.scale.set(Math.random() * (0.6 - 1.1 + 1) + 0.6);
                bird.body.velocity.x = birdSpeed;
            }
            birds.x = -1000;
            birds.y = 80;
        }, 4000);
    }

    function fireBullet() {
        if (nbAmmo != 0) {
            nbFire++;
            nbAmmo--;
            fire.visible = true;
            sounds['gun'].play();
            impact = impacts.getFirstExists(false);
            if (impact) {
                impact.reset(game.input.mousePointer.x, game.input.mousePointer.y);
            }
            setTimeout(function () {
                fire.visible = false;
                impact.kill();
            }, 30);
        } else {
            sounds['dry'].play();
        }
    }

    function hitBird(impact, bird) {
        birdsKilled++;
        bonus = game.add.text(40, _GAME_HEIGHT - 40, '', {
            font: '32px Arial',
            fill: 'red',
            align: 'left'
        });
        bonus.stroke = '#000';
        bonus.strokeThickness = 6;

        game.time.events.add(0, function () {
            game.add.tween(bonus).to({y: _GAME_HEIGHT / 2}, 2500, Phaser.Easing.Linear.None, true);
            game.add.tween(bonus).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true);
        }, this);

        if ((bird.getBounds().x + bird.width) - impact.x < 10) {
            if (birds.length != 0 && birds.length != 10) {
                sounds['headshot'].play();
            } else if (nbFire != birdsKilled && birds.length == 0) {
                sounds['headshot'].play();
            }
            bonus.setText('HEADSHOT ! + ' + 20 * factor);
            points += 30 * factor;
        }

        points += 10 * factor;
        explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(impact.x, impact.y);
        explosionAnimation.play('explode', 24, false, true);
        impact.kill();
        bird.destroy();
        sounds['chicken'].play();

        if (birds.length == 9) {
            sounds['firstblood'].play();
        }

        if (nbFire == birdsKilled && birds.length == 0) {
            suite += (suite < 5) ? 1 : 0;
            switch (suite) {
                case 1:
                    factor = 2;
                    sounds['perfect'].play();
                    bonus.setText('PERFECT ! + 50');
                    points += 50 * factor;
                    suiteName = 'PERFECT : BONUS X2';
                    break;
                case 2:
                    factor = 3;
                    sounds['dominating'].play();
                    bonus.setText('DOMINATING ! + 100');
                    points += 100;
                    suiteName = 'DOMINATING : BONUS X3';
                    break;
                case 3:
                    factor = 4;
                    sounds['humiliation'].play();
                    bonus.setText('HUMILIATION ! + 150');
                    points += 150;
                    suiteName = 'HUMILIATION : BONUS X4';
                    break;
                case 4:
                    factor = 5;
                    sounds['holyshit'].play();
                    bonus.setText('HOLY SHIT ! + 200');
                    points += 200;
                    suiteName = 'HOLY SHIT : BONUS X5';
                    break;
                case 5:
                    factor = 6;
                    sounds['monsterkill'].play();
                    bonus.setText('MONSTER KILL ! + 400');
                    points += 400;
                    suiteName = 'MONSTER KILL : BONUS X6';
                    break;
            }
        } else if (nbFire != birdsKilled && birds.length == 0) {
            suite = 0;
            factor = 1;
            suiteName = '';
        }
        checkAliveBirds(true);
    }
})();