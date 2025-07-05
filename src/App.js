import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserContext from "./context/UserContext";
import { checkToken, storeToken } from "./api/storage";

const App = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/signup", "/complete-profile"];
    const currentPath = window.location.pathname;

    const tokenFromUrl = new URLSearchParams(window.location.search).get(
      "token"
    );
    if (tokenFromUrl) {
      storeToken(tokenFromUrl);
    }

    const tokenAvailable = checkToken();
    if (!tokenAvailable && !publicRoutes.includes(currentPath)) {
      navigate("/");
    } else {
      setUser(!!tokenAvailable);
    }
  }, [navigate]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Outlet />
    </UserContext.Provider>
  );
};

export default App;
