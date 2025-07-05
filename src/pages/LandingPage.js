import Navbar from "../components/NavBar";
import "../index.css";
import { Link } from "react-router-dom";
import CustomerSlider from "../components/CustomerSlider";
import Footer from "../components/Footer";
const LandingPage = () => {
  return (
    <>
      <div className="container">
        <div
          className="centered-content"
          style={{ gridColumn: "1 / -1", marginTop: "30px" }}
        >
          <Navbar />
          <div className="Hero">
            <h1 className="large-heading">
              Built for Telcos that don’t guess <br /> they know.{" "}
            </h1>
            <p className="paragraph-text">
              LINK. gives telcos predictive insights to retain customers and{" "}
              <br /> grow stronger relationships—no guesswork required.
            </p>

            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary">
                TRY LINK. NOW
              </Link>
              <a
                href="https://github.com/halacoded/LINK."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                LEARN MORE
              </a>
            </div>
          </div>

          <section className="customer-section">
            <CustomerSlider />
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
