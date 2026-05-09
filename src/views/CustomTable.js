import React from "react";
import { Table, Button } from "reactstrap";
import PropTypes from "prop-types";

const CustomTable = ({
  title,
  data,
  isSmallScreen,
  handleDetailClick,
  currentPage,
  totalPages,
  handlePageChange,
  selectedTab // Add selectedTab as a prop
}) => {
  return (
    <>
      <div className="header-container">
        <h5>{title}</h5>
      </div>
      <div className="table-container">
        <div className="table-header-container">
          <Table>
            <thead className="table-header">
              <tr>
                {selectedTab !== 'news' && <th>ID</th>}
                <th>Date</th>
                <th>Location</th>
                <th>Content</th>
                <th>File</th>
                <th>Status</th>
                <th>Reviewer</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody className="table-body-container">
              {data.map((item, index) => (
                <tr key={index}>
                  {selectedTab !== 'news' && <td>{item.id}</td>}
                  <td>{item.incident_time}</td>
                  <td>{item.incident_location}</td>
                  <td className="content-cell">
                    {item.abstract
                      ? item.abstract
                      : "Content not available"}
                  </td>
                  <td>
                    {
                      item.attachments && item.attachments.length > 0 ? (
                        <div className="file-icons-container">
                          {item.attachments.slice(0, 3).map((attachment, attIndex) => {
                            const isVideo = /\.(mp4|mov|m4v|avi|wmv|mkv|webm|3gp)(?:\?|$)/i.test(attachment);
                            return isVideo ? (
                              <video
                                src={attachment}
                                key={attIndex}
                                className="attachment-thumb-cell"
                                muted
                              />
                            ) : (
                              <img
                                src={attachment}
                                alt={`Attachment ${attIndex + 1}`}
                                key={attIndex}
                                className="attachment-thumb-cell"
                                loading="lazy"
                              />
                            );
                          })}
                          {item.attachments.length > 3 && (
                            <span className="attachment-count">
                              +{item.attachments.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                         <div className="no-files">No files</div>
                      )
                    }
                  </td>
                  <td>
                    {item.self_report_status ? (
                      <span className={`status-pill status-${item.self_report_status}`}>
                        {item.self_report_status === 'new'
                          ? 'Pending'
                          : item.self_report_status.charAt(0).toUpperCase() + item.self_report_status.slice(1)}
                      </span>
                    ) : null}
                  </td>
                  <td>{item.reviewer}</td>
                  <td>
                    <Button className="btn-action btn-detail" size="sm" onClick={() => handleDetailClick(item)}>
                      Detail
                    </Button>{" "}
                    <Button className="btn-action btn-reject" size="sm">
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="pagination">
          <button disabled={currentPage <= 1} onClick={() => handlePageChange(currentPage - 1)}>
            <i className="fa-solid fa-sharp fa-angle-left fa-xl" style={{ color: "#d9d9d9" }}></i>
          </button>
          <span className="page-info">
            <span className="current-page">{currentPage}</span> / {totalPages}
          </span>
          <button disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            <i className="fa-solid fa-angle-right fa-xl" style={{ color: "#d9d9d9" }}></i>
          </button>
        </div>
      </div>
    </>
  );
};

CustomTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  handleDetailClick: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired, // Add selectedTab to propTypes
};

export default CustomTable;
