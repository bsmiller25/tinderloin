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
    <form onSubmit={handleSubmit(onSubmit)} className="profileForm">
        <div className="profileFormGroup">
            <label htmlFor="username" className="profileFormLabel">Username</label>
            <input name="username" placeholder="charcuteriebabe91" ref={register} className="profileFormInput" />
        </div>

        <div className="profileFormGroup">
            <label htmlFor="city" className="profileFormLabel">City</label>
            <input name="city" placeholder="Washington" ref={register} className="profileFormInput" />
        </div>

        <div className="profileFormGroup">
            <label htmlFor="state" className="profileFormLabel">State</label>
            <input name="state" placeholder="DC" ref={register} className="profileFormInput" />
        </div>

        <div className="profileFormGroup">
            <label htmlFor="cut" className="profileFormLabel">Favorite cut of meat</label>
            <input name="cut" placeholder="Ribeye" ref={register} className="profileFormInput" />
        </div>

        <div className="profileFormGroup">
            <label htmlFor="bio" className="profileFormLabel">Bio</label>
            <textarea name="bio" placeholder="Tell us a little about yourself" ref={register} className="profileFormInput" />
        </div>

        <button type="submit" className="formButton">Submit</button>
    </form>
  );
}

export default ProfileForm