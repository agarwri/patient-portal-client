import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import { onError } from "../../libs/errorLib";
import PatientProfileForm from "../../components/PatientProfileForm";


export default function Settings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

   
    useEffect(() => {
      async function onLoad() {
        try {
          await Auth.currentSession();
          let user =  await Auth.currentAuthenticatedUser();
          setUser(user);
          let userAttributes = await Auth.userAttributes(user);
          console.log(userAttributes);
          setProfile(translateAttributesintoProfile(userAttributes));
        }
        catch(e) {
          onError(e);
        }
        setIsLoading(false);
      }
      onLoad();
    }, []);
  
    

  function translateAttributesintoProfile(attributes) {
    const profile = {};
    console.log(attributes);

    attributes
      .filter(attr => ["name", "birthdate", "gender", "email", "address", "phone_number"].includes(attr.Name))
      .forEach(attr => profile[attr.Name] = attr.Value);
    console.log(profile);
    return profile;
  }


  async function saveProfile(profile) {
      try {
        await Auth.updateUserAttributes(user, profile);
      }
      catch(e) {
        onError(e); 
      }    
  }


  async function handleFormSubmit(profile, error) {
    if (error) {
      onError(error);
      return;
    }
    setIsLoading(true);
    try {
      await saveProfile(profile);
      alert("Your profile has been saved successfully");
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="MyProfile">
        {!isLoading && <PatientProfileForm isLoading={isLoading} onSubmit={handleFormSubmit} profile={profile} />}
    </div>
  );
}
