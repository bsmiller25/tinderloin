import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

function ProfileForm() {
    const { register, handleSubmit } = useForm();

    const [userProfile, setUserProfile] = useState();
    const [submitStatus, setSubmitStatus] = useState(false);

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
        setSubmitStatus(true);
        writeProfileToFirebase(formData);
    };

    function writeProfileToFirebase(formData) {
        firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
            firstname: firebase.auth().currentUser.displayName.split(" ")[0],
            photo: formData.photo === "" ? firebase.auth().currentUser.photoURL : formData.photo,
            city: formData.city,
            age: formData.age,
            cut: formData.cut,
            bio: formData.bio,
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="profileForm">
            <h2>{firebase.auth().currentUser.displayName.split(" ")[0]}'s Profile</h2>
            {submitStatus && <h3>Profile updated!</h3>}
            <div className="profileFormGroup">
                <label htmlFor="photo" className="profileFormLabel">Link to profile pic</label>
                <input name="photo" placeholder="Leave this blank to use your Google pic" defaultValue={userProfile ? userProfile.photo : ""}
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
                    ref={register} className="profileFormInput" maxLength="30" />
            </div>

            <div className="profileFormGroup">
                <label htmlFor="bio" className="profileFormLabel">Conversation starter</label>
                <textarea name="bio" placeholder="What gives you the meat sweats?" defaultValue={userProfile ? userProfile.bio : ""}
                    ref={register} className="profileFormInput" maxLength="30" />
            </div>

            <button type="submit" className="formButton">Submit</button>
        </form>
    );
}

export default ProfileForm