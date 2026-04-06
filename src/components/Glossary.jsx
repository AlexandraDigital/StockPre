import React from 'react';

const Glossary = () => {
  const terms = [
    { term: 'Candlestick', definition: 'A chart showing opening, closing, high, and low prices.' },
    { term: 'Moving Average', definition: 'Average price over a specified period.' },
    { term: 'Volume', definition: 'Number of shares traded during a period.' },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mt-8">
      <h2 className="text-2xl font-bold mb-4">Glossary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {terms.map((item, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-blue-400 mb-2">{item.term}</h3>
            <p className="text-slate-300">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Glossary;
