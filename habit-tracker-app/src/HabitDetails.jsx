import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

import { Pencil } from 'lucide-react';
import EmojiSelect from './habitComponents/EmojiSelect';
import './index.css';
import './HabitDetails.css';
import CalendarEdit from "./habitComponents/calendarEdit";

import {handleSaveHabit, deleteHabit} from "./firestore";

function NameDescription({ habit, updateHabitField }) {
    const [emoji, setEmoji] = useState(habit.emoji || "📝");
    const colorInputRef = useRef(null);

    return (
        <div id="habit-desc">
            <div id="habit-header">
                <div id="emoji-color-container">
                    <div 
                        className="habit-circle"
                        style={{ backgroundColor: habit.color ?? "#b9b7b7" }}
                        onClick={() => colorInputRef.current?.click()}
                    >
                        <div id="habit-emoji" onClick={(e) => e.stopPropagation() } >
                            <EmojiSelect
                                value={habit.emoji}
                                onChange={(e) => updateHabitField("emoji", e)}
                            />
                        </div>
                    </div>
                    <label htmlFor="color-picker">Set Color: </label>
                    <select name="color-picker" id="color-picker"
                    ref={colorInputRef}
                    value={habit.color ?? "#b9b7b7"} 
                    onChange={(e) => updateHabitField("color", e.target.value)}>
                        <option value="#b9b7b7">Default</option>
                        <option value="#f8aaaa">Red</option>
                        <option value="#aaffaa">Green</option>
                        <option value="#aaaaff">Blue</option>
                        <option value="#ffffaa">Yellow</option>
                        <option value="#ffb6c1">Pink</option>
                        <option value="#ffa500">Orange</option>
                        <option value="#800080">Purple</option>
                    </select>
                </div>

                {/* <input
                    ref={colorInputRef}
                    type="color"
                    value={habit.color ?? "#b9b7b7"}
                    onChange={(e) => updateHabitField("color", e.target.value)}
                    style={{ display: "none" }}
                /> */}

                <input
                    type="text"
                    id="habit-name"
                    placeholder="Habit Name"
                    value={habit.name ?? ""}
                    onChange={(e) => updateHabitField("name", e.target.value)}
                />
            </div>

            <div className="line" />

            <textarea
                id="description"
                placeholder="Description"
                value={habit.description ?? ""}
                onChange={(e) => updateHabitField("description", e.target.value)}
            />
        </div>
    );
}

/*
function MilestoneSettings() {
    const [rewardEveryStreak, setRewardEveryStreak] = useState(true);
    const [rewardAfterStreakDays, setRewardAfterStreakDays] = useState(0);

    return (
        <div id="mile-settings">
            <div id="reward">
            <span> Reward after every streak? </span> <input id="reward-check" type="checkbox" checked={rewardEveryStreak}
                                                       onClick={() => {setRewardEveryStreak(!rewardEveryStreak)}}/>
            </div>
            <Line />
            
            <span id="reward-after-day-streaks"> 
                Reward coins after every {" "}
                <input id="number-input" type="number"/>
                {" "}day streaks 
            </span>
        </div>
    )
}
*/
function HabitType({ habit, updateHabitField }) {
    const habitType = habit.type ?? "Build";

    return (
        <div id="habit-type">
            <button
                type="button"
                className="habit-type-option"
                id="build-option"
                onClick={() => updateHabitField("type", "Build")}
                style={{
                    backgroundColor: habitType === "Build" ? "#5B5FB4" : "#b9b7b700",
                    color: habitType === "Build" ? "white" : "rgba(0, 0, 0, 0.25)"
                }}
            >
                Build
            </button>

            <button
                type="button"
                className="habit-type-option"
                id="quit-option"
                onClick={() => updateHabitField("type", "Quit")}
                style={{
                    backgroundColor: habitType === "Quit" ? "#5B5FB4" : "#b9b7b700",
                    color: habitType === "Quit" ? "white" : "rgba(0, 0, 0, 0.25)"
                }}
            >
                Quit
            </button>
        </div>
    );
}

function CheckBoxDay({ name, setDaysSelected, daysSelected, updateGoalField }) {
    // Start checked by default
    const [checked, setChecked] = useState(daysSelected.includes(name));

    const handleToggle = () => {
        const nextCheckedState = !checked;
        setChecked(nextCheckedState);

        if (nextCheckedState) {
            // Logic to ADD to the array (assuming setDaysSelected is an array setter)
            setDaysSelected(prev => [...prev, name]);
            updateGoalField("daysSelected", [...daysSelected, name]);
        } else {
            // Logic to REMOVE from the array
            setDaysSelected(prev => prev.filter(day => day !== name));
            updateGoalField("daysSelected", daysSelected.filter(day => day !== name));
        }
    };

    return (
        <div style={{ fontSize: "14px" }}>
            <input 
                type="checkbox"
                id={name}
                name={name}
                checked={checked}
                // FIXED: Wrapped in an arrow function so it only runs on click
                onChange={() => handleToggle()} 
            />
            <label htmlFor={name}>{name}</label>
        </div>
    );
}

// This component handles the selection of task days 
// based on the selected mode in the goal info section of habit details. 
// It conditionally renders different UI elements for selecting specific days of the week, 
// specific days of the month, or entering a number of days per week/month.
function SelectTaskDays({mode, setClicked, 
    daysSelected, setDaysSelected, setNumOfDays, updateGoalField}) {
    // const [error, showError] = useState(false);
    const isError = daysSelected.length === 0;
    setClicked(mode === "specific_days" && isError);
    // Ensure days selected is refresh.
    // const refreshNeeded = mode === "specific_month_days" && daysSelected.length > 0;
    // setDaysSelected(refreshNeeded ? [] : daysSelected);
    console.log("DAYS:" + daysSelected);
    return(
        <div>
            {mode === "specific_month_days" && (
                <div id="task-days-select">
                    <CalendarEdit daysSelected={daysSelected} 
                    setDaysSelected={setDaysSelected}
                    updateGoalField={updateGoalField}/>
                </div>
            )}
            {mode === "specific_days" && (
                <div>
                    <p id="days-error" 
                    style={{color: "red", fontSize: "14px"}} hidden={!isError}>
                        Error: Please select at least one day.
                    </p>
                    <label htmlFor='specific-days' style={{fontSize: "16px"}}>
                        Choose Day(s) to accomplish the habit: </label>
                    <CheckBoxDay name="Monday" 
                    setDaysSelected={setDaysSelected} 
                    daysSelected={daysSelected} updateGoalField={updateGoalField}/>

                    <CheckBoxDay name="Tuesday" setDaysSelected={setDaysSelected} 
                    daysSelected={daysSelected} updateGoalField={updateGoalField}/>

                    <CheckBoxDay name="Wednesday" setDaysSelected={setDaysSelected} 
                    daysSelected={daysSelected} updateGoalField={updateGoalField}/>

                    <CheckBoxDay name="Thursday" setDaysSelected={setDaysSelected} 
                    daysSelected={daysSelected} updateGoalField={updateGoalField}/>

                    <CheckBoxDay name="Friday" setDaysSelected={setDaysSelected} 
                    daysSelected={daysSelected} updateGoalField={updateGoalField}/>

                    <CheckBoxDay name="Saturday" setDaysSelected={setDaysSelected} 
                    daysSelected={daysSelected} updateGoalField={updateGoalField}/>

                    <CheckBoxDay name="Sunday" setDaysSelected={setDaysSelected} 
                    daysSelected={daysSelected} updateGoalField={updateGoalField}/>
                </div>
            )}
            {mode === "number_days" && (
                <div>
                    <label htmlFor='number-days' style={{fontSize: "16px"}}>
                        Enter the number of days per week you want to accomplish this habit:
                    </label>
                    <input type="number" id="number-days" min="1" max="7" onChange={(e) => setNumOfDays(parseInt(e.target.value) || 1)} />
                </div>
            )}
            {mode === "specific_month_number" && (
                <div>
                    <label htmlFor='number-month-days' style={{fontSize: "16px"}}>
                        Enter the number of days per month you want to accomplish this habit:
                    </label>
                    <input type="number" id="number-month-days" min="1" max="31" onChange={(e) => setNumOfDays(parseInt(e.target.value) || 1)} />
                </div>
            )}
        </div>
    );
}

function GoalInfo({ habit, updateGoalField }) {
    const [clicked, setClicked] = useState(false);
    const [taskDaysSelected, setTaskDaysSelected] 
    = useState(habit.goal?.taskDays ?? "everyday");
    const [daysSelected, setDaysSelected] = useState(habit.goal?.daysSelected ?? []);
    const [numOfDays, setNumOfDays] = useState(habit.goal?.numOfDays ?? 1);

    const firstItem = daysSelected[0];

    // only convert if the dates are timestamps.
    if (firstItem && typeof firstItem === 'object' && 'seconds' in firstItem) {
        const formattedDates = habit.goal?.daysSelected?.map(timestamp => timestamp.toDate());
        setDaysSelected(formattedDates);
    }
    console.log("GOAL INFO HABIT:", habit);
    console.log("GOAL INFO TASK DAYS SELECTED:", taskDaysSelected);
    console.log("GOAL INFO DAYS SELECTED:", daysSelected);
    console.log("GOAL INFO NUM OF DAYS:", numOfDays);
    return (
        <div id="goal-info">
            <div id="goal-period">
                <label>Goal Period:</label>
                <select
                    name="period"
                    id="period"
                    value={habit.goal?.period ?? "Day"}
                    onChange={(e) => updateGoalField("period", e.target.value)}
                >
                    <option value="Day">Daily</option>
                    <option value="Week">Weekly</option>
                    <option value="Month">Monthly</option>
                </select>
            </div>

            <Line />

            <div id="goal-value">
                <span style={{ fontSize: "16px" }}>Goal Value:</span>

                <input
                    type="number"
                    id="value-input"
                    name="value"
                    min="1"
                    value={habit.goal?.value ?? 1}
                    onChange={(e) => updateGoalField("value", Number(e.target.value))}
                />

                <select
                    name="unit"
                    id="value-unit"
                    value={habit.goal?.unit ?? "steps"}
                    onChange={(e) => updateGoalField("unit", e.target.value)}
                >
                    <option value="steps">steps</option>
                    <option value="gallons">gallons</option>
                    <option value="liters">liters</option>
                    <option value="pages">pages</option>
                    <option value="hours">hours</option>
                    <option value="minutes">minutes</option>
                </select>

                <div id="goal-period-text">/ {habit.goal?.period ?? "Day"}</div>
            </div>

            <Line />

            <div id="task-days">
                <span>Task Days:</span>
                <select
                    name="task-day"
                    id="task-day"
                    style={{ fontSize: "18px", textAlign: "left" }}
                    value={habit.goal?.taskDays ?? "everyday"}
                    onChange={(e) => {updateGoalField("taskDays", e.target.value); 
                        setTaskDaysSelected(e.target.value);}}
                >
                    <option value="everyday">Everyday</option>
                    <option value="specific_days">Specific days of the week</option>
                    <option value="number_days">Number of days per week</option>
                    <option value="specific_month_days">Specific days of the month</option>
                    <option value="specific_month_number">Number of days per month</option>
                </select>
            </div>
            <div id="Select-task-days">
            <SelectTaskDays 
                    mode={taskDaysSelected}
                    setClicked = {setClicked} 
                    daysSelected = {daysSelected}
                    setDaysSelected={setDaysSelected}
                    setNumOfDays={setNumOfDays}
                    updateGoalField = {updateGoalField}/>
            </div>
        </div>
    );
}


function ReminderSettings({ habit, updateReminderField }) {
    return (
        <div id="reminder-settings"
            style={{ minHeight: habit.reminder?.activated ? "160px" : "45px"}}
        >
            <div id="reminder-option">
                <span>Do you want to be reminded?</span>
                <input
                    type="checkbox"
                    id="reminder-check"
                    checked={habit.reminder?.activated ?? false}
                    onChange={(e) => updateReminderField("activated", e.target.checked)}
                />
            </div>

            <Line isItHidden={!habit.reminder?.activated}/>
            
            <div id="select-time">
                <span hidden={!habit.reminder?.activated}>Select Time:</span>
                <input 
                    type="time" 
                    id="select-time-selector"
                    hidden={!habit.reminder?.activated}
                    value={habit.reminder?.time ?? ""}
                    onChange={(e) => updateReminderField("time", e.target.value)}
                />
            </div>

            <Line isItHidden={!habit.reminder?.activated}/>

            <textarea
                id="rem-message"
                hidden={!habit.reminder?.activated}
                placeholder="Reminder message here"
                value={habit.reminder?.message ?? ""}
                onChange={(e) => updateReminderField("message", e.target.value)}
            />
        </div>
    );
}

function Priority({ habit, updateHabitField }) {
    return (
        <div id="priority">
            <div id="set-priority">
                <span>Set Priority:</span>
                <select
                    name="priority"
                    id="select-priority"
                    value={habit.priority ?? "none"}
                    onChange={(e) => updateHabitField("priority", e.target.value)}
                >
                    <option value="none">No Preference</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <Line />
            <br />

            <div id="habit-term">
                <div id="start-date">
                    <p style={{ fontSize: "16px", textAlign: "center" }}>Start Date</p>
                    <input
                        type="date"
                        id="start-date-select"
                        name="start-date-select"
                        value={habit.startDate ?? ""}
                        onChange={(e) => updateHabitField("startDate", e.target.value)}
                        style={{ fontSize: "18px", textAlign: "center" }}
                    />
                </div>

                <div id="end-date">
                    <p style={{ fontSize: "16px", textAlign: "center" }}>End Date</p>
                    <input
                        type="date"
                        id="end-date-select"
                        name="end-date-select"
                        value={habit.endDate ?? ""}
                        onChange={(e) => updateHabitField("endDate", e.target.value)}
                        style={{ fontSize: "18px", textAlign: "center" }}
                    />
                </div>
            </div>
        </div>
    );
}

function Line({ isItHidden }) {
    return (
        <div className="line" hidden={ isItHidden } />
    );
}

function HabitDetails({ habit, uid, onClose, loadHabits }) {
    const user  = useContext(AuthContext);
    const [editedHabit, setEditedHabit] = useState(habit);
    console.log("AuthContext user:", user);

    // console.log("handleSaveHabit uid:", uid);
    // console.log("handleSaveHabit updatedHabit:", editedHabit);
    // console.log("handleSaveHabit updatedHabit.id:", editedHabit?.id);

    useEffect(() => {
        setEditedHabit(habit);
    }, [habit]);

    function updateHabitField(field, value) {
        setEditedHabit(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function updateGoalField(field, value) {
        setEditedHabit(prev => ({
            ...prev,
            goal: {
                ...prev.goal,
                [field]: value
            }
        }));
    }

    function updateReminderField(field, value) {
        setEditedHabit(prev => ({
            ...prev,
            reminder: {
                ...prev.reminder,
                [field]: value
            }
        }));
    }

    async function handleSave() {
        try {
            await handleSaveHabit(user, editedHabit);
            console.log(editedHabit);
            onClose();
            if (loadHabits) {
                await loadHabits(user.uid);
            }
        } catch (error) {
            console.error("Failed to save habit changes:", error);
        }
    }

    async function handleDelete() {
        // Implement delete functionality here, similar to handleSave but calling a delete function from firestore.js
        try {
            await deleteHabit(user.uid, editedHabit);
            onClose();
            if (loadHabits) {
                await loadHabits(user.uid);
            }
        } catch (error) {
            console.error("Failed to delete habit:", error);
        }
    }

    return (
        <div id="details-frame">
            <div id="popup-header">
                <button id="popup-close" onClick={onClose}>×</button>
            </div>

            <NameDescription
                habit={editedHabit}
                updateHabitField={updateHabitField}
            />

            <span className="details-name">Habit Type</span>
            <HabitType
                habit={editedHabit}
                updateHabitField={updateHabitField}
            />

            <span className="details-name">Goal Info</span>
            <GoalInfo
                habit={editedHabit}
                updateGoalField={updateGoalField}
            />

            <span className="details-name">Reminder Settings</span>
            <ReminderSettings
                habit={editedHabit}
                updateReminderField={updateReminderField}
            />

            <span className="details-name">Priority</span>
            <Priority
                habit={editedHabit}
                updateHabitField={updateHabitField}
            />

            <button id="save-btn" onClick={handleSave}>
                Save Changes
            </button>
            <br />
            <button id="delete-btn" 
            style={{backgroundColor: "red", color: "white"}}
            onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default HabitDetails;