// frontend/src/pages/LoginPage.jsx

import React, { useState, useRef } from 'react';

// This is the main component for our login page.
function LoginPage() {
  // State for the two parts of the Unique ID
  const [uniqueIdPart1, setUniqueIdPart1] = useState(''); // First 4 alpha characters
  const [uniqueIdPart2, setUniqueIdPart2] = useState(''); // Last 3 numeric characters
  const [dob, setDob] = useState(''); // Date of Birth
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const [error, setError] = useState(''); // State to store and display error messages

  // Refs to programmatically focus input fields
  const uniqueIdPart1Ref = useRef(null);
  const uniqueIdPart2Ref = useRef(null);

  // Get the API base URL from environment variables
  // In development, this will be http://localhost:8000/api
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handler for the first part of the Unique ID (4 alpha characters)
  const handlePart1Change = (e) => {
    // Convert to uppercase and filter for A-Z characters
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setUniqueIdPart1(value);

    // Auto-jump to the second field if 4 characters are entered
    if (value.length === 4) {
      uniqueIdPart2Ref.current.focus();
    }
  };

  // Handler for the second part of the Unique ID (3 numeric characters)
  const handlePart2Change = (e) => {
    // Filter for 0-9 numeric characters
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUniqueIdPart2(value);
  };

  // Handler for key presses in the second part of the Unique ID
  const handlePart2KeyDown = (e) => {
    // If backspace is pressed and the field is empty, jump back to the first field
    if (e.key === 'Backspace' && uniqueIdPart2.length === 0) {
      e.preventDefault(); // Prevent default backspace behavior (e.g., navigating back in history)
      uniqueIdPart1Ref.current.focus();
      // Optionally, move cursor to end of first field if needed
      // uniqueIdPart1Ref.current.setSelectionRange(uniqueIdPart1.length, uniqueIdPart1.length);
    }
  };

  // Updated handleSubmit function for frontend/src/pages/LoginPage.jsx

// This function will be called when the form is submitted.
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevents the default form submission behavior (page reload)
  setLoading(true); // Set loading state to true
  setError(''); // Clear any previous errors

  // IMPORTANT: Combine the two parts WITHOUT the hyphen for backend submission
  // Example: if uniqueIdPart1 is "AAAA" and uniqueIdPart2 is "000",
  // uniqueIdForBackend will be "AAAA000" (7 characters)
  const uniqueIdForBackend = `${uniqueIdPart1}${uniqueIdPart2}`;

  try {
    // Make the API call to your Django backend login endpoint
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unique_id: uniqueIdForBackend, // Use the hyphen-stripped ID here
        date_of_birth: dob, // DOB should be in YYYY-MM-DD format from input type="date"
      }),
    });

    const data = await response.json(); // Parse the JSON response

    if (response.ok) { // Check if the response status is 2xx (success)
      console.log('Login successful:', data);
      localStorage.setItem('authToken', data.token); // Store token for future authenticated requests
      console.log('Authentication Token:', data.token);
      alert('Login Successful! Token stored in console and local storage.'); // Use alert for now, replace with proper UI later
      // TODO: Redirect user to dashboard
    } else {
      // Handle login errors (e.g., invalid credentials)
      console.error('Login failed:', data);
      setError(data.error || 'Login failed. Please check your credentials.');
    }
  } catch (err) {
    // Handle network errors or other unexpected issues
    console.error('Network error or unexpected issue:', err);
    setError('An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false); // Always set loading state to false after request
  }
};

  return (
    // Main container with abstract background and centering
    <div className="flex items-center justify-center min-h-screen bg-[url('/5166950.jpg')] bg-cover bg-center bg-no-repeat bg-fixed bg-blue-100 bg-blend-overlay font-inter">
      {/* Login card container with gradient background */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Aspira Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Error message display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {/* Unique ID Input Field - Split into two parts */}
          <div className="mb-4">
            <label htmlFor="uniqueIdPart1" className="block text-white text-sm font-medium mb-2">
              Unique ID
            </label>
            <div className="flex items-center space-x-2"> {/* Flex container for the two parts and hyphen */}
              <input
                type="password" // Masks input characters
                id="uniqueIdPart1"
                ref={uniqueIdPart1Ref} // Attach ref
                className="shadow appearance-none border border-blue-400 rounded-lg w-1/2 py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-center"
                placeholder="AAAA"
                maxLength="4" // Limit input to 4 characters
                value={uniqueIdPart1}
                onChange={handlePart1Change}
                autoComplete="off"
                required
                disabled={loading} // Disable inputs when loading
              />
              <span className="text-white text-2xl font-bold">-</span> {/* Hyphen separator */}
              <input
                type="password" // Masks input characters
                id="uniqueIdPart2"
                ref={uniqueIdPart2Ref} // Attach ref
                className="shadow appearance-none border border-blue-400 rounded-lg w-1/2 py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-center"
                placeholder="000"
                maxLength="3" // Limit input to 3 characters
                value={uniqueIdPart2}
                onChange={handlePart2Change}
                onKeyDown={handlePart2KeyDown} // Handle backspace for auto-jump
                autoComplete="off"
                required
                disabled={loading} // Disable inputs when loading
              />
            </div>
          </div>

          {/* Date of Birth Input Field */}
          <div className="mb-6">
            <label htmlFor="dob" className="block text-white text-sm font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date" // HTML5 date input type for a date picker
              id="dob"
              className="shadow appearance-none border border-blue-400 rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              disabled={loading} // Disable inputs when loading
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Logging in...' : 'Login'} {/* Change button text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
