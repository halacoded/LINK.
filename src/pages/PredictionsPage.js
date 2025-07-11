import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSavedPredictions, getBatchPrediction } from "../api/Insights";
import "../styles/NavbarHome.css";
const defaultColumns = [
  "gender",
  "tenure",
  "Contract",
  "TotalCharges",
  "churn",
];

const PredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [searchTerm, setSearchTerm] = useState("");
  const [churnFilter] = useState("All");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const fileInputRef = useRef(null);
  const hasFetched = useRef(false);
  const itemsPerPage = 10;

  useEffect(() => {
    let temp = predictions;

    if (churnFilter !== "All") {
      temp = temp.filter((row) => row.churn === churnFilter);
    }

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      temp = temp.filter((row) =>
        visibleColumns.some((key) =>
          String(row[key]).toLowerCase().includes(lower)
        )
      );
    }

    setFiltered(temp);
    setCurrentPage(1);
  }, [predictions, searchTerm, churnFilter, visibleColumns]);

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const allColumns = predictions.length > 0 ? Object.keys(predictions[0]) : [];

  useEffect(() => {
    async function fetchSaved() {
      if (hasFetched.current) return;
      const data = await getSavedPredictions();
      setPredictions(data);
      hasFetched.current = true;
    }
    fetchSaved();
  }, []);

  const handleFileSelection = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setLoading(true);
    try {
      const enriched = await getBatchPrediction(selectedFile);
      setPredictions(enriched);
      hasFetched.current = true;
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleColumnToggle = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setVisibleColumns(selected);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {/* Chart Header */}
      <div className="left-content">
        <h3>CHURN CHART OVERVIEW</h3>
        <p>Insight into customers at risk of leaving the company</p>
      </div>

      {/* Chart Section */}
      <div
        style={{
          position: "relative",
          transform: "translateX(-3%)",
          marginBottom: "2rem",
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={
              predictions.length === 0
                ? [{ index: 0, churn: 0 }]
                : paginatedData.map((row, i) => ({
                    index: (currentPage - 1) * itemsPerPage + i + 1,
                    churn: row.churn === "Yes" ? 1 : 0,
                  }))
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            {predictions.length > 0 && (
              <Line
                type="monotone"
                dataKey="churn"
                stroke="#000"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {predictions.length === 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          >
            <p>Waiting for file upload to show churn insights</p>
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="left-content">
        <h3>CUSTOMER</h3>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileSelection}
        style={{ display: "none" }}
      />

      {/* Controls Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "250px",
          }}
        />
        <button
          onClick={() => setShowColumnSelector(!showColumnSelector)}
          className="navbar__icon-button2"
        >
          <img
            src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzkyIiBoZWlnaHQ9IjE3OTIiPjxwYXRoIGQ9Ik0xNTk1IDI5NXExNyA0MS0xNCA3MGwtNDkzIDQ5M3Y3NDJxMCA0Mi0zOSA1OS0xMyA1LTI1IDUtMjcgMC00NS0xOWwtMjU2LTI1NnEtMTktMTktMTktNDVWODU4TDIxMSAzNjVxLTMxLTI5LTE0LTcwIDE3LTM5IDU5LTM5aDEyODBxNDIgMCA1OSAzOXoiLz48L3N2Zz4="
            className="navbar__icon2"
            alt="filter"
          />
        </button>
        <button
          onClick={() => fileInputRef.current.click()}
          className="btn btn-primary"
          disabled={loading}
          style={{ marginLeft: "350px" }}
        >
          {loading ? "Predicting..." : "Upload & Predict"}
        </button>
      </div>

      {/* Column Selector Modal */}
      {showColumnSelector && (
        <div style={{ clear: "both", marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Select Columns:</label>
          <select
            multiple
            value={visibleColumns}
            onChange={handleColumnToggle}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              padding: "0.5rem",
            }}
          >
            {allColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Table Section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.95rem",
        }}
      >
        <thead>
          <tr>
            {visibleColumns.map((key) => (
              <th
                key={key}
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "1px solid #eaeaea",
                }}
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {predictions.length === 0 ? (
            <tr>
              <td
                colSpan={visibleColumns.length}
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  opacity: 0.6,
                }}
              >
                Customer predictions will appear here after file upload
              </td>
            </tr>
          ) : (
            paginatedData.map((row, i) => (
              <tr key={i}>
                {visibleColumns.map((key, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "0.75rem",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {key === "churn" ? (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          backgroundColor:
                            row.churn === "Yes" ? "#ffe6e6" : "#e6ffe6",
                          color: "#000",
                          border: `1px solid ${
                            row.churn === "Yes" ? "#d9534f" : "#5cb85c"
                          }`,
                          fontWeight: "500",
                        }}
                      >
                        {row.churn}
                      </span>
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="navbar__icon-button2"
          style={{ marginRight: "1rem" }}
        >
          <img
            src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGQ9Ik0xODkuMyAxMjguNEw4OSAyMzMuNGMtNiA1LjgtOSAxMy43LTkgMjIuNHMzIDE2LjUgOSAyMi40bDEwMC4zIDEwNS40YzExLjkgMTIuNSAzMS4zIDEyLjUgNDMuMiAwIDExLjktMTIuNSAxMS45LTMyLjcgMC00NS4yTDE4NC40IDI4OGgyMTdjMTYuOSAwIDMwLjYtMTQuMyAzMC42LTMycy0xMy43LTMyLTMwLjYtMzJoLTIxN2w0OC4yLTUwLjRjMTEuOS0xMi41IDExLjktMzIuNyAwLTQ1LjItMTItMTIuNS0zMS4zLTEyLjUtNDMuMyAweiIvPjxtZXRhZGF0YT48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnJkZnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PHJkZjpEZXNjcmlwdGlvbiBhYm91dD0iaHR0cHM6Ly9pY29uc2NvdXQuY29tL2xlZ2FsI2xpY2Vuc2VzIiBkYzp0aXRsZT0iYXJyb3csbGVmdCxjIiBkYzpkZXNjcmlwdGlvbj0iYXJyb3csbGVmdCxjIiBkYzpwdWJsaXNoZXI9Ikljb25zY291dCIgZGM6ZGF0ZT0iMjAxNy0wOS0yNCIgZGM6Zm9ybWF0PSJpbWFnZS9zdmcreG1sIiBkYzpsYW5ndWFnZT0iZW4iPjxkYzpjcmVhdG9yPjxyZGY6QmFnPjxyZGY6bGk+QmVuamFtaW4gSiBTcGVycnk8L3JkZjpsaT48L3JkZjpCYWc+PC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L21ldGFkYXRhPjwvc3ZnPg=="
            className="navbar__icon2"
            alt="filter"
          />
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filtered.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev * itemsPerPage < filtered.length ? prev + 1 : prev
            )
          }
          disabled={currentPage * itemsPerPage >= filtered.length}
          className="navbar__icon-button2"
        >
          <img
            src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJtMzIyLjcgMTI4LjQgMTAwLjMgMTA1YzYgNS44IDkgMTMuNyA5IDIyLjRzLTMgMTYuNS05IDIyLjRMMzIyLjcgMzgzLjZjLTExLjkgMTIuNS0zMS4zIDEyLjUtNDMuMiAwLTExLjktMTIuNS0xMS45LTMyLjcgMC00NS4ybDQ4LjItNTAuNGgtMjE3Yy0xNyAwLTMwLjctMTQuMy0zMC43LTMyczEzLjctMzIgMzAuNi0zMmgyMTdsLTQ4LjItNTAuNGMtMTEuOS0xMi41LTExLjktMzIuNyAwLTQ1LjIgMTItMTIuNSAzMS4zLTEyLjUgNDMuMyAweiIvPjwvc3ZnPg=="
            className="navbar__icon2"
            alt="filter"
          />
        </button>
      </div>
    </div>
  );
};

export default PredictionsPage;
