import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:9000/api/crimedata')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center' }}>Loading...</div>;
    }

    // Filter and format data for chart
    const years = data.map(item => item.Year);
    const violentRates = data.map(item => parseFloat(item['Data.Rates.Violent.All']));
    const propertyRates = data.map(item => parseFloat(item['Data.Rates.Property.All']));

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Crime Statistics Dashboard</h2>
            <Plot
                data={[
                    {
                        x: years,
                        y: violentRates,
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Violent Crime Rate',
                        marker: { color: 'red' },
                    },
                    {
                        x: years,
                        y: propertyRates,
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Property Crime Rate',
                        marker: { color: 'blue' },
                    },
                ]}
                layout={{ width: 800, height: 500, title: 'Crime Rates Over Years' }}
            />
        </div>
    );
};

export default Dashboard;
