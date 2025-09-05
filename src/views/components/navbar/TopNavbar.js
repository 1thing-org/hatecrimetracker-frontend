import logo from "../../../assets/images/logo/logo.png";
import { SelectPicker } from "rsuite";
import ReportIncident from "../report-incident";
import "./Navbar.css";

const TopNavbar = ({
  deviceSize,
  selectedLangCode,
  supportLanguages,
  setSelectedLang,
  t,
  onOpenMenu,
}) => {
  return (
    <div className="navbar">
      <div className="title-section">
        <p className="title">
          <img src={logo} alt="logo" className="logo" /> {" "}
          {t("website.name")}
        </p>
      </div>

      {deviceSize > 786 ? (
        <div className="controls-section">
          <ReportIncident />
          <a
            href="https://docs.google.com/forms/d/1pWp89Y6EThMHml1jYGkDj5J0YFO74K_37sIlOHKkWo0"
            target="_blank"
            className="contact_us"
          >
            {t("contact_us")}
          </a>
          <SelectPicker
            data={supportLanguages}
            searchable={false}
            cleanable={false}
            defaultValue={selectedLangCode}
            style={{ width: 120 }}
            className={"rs-theme-dark no-border-lang-picker"}
            onChange={(value) => setSelectedLang(value)}
          />
        </div>
      ) : (
        <button
          className="hamburger-button"
          aria-label="Open menu"
          onClick={onOpenMenu}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 6h18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 12h18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 18h18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TopNavbar; 