import React, {Component} from 'react'
// import {Helmet} from 'react-helmet'
import Game from './game/component'
// import logo from './logo.svg'
import './App.css'
const title = 'Chess'

class App extends Component {
  render(){
    document.title = title
    return (
      <div className="App">
        {/*<Helmet>
          <title>{title}</title>
        </Helmet>*/}
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <Game/>
      </div>
    )
  }
}

export default App;
