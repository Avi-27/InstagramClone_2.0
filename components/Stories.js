import { useEffect, useState } from "react";
import Story from "./Story";
import faker from "faker";
import { useSession } from "next-auth/react";

const Stories = () => {
  const [suggestions, setSuggestions] = useState([]);
  const { data: session } = useSession();
  let randimg = "https://randomuser.me/api/portraits/men/34.jpg";
  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));
    setSuggestions(suggestions);
    console.log(suggestions[0].avatar);
  }, []);
  return (
    <div className="flex space-x-3 bg-white p-6 mt-8 border-gray-300 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
      {session && <Story img={session.user.image} username={session.user.username} />}

      {suggestions.map((profile) => (
        <Story key={profile.id} img={randimg} username={profile.username} />
      ))}
    </div>
  );
};

export default Stories;
