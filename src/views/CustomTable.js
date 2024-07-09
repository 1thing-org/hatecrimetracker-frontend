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
                  <td>{item.date || item.incident_time}</td>
                  <td>{item.location || item.incident_location}</td>
                  <td className="content-cell" title={item.content}>
                    {item.content.length > 0
                      ? `${item.content.slice(0, isSmallScreen ? 10 : 85)}...`
                      : item.content}
                  </td>
                  <td>
                    <div className="file-icons-container">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-icon"
                      >
                        <img src="/path/to/document-icon.png" alt="Document" />
                      </a>
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="file-icon"
                      >
                        <img src="/path/to/document-icon.png" alt="Document" />
                      </a>
                    </div>
                  </td>
                  <td>{item.status}</td>
                  <td>{item.reviewer}</td>
                  <td>
                    <Button color="btn btn-detail" size="sm" onClick={() => handleDetailClick(item)}>
                      Detail
                    </Button>{" "}
                    <Button color="btn btn-reject" size="sm">
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
