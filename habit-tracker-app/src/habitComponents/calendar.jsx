import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../css/calendar.css";

// User will select days from the calendar to set the days of the month that they want to complete the habit on.
function Calendar({daysSelected, setDaysSelected}) {
  // const [selected, setSelected] = useState([]);
  
  return(
    <div style={{ padding: "20px" }}>
      <h2>Multi-select calendar</h2>
      <div className="calendar-container">
      <DayPicker
      className="calendar"
      animate
        mode="multiple"
        captionLayout="dropdown"
        disabled={{ before: new Date() }}
        selected={daysSelected}
        onSelect={setDaysSelected}
        
        startMonth={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
        endMonth={new Date(2035, 6)} />
      </div>
      {/* {daysSelected.length > 0 && (
        <p style={{ marginTop: "20px" }}>
          You selected: {daysSelected.map((date) => date.toISOString().split("T")[0]).join(", ")}
        </p>
      )} */}
    </div>
  )
}

export default Calendar;