import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'

import TinderCard from 'react-tinder-card'
import ReactModal from 'react-modal';

import FreshCut from '../data/FreshCut'

function FreshCuts () {
  const [swipeFeedback, setSwipeFeedback] = useState("Mmm, fresh cuts just for you.")
  const [freshCuts, setFreshCuts] = useState([])
  const [showExpanded, setShowExpanded] = useState(false);
  const [profID, setProfID] = useState(0);

  useEffect(() => {
    // early return if we've already fetched fresh cuts, otherwise we'll create an infinite loop
    if (freshCuts.length != 0) return;

    var cuts = [];
    firebase.database().ref("users").orderByKey().on("value", function(snapshot) {
      var users = snapshot.toJSON();
      for (var uuid in users) {
        var u = users[uuid];
        cuts.push(new FreshCut(uuid, u.username, u.firstname, u.photo, u.city, u.age,  u.company, u.bio));
      }
      console.log("Fetched the following users: " + JSON.stringify(cuts));
      setFreshCuts(cuts);
    });
  })

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    var feedback = direction == 'down' || direction == "left" ? "Hard no on " + nameToDelete : nameToDelete + " is pretty tasty!";
    setSwipeFeedback(feedback);
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  function clickMore(char){
    console.log('here')
    setShowExpanded(true);
    setProfID(char.id)
  }

  return (
    <div>
      <div className="board">
	{swipeFeedback && <h2 className='infoText'>{swipeFeedback}</h2>}
	
	{freshCuts.length != 0 && freshCuts.map((freshCut) =>
	  <TinderCard className="swipe" key={freshCut.username} onSwipe={
	  (dir) => swiped(dir, freshCut.firstname)} onCardLeftScreen={() => outOfFrame(freshCut.username)}>
            <div className="card">
	      <h2>{freshCut.username}, {freshCut.age}</h2>
	      <div style={{ backgroundImage: "url('" + freshCut.photo + "')" }}  className="card-img"> 
	      </div>
	      <p>City: {freshCut.city}</p>
            </div>
	  </TinderCard>
	)}
      </div>
    </div>
  )
}

export default FreshCuts
