import { useEffect, useState } from "react";
import axios from "axios";

const useAuthStatus = () => {
  const [status, setStatus] = useState({
    loading: true,
    loggedIn: false,
    user: null,
    role: null,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/check-login", {
        withCredentials: true, // Required for cookies
      })
      .then((res) => {
        if (res.data.logged_in) {
          setStatus({
            loading: false,
            loggedIn: true,
            user: res.data.user,
            role: res.data.role,
          });
        } else {
          setStatus({ loading: false, loggedIn: false, user: null, role: null });
        }
      })
      .catch(() => {
        setStatus({ loading: false, loggedIn: false, user: null, role: null });
      });
  }, []);

  return status;
};

export default useAuthStatus;
