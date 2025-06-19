import React, { useState } from "react";
import "./ReportNew.css";

const ReportNew = () => {
  const [isShowAppDownload, setIsShowAppDownload] = useState(false);

  return (
    <>
      <button className="report-new-btn" onClick={() => setIsShowAppDownload(true)}>
        Report New
      </button>

      {isShowAppDownload && (
        <div className="app-download-overlay" onClick={() => setIsShowAppDownload(false)}>
          <div className="app-download-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setIsShowAppDownload(false)}>×</button>
            <h3>Get the App</h3>
            <p>Report hate crimes directly from your phone</p>
            <div className="store-badge-buttons">
              <a
                href="https://apps.apple.com/us/app/anti-asian-hate-crime-tracker"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.1thing.org/static/media/appstore.005ff290ce90a1c5f9e2.png"
                  alt="Download on the App Store"
                  className="store-badge-img"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=org.onething.hatecrimetracker"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.1thing.org/static/media/googleplay.b2106989d7482baf2454.png"
                  alt="Get it on Google Play"
                  className="store-badge-img"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportNew;
