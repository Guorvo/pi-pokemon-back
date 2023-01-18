const axios = require('axios')
const { Pokemon, Type } = require('../db.js')

// okay, i might have done a mess so i'll try to be as concise as possible, 
//  some lines of code should be a separate function but im out of time and i really cant think no more
// im truly sorry

// I get a call from the API (pretty cool!, should check it later) 
// this call by default returns the 20 first pokemon, so i add another call using the next value 
// so i get the 40 requested values the readme required, then we return the specifed data
async function gottaCatchAPI() {
  try {
    const firstCall = (await axios.get(`https://pokeapi.co/api/v2/pokemon`))['data']
    const secondCall = (await axios.get(firstCall['next']))['data']['results']
    const pokemonCalls = [...firstCall['results'], ...secondCall]
    const apiCalls = await Promise.all(pokemonCalls.map(async (pkmn) => {
      const pkmnData = (await axios.get(pkmn['url']))['data']
      return {
        id: pkmnData['id'],
        name: pkmnData['name'],
        hp: pkmnData['stats'][0]['base_stat'],
        attack: pkmnData['stats'][1]['base_stat'],
        defense: pkmnData['stats'][2]['base_stat'],
        speed: pkmnData['stats'][5]['base_stat'],
        height: pkmnData['height'],
        weight: pkmnData['weight'],
        image: pkmnData['sprites']['other']['official-artwork']['front_default'],
        types: pkmnData['types'].map((tValue) => tValue.type.name)
      }
    }
    ))
    return apiCalls
  } catch (error) {
    console.log('Error in gottaCatchAPI:', error)
  }
}

// I try to find all the pokemons from my database, including their associations with its typing
// then we return the specifed data
async function gottaCatchDB() {
  try {
    const pokemonsDB = (await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    })).map(x => x.get({ plain: true}))
    const formattedDB = pokemonsDB.map(pkmn => {
      return {
        id: pkmn['id'],
        name: pkmn['name'],
        hp: pkmn['hp'],
        attack: pkmn['attack'],
        defense: pkmn['defense'],
        speed: pkmn['speed'],
        height: pkmn['height'],
        weight: pkmn['weight'],
        image: pkmn['image'],
        types: pkmn['types'].map((tValue) => tValue['name']),
        dbContent: pkmn['dbContent']}
    })
    return formattedDB
  } catch (error) {
    console.log('Error in gottaCatchDB:', error)
  }
}

// We use the previous functions to get the API/DB calls and add them together in an array, then we return it
async function gottaCatchEmAll() {
  try {
    const pkmnAPI = await gottaCatchAPI()
    const pkmnDB = await gottaCatchDB()
    const pkmns = [...pkmnAPI, ...pkmnDB]
    return pkmns
  } catch (error) {
    console.log('Error en gottaCatchEmAll:', error)
  }
}

// I use the API pokemon finding call to find a pokemon, either by its name or id, so pretty straight foward
// then if the call returns an error we try to find it by our database, testing the UUID value
// if it's an UUID we request an id with the same value, if it's not we try the request from name
// I know the return data filtering is on there twice, i had some problems trying to save the call in a variable
// and many errors popped up that i couldnt understand so i winged it.
async function gottaFindPkmn(value) {
  return axios.get(`https://pokeapi.co/api/v2/pokemon/${value}`).then(pokemon => {
    return {
      id: pokemon['data']['id'],
      name: pokemon['data']['name'],
      hp: pokemon['data']['stats'][0]['base_stat'],
      attack: pokemon['data']['stats'][1]['base_stat'],
      defense: pokemon['data']['stats'][2]['base_stat'],
      speed: pokemon['data']['stats'][5]['base_stat'],
      height: pokemon['data']['height'],
      weight: pokemon['data']['weight'],
      image: pokemon['data']['sprites']['other']['official-artwork']['front_default'],
      types: pokemon['data']['types'].map((tValue) => tValue.type.name)
    }
  }).catch(async function () {
    const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    if (regex.test(value)) {
      const filterDB = (await Pokemon.findOne({
        where: {
          id: value
        },
        include: {
          model: Type,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        }
      })).get({ plain: true})
      if (filterDB !== null) {
        return {
          id: filterDB['id'],
          name: filterDB['name'],
          hp: filterDB['hp'],
          attack: filterDB['attack'],
          defense: filterDB['defense'],
          speed: filterDB['speed'],
          height: filterDB['height'],
          weight: filterDB['weight'],
          image: filterDB['image'],
          types: filterDB['types'].map((tValue) => tValue['name'])
        }
      }
    } else {
      const filterDB = (await Pokemon.findOne({
        where: {
          name: value
        },
        include: {
          model: Type,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        }
      })).get({ plain: true})
      if (filterDB !== null) {
        return {
          id: filterDB['id'],
          name: filterDB['name'],
          hp: filterDB['hp'],
          attack: filterDB['attack'],
          defense: filterDB['defense'],
          speed: filterDB['speed'],
          height: filterDB['height'],
          weight: filterDB['weight'],
          image: filterDB['image'],
          types: filterDB['types'].map((tValue) => tValue['name'])
        }
      }
    }
    throw new Error(" gottaFindPkmn: No pokemon with provided value.");
  })
}

// First we check if types has been already called (it's needed), and we check if names and types are present
// Then we .create a new Pokemon, add its associations and return true
async function createPkmn(
  name, hp = 1, attack = 1, defense = 1, speed = 1, height = 1, weight = 1, image, types
  ) {
  try {
    if (!await Type.count()) {
      await getTypes()
    }
    
    if (name && types.length) {
      const newPkmn = await Pokemon.create({
        name,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
        image,
      })

      types.map(async x => await newPkmn.addType(x))
      return true
    } else {
      throw new Error('Missing necessary data.')
    }
  } catch (error) {
    console.log('Error in createPkmn:', error)
  }
}

// We check if the Types table has already been filled, if not we call the API for a batch of types
// then we fill the said table with the values we called from the api, the "if" ends
// after that we get all the db values and return it
async function getTypes() {
  try {
    if (!await Type.count()) {
      const apiTypes = (await axios.get('https://pokeapi.co/api/v2/type'))['data']['results']
      await apiTypes.map(async type => await Type.findOrCreate({ where: { name: type['name'] }}))
    }
    const dbTypes = (await Type.findAll({raw: true}))
    return dbTypes
  } catch (error) {
    console.log('Error in getTypes:', error)
  }
}

module.exports = {
  gottaCatchAPI,
  gottaCatchDB,
  gottaCatchEmAll,
  gottaFindPkmn,
  createPkmn,
  getTypes
}

// Im sorry you had to read that :( -G