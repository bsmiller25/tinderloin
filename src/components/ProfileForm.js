import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

function ProfileForm() {
  const { register, handleSubmit } = useForm();

  const [userProfile, setUserProfile] = useState(undefined);

  useEffect(() => {
    // early return if we've already fetched user profile, otherwise we'll create an infinite loop
    if (userProfile != undefined) return;

    firebase.database().ref("users").once("value", function(snapshot) {
        var user = snapshot.toJSON();
        console.log("Fetched the following user profile: " + JSON.stringify(user));
        setUserProfile(user);
    });
})

  const onSubmit = formData => {
      console.log(formData);
      writeProfileToFirebase(formData);
  };

  function writeProfileToFirebase(formData) {
    firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
      username: formData.username,
      city: formData.city,
      state: formData.state,
      profession: formData.profession,
      bio: formData.bio,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label htmlFor="username">Username</label>
            <input name="username" placeholder="charcuteriebabe91" ref={register} />
        </div>

        <div>
            <label htmlFor="city">City</label>
            <input name="city" placeholder="Washington" ref={register} />
        </div>

        <div>
            <label htmlFor="state">State</label>
            <input name="state" placeholder="DC" ref={register} />
        </div>

        <div>
            <label htmlFor="profession">Profession</label>
            <input name="profession" placeholder="What would you say you do around here?" ref={register} />
        </div>

        <div>
            <label htmlFor="bio">Bio</label>
            <input name="bio" placeholder="Tell us a little about yourself" ref={register} />
        </div>

        <button type="submit">Submit</button>
    </form>
  );
}

export default ProfileForm