import React from 'react';

interface FilterProps {
  onFilterChange: (filters: { [key: string]: any }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    const filterValue = type === 'checkbox' ? checked : value;
    onFilterChange({ [name]: filterValue });
  };

  return (
    <div>
      <h2>Filters</h2>
      <label>
        Vegetarian:
        <input
          type="checkbox"
          name="vegetarian"
          onChange={handleFilterChange}
        />
      </label>
      {/* Add more filters as needed */}
    </div>
  );
};

export default Filter;
