// This is the background script for the Habitlio Chrome Extension.
// It can be used to listen for events, manage state, or perform tasks that need to run in the background.

console.log("Habitlio background script loaded.");
// Open up side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  chrome.sidePanel.open({ tabId: tab.id });
});

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