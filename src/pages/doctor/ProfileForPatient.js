import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useParams, useHistory } from "react-router-dom";
import { onError } from "../../libs/errorLib";
import PatientProfileForm from "../../components/PatientProfileForm";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";


export default function Settings() {
  
  const { userPoolUserId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

   
    useEffect(() => {
      async function onLoad() {
        try {
          let userAttributes = await API.get("patient-records", `/patients/profile/${userPoolUserId}`);
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

    attributes
      .filter(attr => ["name", "birthdate", "gender", "email", "address", "phone_number"].includes(attr.Name))
      .forEach(attr => profile[attr.Name] = attr.Value);
    console.log(profile);
    return profile;
  }


  async function saveProfile(profile) {
    return API.put("patient-records", `/patients/profile/${userPoolUserId}`, {
        body: profile
      });    
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
        {!isLoading && 
          <div>
            <Link to={`/patients/records/${userPoolUserId}`}>
              <Button
                block
                bsSize="large"
                
              >
                See Appointment Records for this patient
              </Button>  
            </Link>
            <PatientProfileForm isLoading={isLoading} onSubmit={handleFormSubmit} profile={profile} />
            <hr class="my-4"></hr>    
        </div>
        }   
    </div>
  );
}
