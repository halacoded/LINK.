import { useEffect, useRef } from "react";
//import "../styles/LoginPage.css";

//Designed BY Ryan Mulligan , Modfie it Eye Doesnt Work
const LoginPage = () => {
  const eyeRef = useRef(null);
  const beamRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    const handleMouseMove = (e) => {
      if (!beamRef.current) return;
      const rect = beamRef.current.getBoundingClientRect();
      const mouseX = rect.right + rect.width / 2;
      const mouseY = rect.top + rect.height / 2;
      const rad = Math.atan2(mouseX - e.pageX, mouseY - e.pageY);
      const degrees = rad * (20 / Math.PI) * -1 - 350;
      root.style.setProperty("--beamDegrees", `${degrees}deg`);
    };

    const handleEyeClick = (e) => {
      e.preventDefault();
      document.body.classList.toggle("show-password");
      if (passwordRef.current) {
        passwordRef.current.type =
          passwordRef.current.type === "password" ? "text" : "password";
        passwordRef.current.focus();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    eyeRef.current?.addEventListener("click", handleEyeClick);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      eyeRef.current?.removeEventListener("click", handleEyeClick);
    };
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="form-item">
        <label>Username</label>
        <div className="input-wrapper">
          <input type="text" id="username" />
        </div>
      </div>
      <div className="form-item">
        <label>Password</label>
        <div className="input-wrapper">
          <input type="password" id="password" ref={passwordRef} />
          <button type="button" id="eyeball" ref={eyeRef}>
            <div className="eye"></div>
          </button>
          <div id="beam" ref={beamRef}></div>
        </div>
      </div>
      <button id="submit">Sign in</button>
    </form>
  );
};

export default LoginPage;
