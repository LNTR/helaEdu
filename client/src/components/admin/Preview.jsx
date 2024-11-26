import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Preview({ data = [], title, description }) {
  if (!data || data.length === 0) {
    return (
      <div className="px-14 py-14 rounded-xl shadow-xl">
        <h1 className="text-3xl text-blue my-6">Report Preview</h1>
        <h2 className="text-2xl mb-4">{title}</h2>
        <p className="text-lg mb-6">{description}</p>
        <p className="text-red-500 text-xl">No data available to display.</p>
      </div>
    );
  }

  return (
    <div className="px-14 py-14 rounded-xl shadow-xl">
      <h1 className="text-3xl text-blue my-6">Report Preview</h1>
      <h2 className="text-2xl mb-4">{title}</h2>
      <p className="text-lg mb-6">{description}</p>

      <div className="my-10">
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </div>

      <table className="table-auto w-full text-left border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.date}</td>
              <td className="border px-4 py-2">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
