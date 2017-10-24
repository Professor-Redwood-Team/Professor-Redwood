'use strict';

/* eslint-disable */

const pokemonInfo = require('../../data/pokemon.json');
const CONSTANTS = require('./../constants');

function formatList(list, separator) {
    var listStr = "";
    for (var i=0; i<list.length; i++) {
        listStr = listStr + list[i] + separator + " "
    }
    return listStr.slice(0, (-1 * separator.length) - 1);
}
// Returns a String list of recommended counters for the given Pokemon
const getInfo = (data, message) => {
    let pokemonName = message.content.split(' ').slice(-1)[0].toLowerCase();
    pokemonName = CONSTANTS.standardizePokemonName(pokemonName);
    let pokemon = pokemonInfo[pokemonName];
    console.log(pokemonInfo);
    
    var reply = "```";
    reply += pokemonName + "\n";
    reply += "TYPE(S): " + pokemon['types'][0] + "\n";
    if (pokemon['types'].length > 1) {
        reply += "         " + pokemon['types'][1] + '\n';
    }
    reply += '\n';
    reply += "STATS:   Attack: " + pokemon['stats']['attack'];
    reply += "        Defense: " + pokemon['stats']['defense'];
    reply += "        Stamina: " + pokemon['stats']['stamina'];
    reply += '\n';
    reply += "MOVES:     FAST: " + pokemon['moves']['fast'][0];
    if (pokemon['moves']['fast'].length > 1) {
        reply += "         " + pokemon['moves']['fast'][1] + '\n';
    }
    reply += '\n';
    reply += "         CHARGE: " + pokemon['moves']['charge'][0];
    reply += "                 " + pokemon['moves']['charge'][1];
    if (pokemon['moves']['charge'].length > 2) {
        reply += "         " + pokemon['moves']['charge'][2] + '\n';
    }

    message.channel.send(reply);
    return reply;
};

module.exports = (data) => ( (message) => {
    return getInfo(data, message);
});
