import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from '@components/Chart/Chart';

export default function VotesG() {
  const data = {
    labels: ['2024-08-10', '2024-08-11', '2024-08-12', '2024-08-13', '2024-08-14', '2024-08-15'],
    datasets: [
      {
        label: 'Votes Earned for Articles',
        data: [3, 3, -2, 2, 6, -1],
        backgroundColor: (ctx) =>
          ctx.raw >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Votes Over Time' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Votes' },
      },
    },
  };

  return (
    <Chart>
      <div style={{ width: 'full',height:'400px' , margin: '3 auto' }}>
        <Bar data={data} options={options} />
      </div>
    </Chart>
  );
}