import React, { useState, useEffect } from 'react';
import { dataAPI } from '../api';

const DataViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const response = await dataAPI.getAllData();
      setData(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchAllData}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No data available</h2>
      </div>
    );
  }

  const renderTable = (tableData, tableName) => {
    if (!tableData || tableData.length === 0) {
      return <p>No data available for {tableName}</p>;
    }

    const columns = Object.keys(tableData[0]);

    return (
      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#2563eb', color: 'white' }}>
              {columns.map(column => (
                <th key={column} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white' }}>
                {columns.map(column => (
                  <td key={column} style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {row[column] !== null ? String(row[column]) : 'NULL'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '10px' }}>Database Data Viewer</h1>
        <button 
          onClick={fetchAllData}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {['users', 'trainees', 'trainings'].map(table => (
          <button
            key={table}
            onClick={() => setActiveTab(table)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: activeTab === table ? '#2563eb' : '#e5e7eb',
              color: activeTab === table ? 'white' : '#374151',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {table} ({data[table]?.length || 0})
          </button>
        ))}
      </div>

      <div>
        <h2 style={{ color: '#2563eb', marginBottom: '15px', textTransform: 'capitalize' }}>
          {activeTab} Table ({data[activeTab]?.length || 0} records)
        </h2>
        {renderTable(data[activeTab], activeTab)}
      </div>
    </div>
  );
};

export default DataViewer;
