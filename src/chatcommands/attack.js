'use strict';

/* eslint-disable */

const CONSTANTS = require('./../constants');
const damage = require('../util/damage.js');
const pokemon = require('../../data/pokemon.json');
const moves = require('../../data/moves.json');

const usage = 'Command usage: **!attack attacker level attack_name iv defender level iv**\nExample: !attack machamp 20 counter 15 blissey 30 12';

const getDamage = (data, message) => {
    let reply = '';
    const msgSplit = message.content.toLowerCase().split(" ");
    if (!msgSplit || msgSplit.length < 4) {
        reply = 'Sorry, incorrect format.\n'+usage;
        message.channel.send(reply);
        return reply;
    }
    // let's be smart because the order of arguments is hard to remember.
    let words = []; // word order should naturally be: attacker, attack, defender
    let numbers = []; // numbers are IVs if <=15, and level if 20<=number<=40
    for (var i=1; i<msgSplit.length; i++) {
        if (isNaN(msgSplit[i])) {
            words.push(msgSplit[i]);
        }
        else {
            numbers.push(msgSplit[i]);
        }
    }
    if (words.length < 3) {
        reply = 'Sorry, incorrect format.\n'+usage;
        message.channel.send(reply);
        return reply;
    }
    const attacker = CONSTANTS.standardizePokemonName(words[0]);
    const move = words[1];
    const defender = CONSTANTS.standardizePokemonName(words[2]);
    if (!pokemon[attacker.toUpperCase()] ||
        !pokemon[defender.toUpperCase()] ||
        !moves[move.toUpperCase()]) {
            reply = 'Sorry, incorrect format.\n'+usage;
            message.channel.send(reply);
            return reply;
    }
    let attackerLevel = 0;
    let attackIV = 0;
    let defenderLevel = 0;
    let defenseIV = 0;

    // pick out IVs/level based on whether arguments <=15 (IV) or >=20 (level)
    for (var i=0; i<numbers.length; i++) {
        if (numbers[i] >= 20 && numbers[i] <= 40) {
            if (attackerLevel == 0 &&
                    msgSplit.indexOf(numbers[i]) < msgSplit.indexOf(defender.toLowerCase())) {
                attackerLevel = numbers[i];
            }
            else {
                defenderLevel = numbers[i];
            }
        }
        else if (numbers[i] >= 0 && numbers[i] <= 15) {
            if (attackIV == 0 &&
                    msgSplit.indexOf(numbers[i]) < msgSplit.indexOf(defender.toLowerCase())) {
                attackIV = numbers[i];
            }
            else {
                defenseIV = numbers[i];
            }
        }
    }
    // set any necessary defaults
    if (attackerLevel == 0) { attackerLevel = 20; }
    if (attackIV == 0) { attackIV = 15; }
    if (defenderLevel == 0) { defenderLevel = 20; }
    if (defenseIV == 0) { defenseIV = 15; }

    reply = "```Attacker: "+attacker.capitalize()+" (Lv"+attackerLevel+") (Attack IV: "+attackIV+")\n";
    reply += "Defender: "+defender.capitalize()+" (Lv"+defenderLevel+") (Defense IV: "+defenseIV+")\n";
    reply += move.toUpperCase().replace('_', ' ')+" does ";
    reply += damage.calcDamage(attacker, attackerLevel, attackIV, move, defender, defenderLevel, defenseIV)
    reply += " damage```";

    message.channel.send(reply);
    return reply;
};

module.exports = (data) => ( (message) => {
    return getDamage(data, message);
});
