import { useState, useEffect } from "react";

// import "../App.css";
import "../css/Onboarding.css";

function Page1({currentPage, setCurrentPage}){
    const [pageName, setPageName] = useState("Page1");
    console.log("current page should be 1: ", currentPage !== pageName);
    return(
        <div hidden = {currentPage !== pageName}>
        <div className = "onboarding-content">
            <h1>HEY! I HAVEN'T SEEN YOU BEFORE!</h1>
            <p>You must be new here.</p>
            <p>Welcome to habit.lio! This is an 
                habit-tracking chrome extension that is designed 
                to integrate seamlessly with your browsing experience!</p>
            <br />
            <p> Let’s get habit.lio personalized for you.</p>
            <button className="continue-btn" onClick={() => setCurrentPage("Page2")} >Continue</button>
            </div>
        </div>
    )
}

function Page2({currentPage, setCurrentPage}){
    const [pageName, setPageName] = useState("Page2");
    console.log("current page should be 2: ", currentPage !== pageName);
    return(
        <div hidden = {currentPage !== pageName}>
        <div className = "onboarding-content">
            <h1>Who are you?</h1>
            <p>Let us know a bit about yourself to personalize your experience.</p>
            <button className="continue-btn" 
            onClick={() => setCurrentPage("Page3")} >Continue</button>
        </div>
        </div>
    )
}

function OnboardingPopup(props) {
    const [showPopup, setShowPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState("Page1");
    // console.log("props in onboarding popup: ", props);
    // console.log("props.hidden: ", props.props.hidden);

    return(
        <div>
            <div id="onboarding-container" style={
                {display: props.props.hidden ? "none" : "block"}}>
                <div id="onboarding">
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <div id="dots-container">
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page1" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page2" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page3" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page4" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page5" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page6" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                        </div>
                    </div>
                    < Page1 currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    < Page2 currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
            </div>
        </div>
    );
}

export default OnboardingPopup;