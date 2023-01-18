const express = require('express')
const router = express.Router()
const {} = require ('../db.js')
const { gottaCatchEmAll, gottaFindPkmn, createPkmn } = require('./utils')
const defaultPokeball = 'https://images.wikidexcdn.net/mwuploads/wikidex/0/02/latest/20090125150654/Pok%C3%A9_Ball_%28Ilustraci%C3%B3n%29.png'

// I get the pokemons from the gottaCatchEmAll function and return it, if name is on query we return a search by number
router.get('/', async(req,res) => {
  try {
    const {name} = req.query
    if (name) {
      const findPkmn = await gottaFindPkmn(name)
      res.status(200).json(findPkmn)
    } else {
      const arrPkmn = await gottaCatchEmAll()
      res.status(200).json(arrPkmn)
    }
  } catch (error) {
    res.status(404).send(`Could not find pokemons.`)
  }
})

// I get the requested id by parameters and check if its available, then we run the gottaFindPkmn function and return the value
router.get('/:id', async(req,res) => {
  try {
    const {id} = req.params

    if (id) {
      const foundPokemon = await gottaFindPkmn(id)
      res.status(200).json(foundPokemon)
    } else {
      res.status(404).send("Could not find id from params.");
    }
  } catch (error) {
    res.status(404).send(`GET /POKEMON/:ID ${error}`)
  }
})

// I get the parameters already formatted from json and put them on the createPkmn function, then wait for an error or a success
router.post('/', async(req,res) => {
  try {
    const {
      name, hp, attack, defense, speed, height, weight, image, types
    } = req.body
    let imageUrl = image ? image : defaultPokeball
    await createPkmn(name, hp, attack, defense, speed, height, weight, imageUrl , types) 
    ? res.status(201).send('The pokemon was created') 
    : res.status(404).send('Error while creating the pokemon')
  } catch (error) {
    res.status(404).send(`POST /POKEMON Error: ${error}`)
  }
})

module.exports = router