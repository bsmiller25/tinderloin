import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'

import FreshCuts from './FreshCuts'
import Profile from './Profile'
import SliceKnife from './SliceKnife'
import ProfileIcon from './ProfileIcon'

function ButcherShop () {
  const [freshCutsActive, setFreshCutsActive] = useState(true)

  
  return (
    <div>
      
      { freshCutsActive ? <FreshCuts /> : <Profile />}
      <br/>
      <div className="menubar">
        <div className="leftMenu" onClick={() => setFreshCutsActive(true) }><SliceKnife active={freshCutsActive} /></div>
	<div className="rightMenu" onClick={() => setFreshCutsActive(false) }><ProfileIcon active={!freshCutsActive}/></div>
      </div>
    </div>
  )
}

export default ButcherShop
