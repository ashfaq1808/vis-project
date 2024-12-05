const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const crime_type_json = {
    "All Property Crimes" : "Data.Totals.Property.All",
    "All Violent Crimes" : "Data.Totals.Violent.All",
    "Property Burglary" : "Data.Totals.Property.Burglary",
    "Property Larceny" : "Data.Totals.Property.Larceny",
    "Property Motor" : "Data.Totals.Property.Motor",
    "Violent Assault" : "Data.Totals.Violent.Assault",
    "Violent Murder" : "Data.Totals.Violent.Murder",
    "Violent Rape" : "Data.Totals.Violent.Rape",
    "Violent Robbery" :"Data.Totals.Violent.Robbery",
}
const app = express();
const results = [];

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON
app.use(bodyParser.json());
app.options('/api/crimedata', cors());
app.post('/api/crimedata', (req, res) => {
    const { year,crime_type,state } = req.body; // Get the year from the request body
    const filePath = path.join(__dirname, 'newCrimeData.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ message: 'Failed to read file' });
        }

        try {
            const jsonData = JSON.parse(data);
            const crimeDataForYear = jsonData.filter(entry => entry.Year === parseInt(year) );

            if (crimeDataForYear.length === 0) {
                return res.status(404).json({ message: `No data found for the year ${year}` });
            }
            let groupedData;
            if(state == "All"){
                groupedData = crimeDataForYear.reduce((acc, curr) => {
                    if(crime_type == "All Crimes"){
                        acc[curr.State.toLowerCase()] = curr['Data.Totals.Property.All'] + curr['Data.Totals.Violent.All'] || 0;
                    } else{
                        acc[curr.State.toLowerCase()] = curr[crime_type_json[crime_type]]|| 0;
                    }
                    return acc;
                }, {});
            } else {
                for(let i=0; i <crimeDataForYear.length;i++){
                    if(crimeDataForYear[i].State == state){
                        groupedData = {
                            "Property Burglary" : crimeDataForYear[i]["Data.Totals.Property.Burglary"],
                            "Property Larceny" : crimeDataForYear[i]["Data.Totals.Property.Larceny"],
                            "Property Motor" : crimeDataForYear[i]["Data.Totals.Property.Motor"],
                            "Violent Assault" : crimeDataForYear[i]["Data.Totals.Violent.Assault"],
                            "Violent Murder" : crimeDataForYear[i]["Data.Totals.Violent.Murder"],
                            "Violent Rape" : crimeDataForYear[i]["Data.Totals.Violent.Rape"],
                            "Violent Robbery" :crimeDataForYear[i]["Data.Totals.Violent.Robbery"],
                        }
                    }
                }
            }
            res.json(groupedData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ message: 'Failed to parse JSON data' });
        }
    });
});

app.post('/api/CrimeType', (req, res) => {
    const { year,crime_type } = req.body;
    const filePath = path.join(__dirname, 'newCrimeData.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ message: 'Failed to read file' });
        }
        try {
            const jsonData = JSON.parse(data);
            const crimeDataForYear = jsonData.filter(entry => entry.Year === parseInt(year) );

            if (crimeDataForYear.length === 0) {
                return res.status(404).json({ message: `No data found for the year ${year}` });
            }
            let groupedData;
            groupedData = crimeDataForYear.reduce((acc, curr) => {
                console.log(crime_type)
                console.log(curr[crime_type_json[crime_type]])
                acc[curr.State.toLowerCase()] = curr[crime_type_json[crime_type]]|| 0;
                // }
                return acc;
            }, {});
            res.json(groupedData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ message: 'Failed to parse JSON data' });
        }
    });
});


const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Waiting for data requests...');
});
