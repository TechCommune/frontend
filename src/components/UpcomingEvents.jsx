import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch upcoming events from the API endpoint
    async function fetchEvents(async) {
      try {
        const response = await fetch(
          "http://localhost:8090/api/upcoming",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "organizerId": Cookies.get("Id")
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming events");
        }
        const eventData = await response.json();
        setEvents(eventData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchEvents();
  }, []);

  // Function to calculate the number of days between two dates
  const daysLeft = (date) => {
    const eventDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = eventDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  };

  return (
    <div className="w-full max-w-md p-4 bg-white mt-8 mb-5 border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-white-800 ">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-black">Upcoming Events</h5>
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
          View all
        </a>
      </div>
      <hr />
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.slice(0, 5).map((event, index) => (
            <React.Fragment key={index}>
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* <img className="w-8 h-8 rounded-full" src={event.image} alt={event.title} /> */}
                  </div>
                  <div className="flex flex-row item-center justify-between gap-14 mt-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-black">{event.title}</p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400 ml-4">
                      {daysLeft(event.startTime)} days to go
                    </p>
                  </div>
                </div>
              </li>
              <hr/>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UpcomingEvents;
