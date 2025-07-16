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
  const [showUniqueId, setShowUniqueId] = useState(false); // New state to toggle Unique ID visibility

  // Refs to programmatically focus input fields
  const uniqueIdPart1Ref = useRef(null);
  const uniqueIdPart2Ref = useRef(null);

  // Get the API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Handler for the first part of the Unique ID (4 alpha characters)
  const handlePart1Change = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setUniqueIdPart1(value);

    // Automatically move focus to the next input field if 4 characters are entered
    if (value.length === 4) {
      uniqueIdPart2Ref.current.focus();
    }
  };

  // Handler for the second part of the Unique ID (3 numeric characters)
  const handlePart2Change = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUniqueIdPart2(value);
  };

  // Handler for key presses in the second part of the Unique ID
  const handlePart2KeyDown = (e) => {
    // If backspace is pressed and the second part is empty, move focus to the first part
    if (e.key === 'Backspace' && uniqueIdPart2.length === 0) {
      e.preventDefault(); // Prevent default backspace behavior (e.g., deleting from part1 if already focused)
      uniqueIdPart1Ref.current.focus();
    }
  };

  // Function to toggle the visibility of the Unique ID input fields
  const toggleUniqueIdVisibility = () => {
    setShowUniqueId(prev => !prev);
  };

  // This function will be called when the form is submitted.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading to true while the request is in progress
    setError(''); // Clear any previous errors

    // Combine the two parts of the Unique ID for the backend
    const uniqueIdForBackend = `${uniqueIdPart1}${uniqueIdPart2}`;

    try {
      // Make a POST request to the login API endpoint
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unique_id: uniqueIdForBackend,
          date_of_birth: dob,
        }),
      });

      const data = await response.json(); // Parse the JSON response

      // Check if the response was successful (status code 2xx)
      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.token); // Store the authentication token
        console.log('Authentication Token:', data.token);
        // Use a custom alert/modal for user feedback instead of window.alert()
        // For this example, we'll use a simple alert as a placeholder.
        // In a real application, you'd replace this with a styled modal.
        alert('Login Successful! Token stored in console and local storage.');
        // TODO: Redirect user to dashboard or another protected route
      } else {
        // Handle errors from the backend
        console.error('Login failed:', data);
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle network errors or other unexpected issues
      console.error('Network error or unexpected issue:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false); // Always set loading to false after the request completes
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

          {/* Unique ID Input Field - Split into two parts with visibility toggle */}
          <div className="mb-4">
            <label htmlFor="uniqueIdPart1" className="block text-white text-sm font-medium mb-2">
              Unique ID
            </label>
            <div className="flex items-center space-x-2 relative"> {/* Added relative for positioning eye button */}
              <input
                type={showUniqueId ? 'text' : 'password'} // Dynamically change type based on showUniqueId state
                id="uniqueIdPart1"
                ref={uniqueIdPart1Ref}
                className="shadow appearance-none border border-blue-400 rounded-lg w-1/2 py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-center"
                placeholder="AAAA"
                maxLength="4"
                value={uniqueIdPart1}
                onChange={handlePart1Change}
                autoComplete="off" // Disable browser autofill
                required
                disabled={loading} // Disable input while loading
              />
              <span className="text-white text-2xl font-bold">-</span>
              <input
                type={showUniqueId ? 'text' : 'password'} // Dynamically change type based on showUniqueId state
                id="uniqueIdPart2"
                ref={uniqueIdPart2Ref}
                className="shadow appearance-none border border-blue-400 rounded-lg w-1/2 py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-center"
                placeholder="000"
                maxLength="3"
                value={uniqueIdPart2}
                onChange={handlePart2Change}
                onKeyDown={handlePart2KeyDown}
                autoComplete="off" // Disable browser autofill
                required
                disabled={loading} // Disable input while loading
              />
              {/* Eye button for visibility toggle */}
              <button
                type="button" // Important: type="button" to prevent form submission
                onClick={toggleUniqueIdVisibility}
                className="absolute right-2 p-1 rounded-full text-gray-500 hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
                aria-label={showUniqueId ? "Hide Unique ID" : "Show Unique ID"} // Accessibility label
              >
                {/* Simple SVG circle for visibility toggle */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <circle cx="12" cy="12" r="6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Date of Birth Input Field */}
          <div className="mb-6">
            <label htmlFor="dob" className="block text-white text-sm font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className="shadow appearance-none border border-blue-400 rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              disabled={loading} // Disable input while loading
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 w-full transition-colors duration-200"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Optional: Link to registration or forgot password */}
        <div className="text-center mt-4">
          <a href="#" className="inline-block align-baseline font-bold text-sm text-white hover:text-blue-200">
            Forgot Unique ID ?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
