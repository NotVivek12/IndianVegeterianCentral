import React from 'react';
import { useParams } from 'react-router-dom';

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Place Detail</h1>
      <p>Place ID: {id}</p>
      {/* Implement place detail view */}
    </div>
  );
};

export default PlaceDetail;
