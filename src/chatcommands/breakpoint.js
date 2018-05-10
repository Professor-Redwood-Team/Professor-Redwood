'use strict';

// See https://github.com/saucyallison/discordbot
/* eslint-disable */

const CONSTANTS = require('./../constants');

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

function getEffectiveness(move, defender) {
    var moveInfo = moves[move];
    var moveType = moveInfo["type"];
    var defenderInfo = pokemon[defender];
    var defenderTypes = defenderInfo["types"];
    var multiplier = 1.0;
    for (var i=0; i<defenderTypes.length; i++) {
        var defenderType = defenderTypes[i];
        // check if it's super effective
        if (types[moveType]["se"].indexOf(defenderType) >= 0) {
            multiplier *= 1.4;
        }
        // check if it's not very effective
        else if (types[moveType]["nve"].indexOf(defenderType) >= 0) {
            multiplier *= 0.714;
        }
        // check if defender is "immune"
        else if (types[moveType]["immune"].indexOf(defenderType) >= 0) {
            multiplier *= 0.714 * 0.714;
        }
    }
    return multiplier;
}

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

        var currentMaxDamage = getDamage(attacker, iv, move, defender, 20);
        breakpoints[defender][20] = currentMaxDamage;
        for (var level=20; level<40; level+=0.5) {
            var damage = getDamage(attacker.toUpperCase(), iv, move, defender.toUpperCase(), level);
            if (damage > currentMaxDamage) {
                breakpoints[defender][level] = damage;
                currentMaxDamage = damage;
            }
        }
        var sortedKeys = Object.keys(breakpoints[defender]).sort();
        for (var i=0; i<sortedKeys.length; i++) {
            var level = parseFloat(sortedKeys[i]);
            var damage = breakpoints[defender][level];
            var separator = (level % 1 == 0) ? ":   " : ": "; // add nice spacing for levels with .5
            reply += "Lv"+level+separator+breakpoints[defender][level];
            var percent = "";
            if (i > 0) {
                // add a % increase calculation
                var prevLevel = parseFloat(sortedKeys[i-1]);
                percent = roundTo((1.0 * breakpoints[defender][level] / breakpoints[defender][prevLevel] - 1) * 100.0, 2);
                reply += " (+"+percent+"%)"
            }
            reply += "\n";
        }
        if (Object.keys(breakpoints[defender]).indexOf(39.5) == -1) {
            reply = reply + "Lv39.5: "+getDamage(attacker, iv, move, defender, level);
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
	if (!msgSplit || msgSplit.length < 4) {
        reply = 'Sorry, incorrect format.\n'+usage;
        message.channel.send(reply);
        return reply;
    }
	const attacker = CONSTANTS.standardizePokemonName(msgSplit[1]);
    const move = msgSplit[2];
    const iv = msgSplit[3]; // check for int 0-15
    if (isNaN(iv) || iv > 15 || iv < 0) {
		reply = "Sorry, IV must be 0-15.\n"+usage
        message.channel.send(reply);
        return reply;
    }
    let defender = null; // specifying defender is optional
    if (msgSplit.length >= 5) {
        defender = CONSTANTS.standardizePokemonName(msgSplit[4]);
    }
    reply = calcBreakpoint(attacker, move, iv, defender);
    
	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return getBreakpoint(data, message);
});
