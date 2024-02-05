// Card.js

import React, { useState, useEffect } from 'react';
import CarDetails from './CarDetails';

const Card = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [rentalInfo, setRentalInfo] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    // Fetch rental information if the car is rented
    const fetchRentalInfo = async () => {
      if (data.rentalStatus) {
        try {
          const rentalResponse = await fetch('https://localhost:7200/api/Rentals');
          if (rentalResponse.ok) {
            const rentalData = await rentalResponse.json();
            const carRentalInfo = rentalData.find((rental) => rental.carID === data.carID);
            setRentalInfo(carRentalInfo);

            // Fetch customer information
            const customerResponse = await fetch(`https://localhost:7200/api/Customers/${carRentalInfo.customerID}`);
            if (customerResponse.ok) {
              const customerData = await customerResponse.json();
              setCustomerInfo(customerData);
            } else {
              console.error('Error fetching customer information:', customerResponse.statusText);
            }
          } else {
            console.error('Error fetching rental information:', rentalResponse.statusText);
          }
        } catch (error) {
          console.error('Error fetching information:', error);
        }
      }
    };

    fetchRentalInfo();
  }, [data.carID, data.rentalStatus]);

  return (
    <div className="card">
      <img src={data.imageLink} alt={data.brand} />
      <div className="card-body">
        <h3>{data.brand}</h3>
        <p>{data.model} ({data.color})</p>
        <p>{!data.rentalStatus ? 'Available for Rent' : 'Not Available for Rent'}</p>

        {!data.rentalStatus && (
          <button onClick={() => setShowDetails(!showDetails)}>See More</button>
        )}
        <hr />
        {showDetails && <CarDetails data={data} />}
        {rentalInfo && customerInfo && (
          <p>Car rented by {customerInfo.firstName} {customerInfo.lastName}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
