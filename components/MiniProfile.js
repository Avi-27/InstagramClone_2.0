import { signOut, useSession } from "next-auth/react";

const MiniProfile = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img src={session?.user?.image} alt="" className="rounded-full p-[2px] border w-16 h-16" />
      <div className="flex-1 mx-4">
        <h2 className="font-bold">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram 2.0</h3>
      </div>
      <button onClick={signOut} className="text-blue-600 text-sm font-semibold ml-3">
        Sign Out
      </button>
    </div>
  );
};

export default MiniProfile;
