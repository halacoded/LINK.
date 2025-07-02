import "../index.css";

const LandingPage = () => {
  return (
    <div className="container">
      <div style={{ gridColumn: "span 12" }}>
        <h1>Welcome to LINK.</h1>
        <p>Customer Intelligence Platform for Telecom Excellence.</p>
      </div>

      <div style={{ gridColumn: "span 6" }}>{/* Left half content */}</div>

      <div style={{ gridColumn: "span 6" }}>{/* Right half content */}</div>
    </div>
  );
};

export default LandingPage;
