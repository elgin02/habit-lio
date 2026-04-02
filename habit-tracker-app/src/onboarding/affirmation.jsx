
import "../css/Affirmation.css";

function Affirmation({ affirmations }) {
  return (
    <div id="today-affirmation-container">
        <h2>Today's Affirmation:</h2>
        <p>{affirmations[Math.floor(Math.random() * affirmations.length)]}</p>
    </div>
  );
}

export default Affirmation;