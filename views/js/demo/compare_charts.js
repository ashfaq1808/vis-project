// Example data
const chart_types_map = {
    "Bar Chart" : "bar",
    "Doughnut Chart" : "doughnut",
    "Line Chart" : "line",
    "Polar Area Chart" : "polarArea",
    "Radar Chart" : "radar",
}

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
// Function to populate dropdowns
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
    document.getElementById("stateDropdownMenuLeft"),
    states,
    "stateDropdownLeft",
    "graphLeft"
);
populateDropdown(
    document.getElementById("graphTypeDropdownMenuLeft"),
    Object.keys(chart_types_map),
    "graphTypeDropdownLeft",
    "graphLeft"
);
populateDropdown(
    document.getElementById("stateDropdownMenuRight"),
    states,
    "stateDropdownRight",
    "graphRight"
);
populateDropdown(
    document.getElementById("graphTypeDropdownMenuRight"),
    Object.keys(chart_types_map),
    "graphTypeDropdownRight",
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

function updateGraph(graphId) {
    const graphCanvas = document.getElementById(graphId);
    const state = document.getElementById(
        graphId === "graphLeft" ? "stateDropdownLeft" : "stateDropdownRight"
    ).textContent.trim();
    const graphType = document.getElementById(
        graphId === "graphLeft" ? "graphTypeDropdownLeft" : "graphTypeDropdownRight"
    ).textContent.trim();
    const graphYear = document.getElementById(
        graphId === "graphLeft" ? "yearDropDownButtonLeft" : "yearDropDownButtonRight"
    ).textContent.trim();
   
    if( state != "Select State" && graphType != "Select Graph Type" && graphYear){
        console.log(state);
        console.log(graphType);
        console.log(graphYear);
        if (graphCanvas.chart) {
            graphCanvas.chart.destroy();
        }
        crime_types = [
            "Burglary",
            "Larceny",
            "Motor",
            "Assault",
            "Murder",
            "Rape",
            "Robbery"
        ];
        fetch('http://localhost:9000/api/crimedata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ year: graphYear, crime_type : "", state : state}), // Send the selected year as JSON
        })
        .then(response => response.json())
        .then(result =>{
            const data = {
                labels: crime_types,
                datasets: [
                    {
                        label: `Data for ${state}`,
                        data: Object.values(result),
                        backgroundColor: ["#4CA1AF", "#FF6F61", "#FFD700", "#008080", "#9370DB","#FFA07A","#708090"],
                        borderColor: ["#4CA1AF", "#FF6F61", "#FFD700", "#008080", "#9370DB","#FFA07A","#708090"],
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
