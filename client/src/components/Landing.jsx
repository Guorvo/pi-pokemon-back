import React from "react";
import { Link } from "react-router-dom";


class Landing extends React.Component{
  // constructor(props){
  //   super(props)
  // }

  render(){
    return(
      <>
        <h2>Esto es un landing page</h2>
        <Link to="/pokemon"><button>Entrar al PokemonList</button></Link>
        
      </>
    )
  }
}

export default Landing