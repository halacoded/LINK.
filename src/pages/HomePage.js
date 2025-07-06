import Navbar from "../components/NavBar";

const HomePage = ({ user }) => {
  return (
    <>
      <div className="container">
        <div
          className="centered-content"
          style={{ gridColumn: "1 / -1", marginTop: "30px" }}
        >
          <Navbar />
        </div>
      </div>
    </>
  );
};

export default HomePage;
