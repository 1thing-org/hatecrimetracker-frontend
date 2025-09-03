import { SelectPicker } from "rsuite";
import ReportIncident from "../report-incident";
import "./Navbar.css";

const MobileMenu = ({
  isOpen,
  onClose,
  supportLanguages,
  selectedLangCode,
  setSelectedLang,
  t,
}) => {
  if (!isOpen) return null;
  return (
    <div className="mobile-menu-backdrop" onClick={onClose}>
      <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
        <button className="mobile-menu-close" aria-label="Close menu" onClick={onClose}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="mobile-menu-content">
          <div className="mobile-menu-item">
            <ReportIncident />
          </div>
          <div className="mobile-menu-item">
            <a
              href="https://docs.google.com/forms/d/1pWp89Y6EThMHml1jYGkDj5J0YFO74K_37sIlOHKkWo0"
              target="_blank"
              className="contact_us"
            >
              {t("contact_us")}
            </a>
          </div>
          <div className="mobile-menu-item mobile-menu-lang">
            <SelectPicker
              data={supportLanguages}
              searchable={false}
              cleanable={false}
              defaultValue={selectedLangCode}
              style={{ width: 160}}
              className={"rs-theme-dark no-border-lang-picker"}
              onChange={(value) => setSelectedLang(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 