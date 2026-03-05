import HabitEdit from "./habitEdit";
import '../css/habit.css'

function Habit(props){
  return(
    <div>
      <div className ="habit-created">
        <h1 style={{fontSize: "64px"}}>📝&nbsp;</h1>
        <div className='habit-info'>
            <h1 className='habit-name'
            style={{fontSize: "30px", color: "black"}}>{props.name}</h1>
            <h2 
            style={{fontSize: "24px", color: "red"}}>
              Goal: {props.goal ? props.goal : "0"}/{props.period ? props.period : "week"}</h2>
        </div>
        <HabitEdit />
      </div>
      <br />
    </div>
  );
}

export default Habit;