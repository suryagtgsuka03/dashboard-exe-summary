import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const API_URL = 'https://sw.infoglobal.id/nirmala/backend/get-all-wp'; // Ganti dengan URL API yang sesuai

const ProgressBarChart = () => {
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState('Sandbox'); // Ganti dengan proyek default

  useEffect(() => {
    // Ambil data dari API
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // Buat daftar proyek unik dari data
  const uniqueProjects = [...new Set(data.map((item) => item.project_name))];

  // Filter data berdasarkan project_name yang dipilih
  const filteredData = data.filter((item) => item.project_name === selectedProject);

  // Ambil wp_name dan percentage_done untuk grafik
  const chartData = {
    labels: filteredData.map((item) => item.wp_name),
    datasets: [
      {
        label: 'Percentage Done',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: filteredData.map((item) => item.percentage_done),
      },
    ],
  };

  return (
    <div>
      <DropdownButton
        title={selectedProject}
        onSelect={(eventKey) => setSelectedProject(eventKey)}
      >
        {uniqueProjects.map((project) => (
          <Dropdown.Item key={project} eventKey={project}>
            {project}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <Bar data={chartData} />
    </div>
  );
};

export default ProgressBarChart;
