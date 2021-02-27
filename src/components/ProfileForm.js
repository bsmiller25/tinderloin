import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

function ProfileForm() {
    const { register, handleSubmit } = useForm();

    const [userProfile, setUserProfile] = useState();

    useEffect(() => {
        // early return if we've already fetched user profile, otherwise we'll create an infinite loop
        if (userProfile != undefined) return;

        firebase.database().ref("/users/" + firebase.auth().currentUser.uid).once("value", function(snapshot) {
            var user = snapshot.toJSON();
            setUserProfile(user);
            console.log("Fetched the following user profile: " + JSON.stringify(user));
        });
    })

    const onSubmit = formData => {
        console.log(formData);
        writeProfileToFirebase(formData);
    };

    function writeProfileToFirebase(formData) {
        firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
            username: formData.username,
            firstname: firebase.auth().currentUser.displayName.split(" ")[0],
            photo: firebase.auth().currentUser.photoURL,
            city: formData.city,
            age: formData.age,
            cut: formData.cut,
            bio: formData.bio,
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="profileForm">
            <h2>{firebase.auth().currentUser.displayName.split(" ")[0]}'s Profile</h2>
            <div className="profileFormGroup">
                <label htmlFor="username" className="profileFormLabel">Username</label>
                <input name="username" placeholder="e.g. charcuteriebabe91" defaultValue={userProfile ? userProfile.username : ""}
                    ref={register} className="profileFormInput" />
            </div>

            <div className="profileFormGroup">
                <label htmlFor="age" className="profileFormLabel">Age</label>
                <input name="age" defaultValue={userProfile ? userProfile.age : ""} ref={register} className="profileFormInput" />
            </div>

            <div className="profileFormGroup">
                <label htmlFor="city" className="profileFormLabel">City</label>
                <input name="city" defaultValue={userProfile ? userProfile.city : ""} ref={register} className="profileFormInput" />
            </div>

            <div className="profileFormGroup">
                <label htmlFor="cut" className="profileFormLabel">Favorite cut of meat</label>
                <input name="cut" placeholder="e.g. Ribeye" defaultValue={userProfile ? userProfile.cut : ""}
                    ref={register} className="profileFormInput" />
            </div>

            <div className="profileFormGroup">
                <label htmlFor="bio" className="profileFormLabel">Bio</label>
                <textarea name="bio" placeholder="Tell us a little about yourself..." defaultValue={userProfile ? userProfile.bio : ""}
                    ref={register} className="profileFormInput" />
            </div>

            <button type="submit" className="formButton">Submit</button>
        </form>
    );
}

export default ProfileForm