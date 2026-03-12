import HabitEdit from "./habitEdit";
import { useState } from "react";
import { toggleHabitCompletion, isHabitCompletedToday } from "../firestore";
import '../css/habit.css'

function Habit({habit, uid, loadHabits, onEdit}){
    const habitName = habit.name ?? "";
    const dynamicFontSize = habitName.length > 15 ? "20px" : "30px";
    const [isCompleted, setIsCompleted] = useState(isHabitCompletedToday(habit));
    const [isToggling, setIsToggling] = useState(false);
    
    console.log("Habit Props:", habit); // Debugging line to check the props being passed to Habit component

    const handleToggleCompletion = async () => {
      if (isToggling) return; // Prevent multiple clicks
      
      setIsToggling(true);
      try {
        await toggleHabitCompletion(uid, habit.id);
        setIsCompleted(!isCompleted);
        // Reload habits to get updated streak
        if (loadHabits) {
          await loadHabits(uid);
        }
      } catch (error) {
        console.error("Error toggling habit completion:", error);
      } finally {
        setIsToggling(false);
      }
    };
  return(
    <div>
      <div className ="habit-created" style={{backgroundColor: habit.color ?? "#FFFFFF"}}>
        <input 
          type="checkbox" 
          className="habit-checkbox"
          checked={isCompleted}
          onChange={handleToggleCompletion}
          disabled={isToggling}
          title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        />
        <h1 style={{fontSize: "64px"}}>📝&nbsp;</h1>
        <div className='habit-info'>
            <h1 className='habit-name'
            style={{fontSize: dynamicFontSize, color: "black"}}>{habitName}</h1>
            <h2 
            style={{fontSize: "24px", color: "red"}}>
              Goal: {habit.goal?.value ?? "0"}&nbsp; 
              {habit.goal?.unit ?? "steps"}/{habit.goal?.period ?? "day"}</h2>
        </div>
        <div className="habit-streak-edit">
          <h3 className="habit-streak" title="Habit Streak">🔥{habit.streak ?? 0}</h3>
          <HabitEdit habit={habit} uid={uid} loadHabits={loadHabits} onOpen={onEdit} />
        </div>
      </div>
      <br />
    </div>
  );
}

export default Habit;