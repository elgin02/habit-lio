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
      var randIndex = Math.floor(Math.random() * 3);

      // const [hours, minutes] = habit.reminder.time.split(":");
      const alarmTime = new Date();
      // alarmTime.setHours(parseInt(alarmTime.getHours()), parseInt(alarmTime.getMinutes()), 0, 0);

      if (randIndex === 0) {
        const message = "Don't forget to check in on your habits today! Consistency is key to success.";
        const stringifyName =
          randIndex + "|" + message + "|" + "Habit.lio misses you!" + "|" + "Random"; // Combine message and habit name for later use
        // Schedule repeating alarm every 24 hours
        // Switch back to createdHabit.name if it doesn't work
        chrome.alarms.create(stringifyName, {
          when: alarmTime.getTime() + 240 * 60 * 1000, // Schedule for 2 minutes later for testing purposes
          periodInMinutes: 240, // 4 hours  // 24 hours // 1440 minutes in a day
        });
      // chrome.notifications.create({
      //   type: "basic",
      //   iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
      //   title: "Habit.lio",
      //   message: "Check in on your habits and keep up the good work!",
      //   priority: 1
      // });
    } else if (randIndex === 1) {
        const message = "Every step counts. Stay consistent with your habits!";
        const stringifyName =
          randIndex + "|" + message + "|" + "Missed call from Habit.lio🗣️🗣️" + "|" + "Random"; // Combine message and habit name for later use
        // Schedule repeating alarm every 24 hours
        // Switch back to createdHabit.name if it doesn't work
        chrome.alarms.create(stringifyName, {
          when: alarmTime.getTime() + 240 * 60 * 1000, // Schedule for 2 minutes later for testing purposes
          periodInMinutes: 240, // 24 hours // 1440 minutes in a day
        });
        // chrome.notifications.create({
        //   type: "basic",
        //   iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
        //   title: "Habit.lio",
        //   message: "Every step counts. Stay consistent with your habits!",
        //   priority: 1
        // });
    } else {
        const message = "Remember, progress is progress no matter how small. Keep it up!";
        const stringifyName =
          randIndex + "|" + message + "|" + "YO! Check in with Habit.lio." + "|" + "Random"; // Combine message and habit name for later use
        // Schedule repeating alarm every 24 hours
        // Switch back to createdHabit.name if it doesn't work
        chrome.alarms.create(stringifyName, {
          when: alarmTime.getTime() + 240 * 60 * 1000, // Schedule for 2 minutes later for testing purposes
          periodInMinutes: 240, // 24 hours // 1440 minutes in a day
        });
      // chrome.notifications.create({
      //   type: "basic",
      //   iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
      //   title: "Habit.lio",
      //   message: "Remember, progress is progress no matter how small. Keep it up!",
      //   priority: 1
      // });
  }});
  }
});

/*const showNotification = setInterval(() => {
  if (!isPopupOpen) {
    console.log("Popup is closed, showing notification");
    var randIndex = Math.floor(Math.random() * 3);
    if (randIndex === 0) {
      const message = "Don't forget to check in on your habits today! Consistency is key to success.";
      const stringifyName =
        randIndex + "|" + message + "|" + "Habit.lio misses you!"; // Combine message and habit name for later use
      // Schedule repeating alarm every 24 hours
      // Switch back to createdHabit.name if it doesn't work
      chrome.alarms.create(stringifyName, {
        when: alarmTime.getTime(),
        periodInMinutes: 2, // 24 hours // 1440 minutes in a day
      });
      // chrome.notifications.create({
      //   type: "basic",
      //   iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
      //   title: "Habit.lio",
      //   message: "Check in on your habits and keep up the good work!",
      //   priority: 1
      // });
    } else if (randIndex === 1) {
      const message = "Don't forget to check in on your habits today! Consistency is key to success.";
      const stringifyName =
        randIndex + "|" + message + "|" + "Habit.lio misses you!"; // Combine message and habit name for later use
      // Schedule repeating alarm every 24 hours
      // Switch back to createdHabit.name if it doesn't work
      chrome.alarms.create(stringifyName, {
        when: alarmTime.getTime(),
        periodInMinutes: 2, // 24 hours // 1440 minutes in a day
      });
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
}, 3600000);*/ // Send notification every hour to encourage user to open habit tracker



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
  const checkRandom = alarm.name.split("|")[3]; // Check if it's a random notification
  // console.log("Alarm details - Name:", name, "Message:", message, "CheckRandom:", checkRandom); // Debugging line to check the extracted values
  if (checkRandom === "Random") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
      title: name,
      message: message, 
      priority: 2
    });
  } else {
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/Habitlio-Icon48.png"),
      title: "Habit Reminder!",
      message: message === "" 
      ? `Time to work on: ${name}` : `Time to work on: ${name} \n${message}`, // I am unsure how to use the custom message here on reminder creation
      priority: 2
    });
  }
});
