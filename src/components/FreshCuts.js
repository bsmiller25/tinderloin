import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'

import TinderCard from 'react-tinder-card'
import ReactModal from 'react-modal';

import FreshCut from '../data/FreshCut'

function FreshCuts () {
  const [swipeFeedback, setSwipeFeedback] = useState()
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
              cuts.push(new FreshCut(uuid, u.username, u.firstname, u.photo, u.age, u.city, u.company, u.bio));
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
    setShowExpanded(true);
    setProfID(char.id)
  }

  return (
    <div>
      <div className="cardContainer">
        <p>Mmm, fresh cuts just for you.</p>
        {freshCuts.length != 0 && freshCuts.map((freshCut) =>
          <TinderCard className="swipe" key={freshCut.username} onSwipe={
            (dir) => swiped(dir, freshCut.firstname)} onCardLeftScreen={() => outOfFrame(freshCut.username)}>
              <div style={{ backgroundImage: "url('" + freshCut.photo + "')" }} className="card">
                <h3>{freshCut.username}</h3>
                <h4 onClick={() => clickMore(freshCut)}>See more</h4>
                <ReactModal
                  className="Modal"
                  overlayClassName="Overlay"
                  isOpen={showExpanded && profID==freshCut.uuid}
                  contentLabel="example"
                >
                  <img className="photo" src={freshCut.photo}/>
                  <h2 className="Modal-h2">{freshCut.username}, {freshCut.age}</h2>
                  <h3>City: {freshCut.city}</h3>
                  <h3>Favorite Meat: {freshCut.cut}</h3>
                  <button onClick={() => setShowExpanded(false)}>Close</button>
                </ReactModal>
              </div>
          </TinderCard>
        )}
      </div>
      <br/>
      {swipeFeedback && <h2 className='infoText'>{swipeFeedback}</h2>}
    </div>
  )
}

export default FreshCuts
