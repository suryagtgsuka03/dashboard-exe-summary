import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import { Container, Row } from "react-bootstrap";
import axios from "axios";

function Progress() {
  const [projectProgress, setProjectProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get("https://sw.infoglobal.id/nirmala/backend/get-progress-project");
      const data = response.data;
      setProjectProgress(data);
      setLoading(false); // Data fetched, set loading to false
      console.log("Data fetched successfully:", data);
    } catch (error) {
      setLoading(false); // Error occurred, set loading to false
      console.error("Error fetching data:", error);
    }
  }

  const handleBarClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = projectProgress[clickedIndex]?.project_name;
      if (clickedLabel) {
        window.location.href = `/nirmala/projectdetails/${clickedLabel}`;
      }
    }
  };

  const options = {
    indexAxis: "y",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        stepSize: 20,
      },
    },
    onClick: handleBarClick,
  };

  const labels = projectProgress.map((data) => data.project_name);
  console.log("PROJECT NAME", labels);
  const datasets = [
    {
      label: "Work Packages Total",
      data: projectProgress.map((data) => data.progress.wp_total),
      fill: false,
      backgroundColor: ["#2076BD"],
    },
  ];
  console.log("WP TOTAL", datasets);

  return (
    <div className="Progress">
      <Container className="progress-box">
        <Row className="chart-info">
          <div className="title-count">Project Progress</div>
        </Row>
        <hr
          style={{
            marginTop: "82px",
            height: "2px",
            background: "black",
            border: "none",
          }}
        />
        <Row>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <BarChart
                chartData={{ labels, datasets }}
                options={{
                  ...options,
                }}
              />
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Progress;
