import React, { useState } from "react";
import { getBatchPrediction } from "../api/Insights";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PredictionsPage = () => {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const result = await getBatchPrediction(file);

      const formatted = result.map((val, i) => ({
        index: i + 1,
        churnProbability: val,
      }));
      setPredictions(formatted);
    } catch (error) {
      console.error("Upload or prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <h1>📈 Predictions Page</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: "1rem" }}
      />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Predicting..." : "Upload & Predict"}
      </button>

      {predictions.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Churn Distribution Across Uploaded Data</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="index"
                label={{
                  value: "User Index",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                domain={[0, 1]}
                label={{
                  value: "Churn Probability",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="churnProbability"
                stroke="#ff6347"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PredictionsPage;
