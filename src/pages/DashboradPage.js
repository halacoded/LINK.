import React, { useEffect, useState, useMemo } from "react";
import { getSavedPredictions } from "../api/Insights";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getMe } from "../api/User";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import "../styles/NavbarHome.css";
const DashboardPage = () => {
  const [stats, setStats] = useState({
    customers: 0,
    revenue: 0,
    churnRate: 0,
    avgMonthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { data: allUsers = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });
  const [charts, setCharts] = useState({});
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });
  const companyUsers = useMemo(() => {
    if (!currentUser || !Array.isArray(allUsers)) return [];
    return allUsers.filter(
      (user) =>
        String(user._id) !== String(currentUser._id) &&
        user.Company === currentUser.Company
    );
  }, [currentUser, allUsers]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const predictionsData = await getSavedPredictions();
        console.log("📊 Fetched predictions:", predictionsData);

        if (Array.isArray(predictionsData) && predictionsData.length > 0) {
          const total = predictionsData.length;
          const totalRevenue = predictionsData.reduce((sum, row) => {
            const value = parseFloat(row.TotalCharges);
            return sum + (isNaN(value) ? 0 : value);
          }, 0);

          const monthlySum = predictionsData.reduce((sum, row) => {
            const value = parseFloat(row.MonthlyCharges);
            return sum + (isNaN(value) ? 0 : value);
          }, 0);

          const avgMonthlyRevenue = (monthlySum / total).toFixed(2);
          const churnCount = predictionsData.filter(
            (row) => row.churn === "Yes"
          ).length;
          const churnDistribution = [
            {
              name: "Churned",
              value: predictionsData.filter((r) => r.churn === "Yes").length,
            },
            {
              name: "Active",
              value: predictionsData.filter((r) => r.churn === "No").length,
            },
          ];

          const contractTypes = ["Month-to-month", "One year", "Two year"];
          const contractCounts = contractTypes.map((type) => ({
            name: type,
            value: predictionsData.filter((r) => r.Contract === type).length,
          }));

          const revenueByContract = contractTypes.map((type) => {
            const total = predictionsData
              .filter((r) => r.Contract === type)
              .reduce((sum, r) => sum + (parseFloat(r.TotalCharges) || 0), 0);
            return { name: type, revenue: total.toFixed(2) };
          });

          const monthlyTrend = predictionsData.slice(0, 20).map((r, i) => ({
            index: i + 1,
            MonthlyCharges: parseFloat(r.MonthlyCharges) || 0,
          }));
          const churnByPayment = {};
          predictionsData.forEach((r) => {
            const key = r.PaymentMethod || "Unknown";
            if (!churnByPayment[key])
              churnByPayment[key] = { name: key, churned: 0, total: 0 };
            churnByPayment[key].total += 1;
            if (r.churn === "Yes") churnByPayment[key].churned += 1;
          });
          const churnByPaymentArray = Object.values(churnByPayment).map(
            (obj) => ({
              name: obj.name,
              rate: ((obj.churned / obj.total) * 100).toFixed(1),
            })
          );

          const internetChurn = {};
          predictionsData.forEach((r) => {
            const key = r.InternetService || "Unknown";
            if (!internetChurn[key])
              internetChurn[key] = { name: key, churned: 0, total: 0 };
            internetChurn[key].total += 1;
            if (r.churn === "Yes") internetChurn[key].churned += 1;
          });
          const internetChurnArray = Object.values(internetChurn).map(
            (obj) => ({
              name: obj.name,
              rate: ((obj.churned / obj.total) * 100).toFixed(1),
            })
          );

          const seniorChurn = [
            {
              name: "Senior",
              value: predictionsData.filter(
                (r) => r.SeniorCitizen === "1" && r.churn === "Yes"
              ).length,
            },
            {
              name: "Non-Senior",
              value: predictionsData.filter(
                (r) => r.SeniorCitizen === "0" && r.churn === "Yes"
              ).length,
            },
          ];

          const partnerDependents = ["Partner", "Dependents"];
          const partnerImpact = partnerDependents.map((key) => ({
            name: key,
            churned: predictionsData.filter(
              (r) => r[key] === "Yes" && r.churn === "Yes"
            ).length,
          }));

          const streamingChurn = ["StreamingTV", "StreamingMovies"].map(
            (key) => ({
              name: key,
              churned: predictionsData.filter(
                (r) => r[key] === "Yes" && r.churn === "Yes"
              ).length,
            })
          );

          setStats({
            customers: total,
            revenue: totalRevenue.toFixed(2),
            churnRate: ((churnCount / total) * 100).toFixed(1),
            avgMonthlyRevenue,
          });

          setCharts({
            churnDistribution,
            contractCounts,
            revenueByContract,
            monthlyTrend,
            churnByPaymentArray,
            internetChurnArray,
            seniorChurn,
            partnerImpact,
            streamingChurn,
          });
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="left-content">
        <h3>CUSTOMERS OVERVIEW</h3>
        <p>Insight into customers at risk of leaving the company</p>
      </div>

      {/* Stat Boxes - Top Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <StatBox title="Total Customers" value={stats.customers} />
        <StatBox title="Total Revenue (USD)" value={stats.revenue} />
        <StatBox title="Churn Rate (%)" value={stats.churnRate} />
        <StatBox title="Avg Monthly Revenue" value={stats.avgMonthlyRevenue} />
      </div>

      {/* Pie Charts + Team List Row */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        {/* Pie Charts - Left Side */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flex: "3",
            backgroundColor: "#ffffffff",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: "250px",
            width: "600px",
          }}
        >
          {/* Churn Overview Pie */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.25rem 0" }}>
              Churn Overview
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={charts.churnDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={60}
                  label={{ fontSize: 10 }}
                >
                  <Cell fill="#dc3545" />
                  <Cell fill="#28a745" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Contract Distribution Pie */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.25rem 0" }}>
              Contract Distribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={charts.contractCounts}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={60}
                  label={{ fontSize: 10 }}
                >
                  <Cell fill="#007bff" />
                  <Cell fill="#ffc107" />
                  <Cell fill="#17a2b8" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Senior Citizen Churn Pie */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.25rem 0" }}>
              Senior Citizen Churn
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={charts.seniorChurn}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={60}
                  label={{ fontSize: 10 }}
                >
                  <Cell fill="#fd7e14" />
                  <Cell fill="#6c757d" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side - Team List */}
        {companyUsers.length > 0 && (
          <div
            style={{
              minWidth: "240px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffffff",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                height: "250px",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                Team Members
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {companyUsers.slice(0, 4).map((user) => (
                  <div
                    key={user._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <img
                      src={
                        user.ProfileImage
                          ? `http://localhost:8000/${user.ProfileImage}`
                          : "/default-avatar.png"
                      }
                      alt={user.Username}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "0.5rem",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: "0",
                          padding: "0",
                        }}
                      >
                        {user.Username || "Unnamed"}
                      </h4>

                      <p
                        style={{
                          fontSize: "0.7rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: "0",
                          padding: "0",
                        }}
                      >
                        {user.Email || "No email"}
                      </p>
                    </div>
                    {user.Email && (
                      <a
                        href={`mailto:${user.Email}`}
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.7rem",
                          whiteSpace: "nowrap",
                        }}
                        className="btn btn-primary"
                      >
                        Chat
                      </a>
                    )}
                  </div>
                ))}
                {companyUsers.length > 4 && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#6c757d",
                      textAlign: "center",
                      padding: "0.25rem",
                    }}
                  >
                    +{companyUsers.length - 4} more team members
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Trend Line Chart - Compact */}
      <div
        style={{
          marginBottom: "0.5rem",
          height: "250px",
          width: "600px",

          backgroundColor: "#ffffffff",

          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h4 style={{ fontSize: "0.9rem", margin: "0 0 1rem 0" }}>
          Monthly Charges Trend
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={charts.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="MonthlyCharges"
              stroke="#007bff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* All Bar Charts in Single Row */}
      <div
        style={{
          display: "flex",
          gap: "0rem",
          marginBottom: "0.5rem",
          position: "relative",
          transform: "translateY(20%)",

          backgroundColor: "#ffffffff",

          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Revenue by Contract */}
        <div style={{ flex: "1 1 300px", marginLeft: "50px" }}>
          <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.25rem 0" }}>
            Revenue by Contract
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={charts.revenueByContract}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width={65} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Churn by Payment Method */}
        <div style={{ flex: "1 1 300px" }}>
          <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.25rem 0" }}>
            Churn by Payment
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={charts.churnByPaymentArray}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#6f42c1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Internet Service vs Churn */}
        <div style={{ flex: "1 1 300px" }}>
          <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.25rem 0" }}>
            Internet Service Churn
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={charts.internetChurnArray}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#20c997" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Partner & Dependents */}
        <div style={{ flex: "1 1 300px" }}>
          <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.25rem 0" }}>
            Partner & Dependents
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={charts.partnerImpact}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="churned" fill="#17a2b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Streaming Services */}
        <div style={{ flex: "1 1 300px" }}>
          <h4 style={{ fontSize: "0.9rem", margin: "0 0 0.25rem 0" }}>
            Streaming Services
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={charts.streamingChurn}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="churned" fill="#ffc107" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ title, value, color }) => (
  <div
    style={{
      flex: "1 1 200px",
      backgroundColor: "#ffffffff",
      borderLeft: `6px solid ${color}`,
      padding: "1rem 1.25rem",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    }}
  >
    <h4 style={{ marginBottom: "0.5rem", color: "#000" }}>{title}</h4>
    <h5 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#000" }}>
      {value}
    </h5>
  </div>
);

export default DashboardPage;
