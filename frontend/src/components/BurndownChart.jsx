import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Dropdown, Row, Col, Button } from "react-bootstrap";

function BurndownChart() {
  const [selectedView, setSelectedView] = useState("BurnUp");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState({
    BurnDown: null,
    BurnUp: null,
  });
  const [loading, setLoading] = useState(true);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleYearChange = (eventKey) => {
    setSelectedYear(parseInt(eventKey));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://sw.infoglobal.id/nirmala/backend/get-burndown-chart-overview"
        );
        const data = await response.json();
        console.log("DATA", data);
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const doneData = months.map(() => 0);
        const addedData = months.map(() => 0);

        let cumulativeDoneTotal = 0;
        let cumulativeAddedTotal = 0;
        let totalPlanWork = 0;

        const cumulativeDoneData = doneData.map((value) => {
          cumulativeDoneTotal += value;
          return cumulativeDoneTotal;
        });
        const cumulativeAddedData = addedData.map((value) => {
          cumulativeAddedTotal += value;
          return cumulativeAddedTotal;
        });

        const selectedYearData = data.find(
          (item) => item.year === selectedYear.toString()
        );

        if (selectedYearData && selectedYearData.progress) {
          selectedYearData.progress.forEach((item) => {
            const index = months.indexOf(item.month);
            if (index !== 1) {
              if (index === 0) {
                cumulativeDoneTotal = item.wp_done;
                cumulativeAddedTotal = item.wp_on_going;
              } else {
                cumulativeDoneTotal += item.wp_done;
                cumulativeAddedTotal += item.wp_on_going;
              }

              totalPlanWork = item.wp_done - 1 + item.wp_on_going;

              cumulativeDoneData[index] = cumulativeDoneTotal;
              cumulativeAddedData[index] = cumulativeAddedTotal;
            }
          });

          for (let i = 1; i < months.length; i++) {
            if (cumulativeDoneData[i] === 0) {
              cumulativeDoneData[i] = cumulativeDoneData[i - 1];
            }
            if (cumulativeAddedData[i] === 0) {
              cumulativeAddedData[i] = cumulativeAddedData[i - 1];
            }
          }

          const remainingWorkData = cumulativeAddedData.map((value) => {
            return totalPlanWork - value;
          });

          setChartData({
            ...chartData,
            BurnUp: {
              labels: months,
              datasets: [
                {
                  label: "Added",
                  data: cumulativeAddedData,
                  borderColor: "#A155B9",
                  backgroundColor: "#A155B9",
                  borderWidth: 5,
                  fill: false,
                },
                {
                  label: "Done",
                  data: cumulativeDoneData,
                  borderColor: "#165BAA",
                  backgroundColor: "#165BAA",
                  borderWidth: 5,
                  fill: false,
                },
              ],
              options: {
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                  },
                },
                aspectRatio: 3,
              },
            },
            BurnDown: {
              labels: months,
              datasets: [
                {
                  label: "Remaining",
                  data: remainingWorkData,
                  borderColor: "#A155B9",
                  backgroundColor: "#A155B9",
                  borderWidth: 5,
                  fill: false,
                },
              ],
              options: {
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                  },
                },
                aspectRatio: 3,
              },
            },
          });

          setLoading(false);
        } else {
          setChartData(null);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div className="BurdownAll">
      <div className="burdownall-box">
        <Row className="chart-info">
          <Col className="d-flex justify-content-end">
            <Button
              style={{
                marginRight: "10px",
                height: "33px",
                width: "auto",
                fontWeight: selectedView === "BurnUp" ? "normal" : "normal",
              }}
              className="refresh-button"
              onClick={() => handleViewChange("BurnUp")}
              variant={selectedView === "BurnUp" ? "primary" : "secondary"}>
              Burn Up
            </Button>

            <Button
              style={{
                marginRight: "10px",
                width: "auto",
                height: "33px",
                fontWeight: selectedView === "BurnDown" ? "normal" : "normal",
              }}
              className="refresh-button"
              onClick={() => handleViewChange("BurnDown")}
              variant={selectedView === "BurnDown" ? "primary" : "secondary"}>
              Burn Down
            </Button>
            <Dropdown className="dropdown-custom" onSelect={handleYearChange}>
              <Dropdown.Toggle variant="secondary" id="yearSelect">
                {selectedYear}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>Select Year</Dropdown.Item>
                {[0, 1, 2, 3, 4].map((index) => (
                  <Dropdown.Item key={index} eventKey={currentYear + index}>
                    {currentYear + index}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <hr
          style={{
            marginTop: "0px",
            height: "2px",
            background: "black",
            border: "none",
          }}
        />
        <div style={{ height: "350px" }}>
          {loading ? (
            <div>Loading...</div>
          ) : chartData[selectedView] ? (
            <Line
              data={chartData[selectedView]}
              options={chartData[selectedView].options}
            />
          ) : (
            <div>Error: Data not available..</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BurndownChart;
