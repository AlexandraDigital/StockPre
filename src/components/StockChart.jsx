import React from 'react';

const StockChart = ({ data, type, title }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-80 bg-slate-900 rounded flex items-center justify-center text-slate-500">
        <p>Chart: {type}</p>
      </div>
    </div>
  );
};

export default StockChart;
