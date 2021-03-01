import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'

import TinderCard from 'react-tinder-card'

import FreshCut from '../data/FreshCut'

function FreshCuts () {
  const [swipeFeedback, setSwipeFeedback] = useState("Mmm, fresh cuts just for you.")
  const [freshCuts, setFreshCuts] = useState([])

  useEffect(() => {
    // early return if we've already fetched fresh cuts, otherwise we'll create an infinite loop
    if (freshCuts.length != 0) return;

    var cuts = [];
    firebase.database().ref("users").orderByKey().on("value", function(snapshot) {
      var users = snapshot.toJSON();
      for (var uuid in users) {
        var u = users[uuid];
        cuts.push(new FreshCut(uuid, u.username, u.firstname, u.photo, u.city, u.age, u.cut, u.bio));
      }
      console.log("Fetched the following users: " + JSON.stringify(cuts));
      setFreshCuts(cuts);
    });
  })

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    var feedback = direction == 'down' || direction == "left" ? "Hard pass on " + nameToDelete + "." : nameToDelete + " was yummy.";
    setSwipeFeedback(feedback);
  }

  const outOfFrame = (index) => {
    if (index === 0)
    {
      setTimeout(() => setSwipeFeedback("Still hungry? Come back later."), 1000);
    }
    else
    {
      setTimeout(() => setSwipeFeedback(" "), 500);
    }
  }

  return (
    <div>
      <div className="board">
        {swipeFeedback && <h2 className='infoText'>{swipeFeedback}</h2>}

        {freshCuts.length != 0 && freshCuts.map((freshCut, index) =>
          <TinderCard className="swipe" key={freshCut.username} onSwipe={
            (dir) => swiped(dir, freshCut.firstname)} onCardLeftScreen={() => outOfFrame(index)}>
              <div className="card">
                <h2 className="cardHeader">{freshCut.firstname}, {freshCut.age}</h2>
                <div style={{ backgroundImage: "url('" + freshCut.photo + "')" }}  className="card-img"> 
                </div>
                <p className="cardDescription">📍 {freshCut.city}<br/>🍖 {freshCut.cut}<br/>❤️ {freshCut.bio}</p>
              </div>
          </TinderCard>
        )}
      </div>
    </div>
  )
}

export default FreshCuts
