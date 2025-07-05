import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserContext from "./context/UserContext";
import { checkToken } from "./api/storage";

const App = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenAvailable = checkToken();
    if (tokenAvailable) {
      setUser(true);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Outlet />
    </UserContext.Provider>
  );
};

export default App;
