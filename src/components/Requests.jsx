import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, userId, requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return <h1 className="flex justify-center my-10"> No Requests Found</h1>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        Connection Requests
      </h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoURL, age, gender, about } =
          request.fromUserId;

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
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() =>
                  reviewRequest("rejected", request.fromUserId._id, request._id)
                }
              >
                Reject
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() =>
                  reviewRequest("accepted", request.fromUserId._id, request._id)
                }
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Requests;
