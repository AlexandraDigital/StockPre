import React from 'react';

const StockInfo = ({ data }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
      <h2 className="text-2xl font-bold mb-4">{data?.name || 'Stock Info'}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-slate-400 text-sm">Price</p>
          <p className="text-xl font-semibold">${data?.price || 'N/A'}</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Change</p>
          <p className="text-xl font-semibold">{data?.change || 'N/A'}%</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">High</p>
          <p className="text-xl font-semibold">${data?.high || 'N/A'}</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Low</p>
          <p className="text-xl font-semibold">${data?.low || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;
