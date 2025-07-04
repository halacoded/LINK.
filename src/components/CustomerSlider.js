import "../styles/CustomerSlider.css";

const logos = [
  "Huawei-Logo.png",
  "Stc-Logo.png",
  "Zain-Logo.png",
  "Ooredoo-Logo.png",
  "Kuwait-Univ-Logo.png",
];

const CustomerSlider = () => {
  return (
    <div className="container">
      <div className="customer-slider">
        <div className="slider-track">
          {logos.map((logo, index) => (
            <div className="slide" key={index}>
              <img
                src={require(`../assets/Companies/${logo}`)}
                alt={`Customer ${index + 1}`}
              />
            </div>
          ))}

          {logos.map((logo, index) => (
            <div className="slide" key={`clone-${index}`}>
              <img
                src={require(`../assets/Companies/${logo}`)}
                alt={`Customer ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSlider;
