import React from 'react';
import { useParams } from 'react-router-dom';

const CountryDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  return (
    <div>
      <h1>Country Detail</h1>
      <p>Country Code: {code}</p>
      {/* Implement country detail view */}
    </div>
  );
};

export default CountryDetail;