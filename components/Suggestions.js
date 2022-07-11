import { useEffect, useState } from "react";
import faker from "faker";

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(5)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));
    setSuggestions(suggestions);
  }, []);
  return (
    <div className="mt-4 ml-10">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
        <button className="text-gray-600 font-semibold">See All</button>
      </div>
      {suggestions.map((profile) => (
        <div key={profile.id} className="flex items-center mt-3 justify-between">
          <img
            src="https://randomuser.me/api/portraits/men/35.jpg"
            alt=""
            className="rounded-full h-10 w-10 object-contain border p-1 mr-3"
          />
          <div className="flex-1 ml-4">
            <h2 className="font-semibold text-sm">{profile.username}</h2>
            <h3 className="truncate text-xs text-gray-500">Works at {profile.company.name}</h3>
          </div>
          <button className="text-blue-500 text-sm">Follow</button>
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
