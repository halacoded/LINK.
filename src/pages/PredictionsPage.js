import React, { useState, useEffect, useRef } from "react";
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

const defaultColumns = [
  "gender",
  "SeniorCitizen",
  "tenure",
  "Contract",
  "MonthlyCharges",
  "TotalCharges",
  "prediction",
  "churn",
];

const PredictionsPage = () => {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [searchTerm, setSearchTerm] = useState("");
  const [churnFilter, setChurnFilter] = useState("All");
  const itemsPerPage = 10;
  const hasFetched = useRef(false);

  // Filtering logic
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

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const enriched = await getBatchPrediction(file);
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
    <div className="page-container" style={{ padding: "2rem" }}>
      <h1>Predictions Page</h1>

      {predictions.length === 0 ? (
        <p>No prediction data found. Please upload a customer file below.</p>
      ) : (
        <>
          <h2>Churn Prediction Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={paginatedData.map((row, i) => ({
                index: (currentPage - 1) * itemsPerPage + i + 1,
                churn: row.churn === "Yes" ? 1 : 0,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="churn"
                stroke="#ff6347"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Search and Filter Controls */}
          <div style={{ margin: "1rem 0" }}>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginRight: "1rem" }}
            />

            <select
              value={churnFilter}
              onChange={(e) => setChurnFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Yes">Churned</option>
              <option value="No">Retained</option>
            </select>
          </div>

          {/* Column Selector */}
          <label>Select Columns to Display:</label>
          <select
            multiple
            value={visibleColumns}
            onChange={handleColumnToggle}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            {allColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          {/* Customer Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {visibleColumns.map((key) => (
                  <th
                    key={key}
                    style={{
                      padding: "0.5rem",
                      textAlign: "left",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr key={i}>
                  {visibleColumns.map((key, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "0.5rem",
                        borderBottom: "1px solid #eee",
                        color:
                          key === "churn"
                            ? row[key] === "Yes"
                              ? "#d9534f"
                              : "#5cb85c"
                            : "inherit",
                      }}
                    >
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ marginRight: "1rem" }}
            >
              Previous
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
              style={{ marginLeft: "1rem" }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* File Upload */}
      <div style={{ marginTop: "2rem" }}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "1rem" }}
        />
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Predicting..." : "Upload & Predict"}
        </button>
      </div>
    </div>
  );
};

export default PredictionsPage;
