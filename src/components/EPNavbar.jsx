import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { apiConfig } from "../Constants/ApiConfig";
import UpdateEventModal from "./UpdateEventModal";
import UserProfile from "./UserProfile"; // Import the UserProfile component


const EPNavbar = ({ setisOpenState }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false); // State to toggle user profile display


  const handleAvatarClick = () => {
    setShowUserProfile(!showUserProfile); // Toggle user profile display
  };

  const handleSignout = () => {
    Cookies.remove("token");
    Cookies.remove("eventId");
    Cookies.remove("Id");
    Cookies.remove("email");
    navigate("/login");
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(`${apiConfig.baseURL}/searchevents`, {
          params: { topic: searchQuery },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching events:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleResultClick = (result) => {
    setSelectedEvent(result);
    setisOpenState(true);
    document.getElementById("eventModal").style.display = "";
    Cookies.set("CloseIcon", true);
  };

  return (
    <nav className="relative z-10 px-1 py-1 flex justify-end items-center bg-gray-100 py-2 pb-2 flex items-center justify-between flex-wrap" style={{ width: "75%", marginLeft: "300px", marginTop: "12px" }}>
      <div className="text-gray-500 font-normal mr-auto">
        Dashboard /<span className="font-semibold text-gray-700"> Home</span>
      </div>

      <div className="w-full flex flex-row justify-end items-center space-x-4 mr-4">
        <form className="flex flex-row items-center space-x-4" style={{ width: "60%" }}>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white-50 focus:ring-gray-500 focus:border-gray-400"
              placeholder="Search Events..."
              required
              value={searchQuery}
              onChange={handleChange}
            />

            {/* Display search results */}
            <div className={`absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-lg mt-2 overflow-y-auto max-h-60 transition-all duration-300 ease-in-out ${searchResults.length === 0 ? "hidden" : "block"}`}>
              {searchResults.map((result) => (
                <div
                  key={result.eventId}
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleResultClick(result)}
                >
                  <p className="font-bold">{result.title}</p>
                  <p className="text-sm text-gray-700">{result.description}</p>
                </div>
              ))}
            </div>
          </div>
            <img
          className="inline-block h-8 w-8 rounded-full ring-2 ring-white cursor-pointer"
          src="https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png"
          alt="User Avatar"
          onClick={handleAvatarClick}
        />
        </form>
        


       

        <button
          className="flex items-center gap-3 px-3 normal-case text-gray-500 font-semibold p-3 rounded-lg hover:bg-gray-300 hover:text-black cursor-pointer"
          onClick={handleSignout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
</svg>

          <span>Sign Out</span>
        </button>
      </div>

      {showUserProfile && <UserProfile />}{" "}
      {selectedEvent && (
        <UpdateEventModal event={selectedEvent} isOpen={true} first={setSelectedEvent} />
      )}
    </nav>
  );
};

export default EPNavbar;
