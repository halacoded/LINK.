import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__info">
        <p>
          Developed by{" "}
          <a
            href="https://hala-almutari.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Hala Almutairi</strong>
          </a>{" "}
          — Computer Engineer
        </p>
        <p>
          Project by <strong>Kuwait University × Huawei Internship</strong>
        </p>
        <p>
          Credits to{" "}
          <a
            href="https://ryanmulligan.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Ryan Mulligan</strong>
          </a>{" "}
          for login design inspiration
        </p>
        <p>
          <a
            href="https://github.com/halacoded/LINK"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source on GitHub
          </a>
        </p>
        <p>&copy; {new Date().getFullYear()} All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
