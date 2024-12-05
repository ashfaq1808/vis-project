const chart_types_map = {
    "Bar Chart" : "bar",
    "Line Chart" : "line",
}
const crime_types = [
    "Property Burglary",
    "Property Larceny",
    "Property Motor",
    "Violent Assault",
    "Violent Murder",
    "Violent Rape",
    "Violent Robbery"
];
const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
];
const years = [
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "2009",
    "2008",
    "2007",
    "2006",
    "2005",
    "2004",
    "2003",
    "2002",
    "2001",
    "2000"
]

const colour_codes = [
    "#065321",  
    "#1e8379",  
    "#a548ff",  
    "#77f99b",  
    "#7aade2",  
    "#bf9539",  
    "#862b88",  
    "#44aca4",  
    "#cf6144",  
    "#eb407e",  
    "#35c782",  
    "#5952cc",  
    "#56f74f",  
    "#4cccdb",  
    "#c77ea5",  
    "#fc2146",  
    "#32177a",  
    "#5761b6",  
    "#4835e5",  
    "#58fb65",  
    "#841923",  
    "#aff3ea",  
    "#41eac9",  
    "#7b5a7c",  
    "#a8ca99",  
    "#16a7e0",  
    "#171806",  
    "#37bf43",  
    "#38a26b",  
    "#2d4e9b",  
    "#2f21d5",  
    "#11fc56",  
    "#d023c4",  
    "#13b4e2",  
    "#0e7ebf",  
    "#e7d99c",  
    "#d40f19",  
    "#fed182",  
    "#af2139",  
    "#93e2b7",  
    "#a062c5",  
    "#6515ce",  
    "#183a35",  
    "#fb11b3",  
    "#a174d7",  
    "#cc2f8f",  
    "#dacb9a",  
    "#68c42c",  
    "#86c5b8",  
    "#701063",  
    "#bdd67e"
];

function populateDropdown(dropdownMenu, items, buttonId, graphId) {
    items.forEach((item) => {
        const menuItem = document.createElement("a");
        menuItem.className = "dropdown-item";
        menuItem.href = "#";
        menuItem.textContent = item;
        menuItem.addEventListener("click", (e) => {
            e.preventDefault();
            const button = document.getElementById(buttonId); // Get the corresponding button
            button.textContent = item; // Update button text
            updateGraph(graphId); // Render the chart
        });
        dropdownMenu.appendChild(menuItem);
    });
}

populateDropdown(
    document.getElementById("crimeTypeDropDownLeft"),
    crime_types,
    "crimeTypeDropDownButtonLeft",
    "graphLeft"
);
populateDropdown(
    document.getElementById("crimeTypeDropDownRight"),
    crime_types,
    "crimeTypeDropDownButtonRight",
    "graphRight"
);
populateDropdown(
    document.getElementById('yearDropdownLeft'),
    years,
    "yearDropDownButtonLeft",
    "graphLeft"
);
populateDropdown(
    document.getElementById('yearDropdownRight'),
    years,
    "yearDropDownButtonRight",
    "graphRight"
);
populateDropdown(
    document.getElementById("graphTypeDropdownMenuRight"),
    Object.keys(chart_types_map),
    "graphTypeDropdownRight",
    "graphRight"
);
populateDropdown(
    document.getElementById("graphTypeDropdownMenuLeft"),
    Object.keys(chart_types_map),
    "graphTypeDropdownLeft",
    "graphLeft"
);

function updateGraph(graphId) {
    const graphCanvas = document.getElementById(graphId);
    const crime = document.getElementById(
        graphId === "graphLeft" ? "crimeTypeDropDownButtonLeft" : "crimeTypeDropDownButtonRight"
    ).textContent.trim();
    const graphType = document.getElementById(
        graphId === "graphLeft" ? "graphTypeDropdownLeft" : "graphTypeDropdownRight"
    ).textContent.trim();
    const graphYear = document.getElementById(
        graphId === "graphLeft" ? "yearDropDownButtonLeft" : "yearDropDownButtonRight"
    ).textContent.trim();
   
    if( crime != "Type of Crime" && graphType != "Select Graph Type" && graphYear){
        console.log(crime);
        console.log(graphType);
        console.log(graphYear);
        if (graphCanvas.chart) {
            graphCanvas.chart.destroy();
        }
        
        fetch('http://localhost:9000/api/CrimeType', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ year: graphYear, crime_type :crime}), // Send the selected year as JSON
        })
        .then(response => response.json())
        .then(result =>{
            const data = {
                labels: Object.keys(result),
                datasets: [
                    {
                        label: `Data for ${crime}`,
                        data: Object.values(result),
                        backgroundColor: colour_codes,
                        borderColor: colour_codes,
                        borderWidth: 1,
                    },
                ],
            };
            console.log(chart_types_map)
            console.log(chart_types_map[graphType])
            graphCanvas.chart = new Chart(graphCanvas, {
                type: chart_types_map[graphType],
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: `Graph Type: ${graphType}`,
                        },
                    },
                },
            });
        });
       
    }
}