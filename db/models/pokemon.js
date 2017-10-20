const mongoose = require('mongoose')

const PokemonSchema = new mongoose.Schema({
  id: { type: Number, index: { unique: true } },
  pokemon: { type: String, required: true, uppercase: true },
  types: [],
  stats: {
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    stamina: { type: Number, required: true }
  },
  moves: {
    fast: [],
    charge: []
  }
})

export const Pokemon = mongoose.model('Pokemon', PokemonSchema)