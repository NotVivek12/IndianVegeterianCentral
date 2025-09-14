import React from 'react';
import { Link } from 'react-router-dom';

const CountryIndex: React.FC = () => {
  // Dummy data for countries
  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'uk', name: 'United Kingdom' },
    { code: 'de', name: 'Germany' },
    { code: 'jp', name: 'Japan' },
    { code: 'ae', name: 'United Arab Emirates' },
  ];

  return (
    <div>
      <h1>Country Guides</h1>
      <ul>
        {countries.map((country) => (
          <li key={country.code}>
            <Link to={`/country/${country.code}`}>{country.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryIndex;
