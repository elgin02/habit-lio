import { useState, useEffect } from "react";
import OnboardingPopup from "./OnboardingPopup.jsx";
// import "../App.css";


function Onboarding(props) {
    // const [showPopup, setShowPopup] = useState(false);
    console.log("props: ", props);

    return(
        <div>
            <OnboardingPopup props={props}/>
        </div>
    )
}

export default Onboarding;