const storeToken = (token) => {
  localStorage.setItem("token", token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

const logout = () => {
  localStorage.removeItem("token");
};

const checkToken = () => {
  const token = getToken();
  if (token) {
    return true;
  } else return false;
};
export { storeToken, checkToken, logout, getToken };
