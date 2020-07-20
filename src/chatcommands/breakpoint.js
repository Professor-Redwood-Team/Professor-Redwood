'use strict';

// See https://github.com/saucyallison/discordbot
/* eslint-disable */

const CONSTANTS = require('./../constants');
const pokemon = require('../../data/pokemon.json');
const moves = require('../../data/moves.json');
const counters = require('../../data/counters.json');
const damage = require('../util/damage.js');

const usage = 'Command usage: **!breakpoint attacker attack_name iv (optional: defender)**';
const counters = require('../../data/counters.json');
const levelToCPM = require('../../data/levelToCPM.json');
const raidBossTiers = require('../../data/raidBossTiers.json');
const pokemon = require('../../data/pokemon.json');
const moves = require('../../data/moves.json');
const types = require('../../data/types.json');

function roundTo(num, digits) {
    return +(Math.round(num + "e+"+digits)  + "e-"+digits);
}

function getDamage(attacker, iv, move, defender, level) {
    attacker = attacker.toUpperCase();
    move = move.toUpperCase();
    defender = defender.toUpperCase();
    var power = getPower(move);
    var attack = getBaseStat(attacker, "attack");
    var attackIV = iv;
    var attackerCPM = getCPM(level);
    var defense = getBaseStat(defender, "defense");
    var defenseIV = 15;
    var defenderCPM = getBossCPM(defender)
    var STAB = getSTAB(move, attacker);
    var effectiveness = getEffectiveness(move, defender);
    return Math.floor(0.5 * power * ((attack+attackIV) * attackerCPM) / ((defense+defenseIV) * defenderCPM) * STAB * effectiveness) + 1;
}

function getPower(move) {
    return moves[move]["power"];
}

function getBaseStat(name, stat) {
    return pokemon[name]["stats"][stat];
}

function getCPM(level) {
    return levelToCPM[level.toString()];
}

function getBossCPM(boss) {
    var tierToCPM = {
        "5": 0.79,
        "4": 0.79,
        "3": 0.73,
        "2": 0.67,
        "1": 0.61
    };
    var tier;
    tier = raidBossTiers[boss];
    if (!tier) {
        return 0.79; // this isn't a raid boss, so assume tier 4/5
    }
    return tierToCPM[tier];
}

function getSTAB(move, attacker) {
    var type = moves[move]["type"];
    if (pokemon[attacker]["types"].indexOf(type) >= 0) {
        return 1.2;
    }
    return 1.0;
}

const usage = 'Command usage: **!breakpoint attacker attack_name iv (optional: defender)**';

function calcBreakpoint(attacker, move, iv, defender) {
    attacker = attacker.toUpperCase();
    move = move.toUpperCase();
    iv = parseInt(iv);
    var pokeInfo = pokemon[attacker];
    var moveInfo = moves[move];
    // list of bosses will either be what the user specified, or we find some
    var bosses = (defender == null) ? getBosses(attacker) : [defender];
    // TODO: if none found, find one that attacker is decent against.
     // for now, we'll just assume.. mewtwo
    if (bosses.length == 0) {
      bosses = ['mewtwo']
    }
    var reply = "";
    var breakpoints = {};
    if (!pokeInfo) {
        reply = 'Sorry, I can\'t find that pokemon. Remember to enter the pokemon\'s exact name in the pokedex.\n'+usage;
        return reply;
    }
    if (!moveInfo) {
        reply = 'Sorry, I can\'t find that move. Remember to replace spaces with _ when typing a move.\n'+usage;
        return reply;
    }
    for (var index in bosses) {
        var defender = bosses[index];
        if(!defender || !pokemon[defender.toUpperCase()]) {
            reply = 'Sorry, I can\'t find that defender. Remember to enter the pokemon\'s exact name in the pokedex.\n'+usage;
            return reply;
        }
        breakpoints[defender] = {}
        reply += move.replace("_", " ")+" damage against "+defender.capitalize()+"\n";

        var currentMaxDamage = damage.calcDamage(attacker, 20, iv, move, defender, 40, 20);
        breakpoints[defender][20] = currentMaxDamage;
        for (var level=20; level<40; level+=0.5) {
            var currentDamage = damage.calcDamage(attacker, level, iv, move, defender, 40, 15);
            if (currentDamage > currentMaxDamage) {
                breakpoints[defender][level] = currentDamage;
                currentMaxDamage = currentDamage;
            }
        }
        var sortedKeys = Object.keys(breakpoints[defender]).sort();
        for (var i=0; i<sortedKeys.length; i++) {
            var level = parseFloat(sortedKeys[i]);
            var separator = (level % 1 == 0) ? ":   " : ": "; // add nice spacing for levels with .5
            reply += "Lv"+level+separator+breakpoints[defender][level];
            var percent = "";
            if (i > 0) {
                // add a % increase calculation
                var prevLevel = parseFloat(sortedKeys[i-1]);
                percent = CONSTANTS.roundTo((1.0 * breakpoints[defender][level] / breakpoints[defender][prevLevel] - 1) * 100.0, 2);
                reply += " (+"+percent+"%)"
            }
            reply += "\n";
        }
        if (Object.keys(breakpoints[defender]).indexOf("39.5") == -1) {
            reply = reply + "Lv39.5: "+damage.calcDamage(attacker, level, iv, move, defender, 40, 15);
        }
        reply += "\n";
    }
    return "```"+reply+"```";
}

function getBosses(attacker) {
    var bosses = [];
    for (var boss in counters) {
        if (Object.keys(counters[boss]).indexOf(attacker.toLowerCase()) >= 0) {
            bosses.push(boss);
        }
    }
    return bosses.slice(-3); // return last 3 elements
}

const getBreakpoint = (data, message) => {
    let reply = '';
    const msgSplit = message.content.toLowerCase().split(" ");
    if (!msgSplit || msgSplit.length < 3) {
        reply = 'Sorry, incorrect format.\n'+usage;
        message.channel.send(reply);
        return reply;
    }
    // let's be smart because the order of arguments is hard to remember.
    let words = []; // word order should naturally be: attacker, attack, defender
    let numbers = []; // attacker IV
    for (var i=1; i<msgSplit.length; i++) {
        if (isNaN(msgSplit[i])) {
            words.push(msgSplit[i]);
        }
        else {
            numbers.push(msgSplit[i]);
        }
    }
    if (numbers.length == 0) { numbers.push('15'); }
    const attacker = CONSTANTS.standardizePokemonName(words[0]);
    const move = words[1];
    const iv = numbers[0]; // check for int 0-15
    if (isNaN(iv) || iv > 15 || iv < 0) {
        reply = "Sorry, IV must be 0-15.\n"+usage
        message.channel.send(reply);
        return reply;
    }
    let defender = null; // specifying defender is optional
    if (words.length >= 3) {
        defender = CONSTANTS.standardizePokemonName(words[2]);
    }
    reply = calcBreakpoint(attacker, move, iv, defender);
    
    message.channel.send(reply);
    return reply;
};

module.exports = (data) => ( (message) => {
    return getBreakpoint(data, message);
});
