import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return (
      <h1 className="flex justify-center my-10 text-white">
        {" "}
        No Connections Found
      </h1>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        Your Connections
      </h1>

      {connections.map((connection) => {
        // Extract the connected user data (the other user, not the current user)
        const connectedUser =
          connection.fromUserId._id === user._id
            ? connection.toUserId
            : connection.fromUserId;

        const { _id, firstName, lastName, photoURL, age, gender, about } =
          connectedUser;

        return (
          <div
            key={_id}
            className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 flex items-center gap-4"
          >
            <img
              alt="photo"
              className="w-16 h-16 rounded-full object-cover"
              src={photoURL}
            />

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">
                {firstName + " " + lastName}
              </h2>
              {age && gender && (
                <p className="text-gray-300">{age + ", " + gender}</p>
              )}
              <p className="text-gray-400 text-sm">{about}</p>
            </div>

            <div className="flex gap-2">
              <Link to={"/chat/" + _id}>
                <button className="bg-purple-600/80 backdrop-blur-md text-white px-6 py-2 rounded-2xl border border-purple-500/30 hover:bg-purple-500/80 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                  </span>
                </button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Connections;
