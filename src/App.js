import React, { useState } from 'react'
import './App.css'
import Icon from './components/Icon'
import Logo from './components/Logo'
import SignInScreen from './components/SignInScreen'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showexpanded: false
    };
  }

  render() {
    return (
      <div className='app'>
	<br />
        <div style={{display: 'inline-block'}}>
	  <Icon />
          <Logo />
	</div>
        <br />
        <SignInScreen />
      </div>
    )
  }
}

export default App
