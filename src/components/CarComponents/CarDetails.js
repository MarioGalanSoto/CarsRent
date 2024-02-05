// CarDetails.js

import React, { useState } from 'react';

const CarDetails = ({ data }) => {
  const [showRentForm, setShowRentForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fullname, setFullName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [email, setEmail] = useState('');

  const handleRentCar = () => {
    setShowRentForm(true);
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if there is a customer with the entered username and password
      const customersResponse = await fetch('https://localhost:7200/api/Customers');
      const customersData = await customersResponse.json();

      const matchingCustomer = customersData.find(
        (customer) => customer.username === username && customer.password === password
      );

      if (matchingCustomer) {
        // Customer already exists, save the customerID
        const customerID = matchingCustomer.customerID;

        // Calculate totalCost
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)); // Calculate the number of days

        const totalCost = days * data.pricePerDay;

        // Now, you can send a request to your backend to save the rental information
        const rentalData = {
          carID: data.carID, // Assuming you have carID in your data
          customerID: customerID,
          startDate: startDate,
          endDate: endDate,
          totalCost: totalCost,
          // Add other rental details as needed
        };
        const rentalResponse = await fetch('https://localhost:7200/api/Rentals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalData),
        });

        if (rentalResponse.ok) {
          // Handle success, maybe show a success message or redirect
          console.log('Rental saved successfully!');

        // Now, update the rentalStatus of the car to true
        const updateCarResponse = await fetch(`https://localhost:7200/api/Cars/${data.carID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carID:data.carID,
            brand:data.brand,
            model:data.model,
            year:data.year,
            rentalStatus: true,
            pricePerDay:data.pricePerDay,
            imageLink:data.imageLink,
          }),
        });

        if (updateCarResponse.ok) {
          // Handle success, maybe show a success message or redirect
          console.log('Car rental status updated successfully!');
        } else {
          // Handle error, maybe show an error message
          console.error('Error updating car rental status:', updateCarResponse.statusText);
        }
        } else {
          // Handle error, maybe show an error message
          console.error('Error saving rental:', rentalResponse.statusText);
        }
      } else {
        // Customer does not exist, create a new customer
        const newCustomerData = {
          firstName: fullname.split(' ')[0], // Assuming full name is split into first and last names
          lastName: fullname.split(' ')[1],
          email: email,
          phone: cellphone,
          username: username,
          password: password,
          // Add other customer details as needed
        };
        console.log(newCustomerData)

        // Calculate totalCost
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)); // Calculate the number of days

        const totalCost = days * data.pricePerDay;

        const newCustomerResponse = await fetch('https://localhost:7200/api/Customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomerData),
        });

        if (newCustomerResponse.ok) {
          // Get the newly created customerID
          const newcustomer = await fetch('https://localhost:7200/api/Customers');
          const newcustomerjson = await newcustomer.json();

          const matchingCustomer = newcustomerjson.find(
            (customer) => customer.username === username && customer.password === password
          );


          // Now, you can send a request to your backend to save the rental information
          const rentalData = {
            carID: data.carID, // Assuming you have carID in your data
            customerID: matchingCustomer.customerID,
            startDate: startDate,
            endDate: endDate,
            totalCost: totalCost,
            // Add other rental details as needed
          };

          console.log(rentalData);
          const rentalResponse = await fetch('https://localhost:7200/api/Rentals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rentalData),
          });
          
          
          if (rentalResponse.ok) {
            // Handle success, maybe show a success message or redirect
            console.log('Rental saved successfully!');
            // Now, update the rentalStatus of the car to true
            const updateCarResponse = await fetch(`https://localhost:7200/api/Cars/${data.carID}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  carID:data.carID,
                  brand:data.brand,
                  model:data.model,
                  year:data.year,
                  color:data.color,
                  rentalStatus: true,
                  pricePerDay:data.pricePerDay,
                  imageLink:data.imageLink,
                }),
              });
      
              if (updateCarResponse.ok) {
                // Handle success, maybe show a success message or redirect
                console.log('Car rental status updated successfully!');
              } else {
                // Handle error, maybe show an error message
                console.error('Error updating car rental status:', updateCarResponse.statusText);
              }
            
          } else {
            // Handle error, maybe show an error message
            console.error('Error saving rental:', rentalResponse.statusText);
          }
        } else {
          // Handle error, maybe show an error message
          console.error('Error creating new customer:', newCustomerResponse.statusText);
        }
      }

      // After handling the submission, you can close the form
      window.location.reload();
      setShowRentForm(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="car-details">
      <h4>Details</h4>
      <p>Year: {data.year}</p>
      <p>Price per day: ${data.pricePerDay}</p>
      {/* Add more details as needed */}
      {!showRentForm && <button onClick={handleRentCar}>Rent now</button>}
      {showRentForm && (
        <form onSubmit={handleRentSubmit}>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <br/>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <br/>
          <label>
            Fullname:
            <input type="text" value={fullname} onChange={(e) => setFullName(e.target.value)} required />
          </label>
          <br/>
          <label>
            cellphone:
            <input type="text" value={cellphone} onChange={(e) => setCellphone(e.target.value)} required />
          </label>
          <br/>
          <label>
            Email:
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <br/>
          <label>
            Start Date:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>
          <br/>
          <label>
            End Date:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </label>
          <br/>
          <button type="submit">Submit Rental</button>
        </form>
      )}
    </div>
  );
};

export default CarDetails;
