import { useEffect, useState } from "react";
import "./css/HabitFilter.css";



function HabitFilter({ filter, setFilter, secondaryFilter, setSecondaryFilter }) {
  // const [localFilter, setLocalFilter] = useState(filter);
  useEffect(() => {
    if (filter !== "priority" && filter !== "alpha") {
      setSecondaryFilter(null); // Reset secondary filter when not in priority or alphabetical mode
    }
  }, [filter]);

  return (
    <div id="habit-filters">
        <label htmlFor="habit-filter">Filter by:</label>
        <select id="habit-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="incomplete">Incomplete Habits</option>
            <option value="completed">Completed Habits</option>
            <option value="priority">Priority</option>
            <option value="alpha">Alphabetical Order</option>
            <option value="all">All Habits</option>
        </select>

        {filter === 'priority' && (
          <div>
            <label htmlFor="priority-filter">&nbsp;&nbsp;&nbsp;Select Priority Ordering:</label>
            <select id="priority-filter" value={secondaryFilter} onChange={(e) => setSecondaryFilter(e.target.value)}>
              <option value="priority-asc">Ascending (Low to High)</option>
              <option value="priority-desc">Descending (High to Low)</option>
            </select>
          </div>
        )}
        
        {filter === 'alpha' && (
          <div>
            <label htmlFor="alpha-filter">&nbsp;&nbsp;&nbsp;Select Alphabetical Ordering:</label>
            <select id="alpha-filter" value={secondaryFilter} onChange={(e) => setSecondaryFilter(e.target.value)}>
              <option value="alpha-asc">Ascending (A-Z)</option>
              <option value="alpha-desc">Descending (Z-A)</option>
            </select>
          </div>
        )}
    </div>
  );
}

export default HabitFilter;