import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getTypes } from "../redux/actions";


// https://stackoverflow.com/questions/6454198/check-if-a-value-is-within-a-range-of-numbers
function between(x, min, max) {
  return x >= min && x <= max;
}

// https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

const CreatePokemon = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState({
    name: "",
    image: "",
    hp: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    height: 0,
    weight: 0,
    type: [],
    errors: {}
  })

  useEffect(() => {
    dispatch(getTypes()) // eslint-disable-next-line
  }, [])

  const types = useSelector((state) => state.types)
  
  const changeHandler = (event) => {
    const property = event.target.name
    const value = event.target.value
    
    setInput({
      ...input,
      [property]: value,
      errors: validate(property, value, input.errors)
    })
  }

  const submitHandler = (event) => {
    event.preventDefault()
  }

  const validate = (property, value, errors) => {
    switch (property){
      case "name":
        errors[property] = value.length === 0 ?  "Name is required" : ""
        break
      case "image":
        errors[property] = value !== "" && !validateUrl(value) ? "Must be blank or a valid url" : ""
        break
      case "hp":
        errors[property] = !between(value, 0, 255) ? "HP must be between 0 and 255" : ""
        break
      case "attack":
        errors[property] = !between(value, 0, 255) ? "ATTACK must be between 0 and 255" : ""
        break
      case "defense":
        errors[property] = !between(value, 0, 255) ? "DEFENSE must be between 0 and 255" : ""
        break
      case "speed":
        errors[property] =!between(value, 0, 255) ? "SPEED must be between 0 and 255" : ""
        break
      case "height":
        errors[property] = value <= 0 ? "Height is calculated in decimetres." : ""
        break
      case "weight":
        errors[property] =  value <= 0 ? "Weight is calculated in hectograms" : ""
        break
      case "type":
        // https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
        let type = (value.split('-')).filter((t) => types.find(dbT => dbT.name === t))
        errors[property] =  !between(type.length,1,2) ? "Must be a type and not more that 2 and less than 0" : ""
        break
      default:
        throw new Error(`There's no property called ${property}`)
    }
    return errors
  }
    // if (input.name.length === 0) errors.name = "Name is required"
    // if (input.image !== "" && !validateUrl(input.image)) errors.image = "Must be blank or a valid url"
    // if (!between(input.hp, 0, 255)) errors.hp = "HP must be between 0 and 255"
    // if (!between(input.attack, 0, 255)) errors.attack = "ATTACK must be between 0 and 255"
    // if (!between(input.defense, 0, 255)) errors.defense = "DEFENSE must be between 0 and 255"
    // if (!between(input.speed, 0, 255)) errors.speed = "SPEED must be between 0 and 255"
    // if (input.height <= 0) errors.height = "Height is calculated in decimetres."
    // if (input.weight <= 0) errors.weight = "Weight is calculated in hectograms"
    // if (!between(input.type.length,1,2)) errors.type = "Must be a type and not more that 2 and less than 0"
  //   return errors
  // }
  console.log(input)
  console.log(Object.keys(input.errors))
  console.log(Object.keys(input.errors).length !== 9)

  return (
    <>
      {
        Object.keys(input.errors).every((err) => err !== "") 
        ? Object.keys(input.errors).map(err => <p key={`error-${err}`}>{input.errors[err]}</p>) 
        : null
      }
      <form onSubmit={submitHandler}>

        <div>
          <label htmlFor="name">NAME:</label>
          <input
            type="text"
            name="name"
            placeholder="Bulbasur"
            value={input.name}
            onChange={changeHandler} />
        </div>

        <div>
          <label htmlFor="hp">IMAGE:</label>
          <input
            type="text"
            name="image"
            placeholder="URL containing an image, or blank"
            value={input.image}
            onChange={changeHandler} />
        </div>

        <div>
          <label htmlFor="type">TYPES:</label>
          <input
            type="text"
            name="type"
            placeholder="plant-poison, plant"
            value={input.type}
            onChange={changeHandler}
          />
        </div>

        <div>
          <label htmlFor="hp">HP:</label>
          <input
            type="number"
            name="hp"
            value={input.hp}
            onChange={changeHandler} />
        </div>

        <div>
          <label htmlFor="attack">ATTACK:</label>
          <input
            type="number"
            name="attack"
            value={input.attack}
            onChange={changeHandler} />
        </div>

        <div>
          <label htmlFor="defense">DEFENSE:</label>
          <input
            type="number"
            name="defense"
            value={input.defense}
            onChange={changeHandler} />
        </div>

        <div>
          <label htmlFor="speed">SPEED:</label>
          <input
            type="number"
            name="speed"
            value={input.speed}
            onChange={changeHandler} />
        </div>

        <div>
          <label htmlFor="height">HEIGHT:</label>
          <input
            type="number"
            name="height"
            value={input.height}
            onChange={changeHandler} />
        </div>

        <div>
          <label htmlFor="weight">WEIGHT:</label>
          <input
            type="number"
            name="weight"
            value={input.weight}
            onChange={changeHandler} />
        </div>

        <button 
          disabled={Object.keys(input.errors).every((err) => input.errors[err] !== "") || Object.keys(input.errors).length !== 9} 
          type="submit">SUBMIT</button>
      </form>
    </>
  )
}

export default CreatePokemon