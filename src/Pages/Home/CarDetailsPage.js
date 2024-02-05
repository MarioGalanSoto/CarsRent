// CarDetailsPage.js

import React from 'react';
import { useParams } from 'react-router-dom';
import CarDetails from '../../components/CarComponents/CarDetails';

const CarDetailsPage = () => {
  const { carId } = useParams();
  // Fetch car details based on carId from your data source

  const carDetails = {
    // Assume you have fetched the details based on carId
    id: carId,
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 30000,
    rentalStatus: true,
    // Add more details as needed
  };

  return (
    <div>
      <h2>Car Details</h2>
      <CarDetails data={carDetails} />
    </div>
  );
};

export default CarDetailsPage;
