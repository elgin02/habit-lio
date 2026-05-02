// This is the background script for the Habitlio Chrome Extension.
// It can be used to listen for events, manage state, or perform tasks that need to run in the background.

let isPopupOpen = false;

console.log("Habitlio background script loaded.");
// Open up side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  chrome.sidePanel.open({ tabId: tab.id });
});

// Listen for if popup is closed or opened
chrome.runtime.onConnect.addListener((port) => {
  console.log("Port connected:", port.name);
  if (port.name === "popup") {
    isPopupOpen = true;
    console.log("Popup connected, isPopupOpen set to true");
    port.onDisconnect.addListener(() => {
      isPopupOpen = false;
      console.log("Popup disconnected, isPopupOpen set to false");
    });
  }
});

const showNotification = setInterval(() => {
  if (!isPopupOpen) {
    console.log("Popup is closed, showing notification");
    var randIndex = Math.floor(Math.random() * 3);
    if (randIndex === 0) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
        title: "Habit.lio",
        message: "Check in on your habits and keep up the good work!",
        priority: 1
      });
    } else if (randIndex === 1) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
        title: "Habit.lio",
        message: "Every step counts. Stay consistent with your habits!",
        priority: 1
      });
    } else {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
        title: "Habit.lio",
        message: "Remember, progress is progress no matter how small. Keep it up!",
        priority: 1
      });
    }
  }
}, 3600000); // Send notification every hour to encourage user to open habit tracker



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "notify") {
    let title = "Habit.lio";
    let icon = chrome.runtime.getURL("icons/Habitlio-Icon48.png");

    if (message.reason === "habitCreation") {
      console.log("Received habit creation message:", message); // Debugging line to check the message content
      // Show a notification when a habit is created successfully
      const chosenTitle = ["Congratulations🔥", "What a Beast🤩🤩", "Congrats😎"];
      title = chosenTitle[Math.floor(Math.random() * chosenTitle.length)];
      icon = chrome.runtime.getURL("icons/Habitlio-Icon128.png");
    }

    chrome.notifications.create({
      type: "basic",
      iconUrl: icon,
      title: title,
      message: message.message,
      priority: 1
    });

    sendResponse({ status: "success" });
    return true;
  }
});

// reminder listener
chrome.alarms.onAlarm.addListener((alarm) => {
  // console.log("Alarm received:", alarm.name);
  const name = alarm.name.split("|")[2]; // Extract habit name from the combined string
  const message = alarm.name.split("|")[1]; // Extract custom message from the combined string
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
    title: "Habit Reminder!",
    message: message === "" 
    ? `Time to work on: ${name}` : `Time to work on: ${name} \n${message}`, // I am unsure how to use the custom message here on reminder creation
    priority: 2
  });
});
