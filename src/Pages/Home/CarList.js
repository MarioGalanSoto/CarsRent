// CarList.js
import React, { useState, useEffect } from 'react';
import Card from '../../components/CarComponents/CarCard'
import axios from 'axios';
const CarList = () => {
    const [cars, setCars] = useState([]);
  
    useEffect(() => {
      // Fetch data from the backend
      const fetchData = async () => {
        try {
          const response = await axios.get('https://localhost:7200/api/Cars');
          setCars(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

    return (
      <div className="card-list">
        {cars.map((card, index) => (
          <Card key={index} data={card} />
        ))}
      </div>
    );
  };
  
  export default CarList;