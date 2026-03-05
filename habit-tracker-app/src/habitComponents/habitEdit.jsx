import { useState } from 'react';
import { Pencil } from 'lucide-react';
import '../css/habit.css'


function HabitEdit(){
    return(
        <div>
            <button title="Edit Habit"
            style={{borderRadius: "50%", backgroundColor: "white"}}>
                <Pencil color='black'/>
                </button>
        </div>
    );
}


export default HabitEdit;