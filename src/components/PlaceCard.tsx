import React from 'react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <div>
      <h3>{place.name}</h3>
      <p>Veg Score: {place.vegScore}</p>
      <p>Distance: {place.distance} km</p>
      <p>Open Now: {place.openNow ? 'Yes' : 'No'}</p>
      <p>Sample Dishes: {place.sampleDishes.join(', ')}</p>
    </div>
  );
};

export default PlaceCard;
