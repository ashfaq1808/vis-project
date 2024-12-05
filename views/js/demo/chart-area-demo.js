const crime_type_list = [
    "All Crimes",
    "All Property Crimes",
    "All Violent Crimes",
    "Property Burglary",
    "Property Larceny",
    "Property Motor",
    "Violent Assault",
    "Violent Murder",
    "Violent Rape",
    "Violent Robbery"
];

document.addEventListener("DOMContentLoaded", function() {
  // Fetch crime data from the server
  loadingContent();
});

const yearDropdown = document.getElementById('yearDropdown');
const yearDropDownButton = document.getElementById('yearDropDownButton'); 
const crimeDropDown = document.getElementById("typeDropDown");
const crimeDropDownButton = document.getElementById("typeDropDownButton");

    for (let year = 2019; year >= 2000; year--) {
      const yearItem = document.createElement('a');
      yearItem.className = 'dropdown-item';
      yearItem.href = `#${year}`;
      yearItem.textContent = year;
  
      // Add event listener to update button text and call the function
      yearItem.addEventListener('click', function (e) {
          e.preventDefault(); // Prevent default anchor behavior
          yearDropDownButton.textContent = year; // Update button text
          loadingContent(); // Call the function with the selected year
      });
  
      yearDropdown.appendChild(yearItem);
  }
  for(let i=0;i<crime_type_list.length; i++){
    const typeItem = document.createElement('a');
    typeItem.className = 'dropdown-item';
    typeItem.href = `#${crime_type_list[i]}`;
    typeItem.textContent = crime_type_list[i];

    // Add event listener to update button text and call the function
    typeItem.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        crimeDropDownButton.textContent = crime_type_list[i]; // Update button text
        loadingContent(); // Call the function with the selected year
    });

    crimeDropDown.appendChild(typeItem);
  }
function loadingContent(){
  
    var selectedYear = document.getElementById("yearDropDownButton").textContent.trim();
    var crime_type = document.getElementById("typeDropDownButton").textContent.trim();
    fetch('http://localhost:9000/api/crimedata', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ year: selectedYear, crime_type : crime_type, state : "All"}), // Send the selected year as JSON
      })
      .then(response => response.json())
      .then(crimeData => {
          console.log('Crime Data:', crimeData);
          const normalizedCrimeData = {};
          Object.keys(crimeData).forEach(key => {
              normalizedCrimeData[key.toLowerCase().replace(/\s+/g, '')] = crimeData[key];
          });
          console.log('Normalized Crime Data:', normalizedCrimeData);

          // Load and render the USA map
          d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(us => {
              const svg = d3.select('svg');
              const path = d3.geoPath();
              
              // Use geoAlbersUsa for proper US projection
              const projection = d3.geoAlbersUsa()
                  .scale(1300)  // Adjust the scale for better visibility
                  .translate([480, 300]);  // Center the map

              path.projection(projection);

              // Define color scale based on crime severity (red gradient)
              const color = d3.scaleThreshold()
                  .domain([10000, 50000, 100000, 200000, 500000, 1000000])
                  .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);

              // Draw the states
              svg.append('g')
                  .attr('class', 'states')
                  .selectAll('path')
                  .data(topojson.feature(us, us.objects.states).features)
                  .join('path')
                  .attr('fill', d => {
                      const stateName = d.properties.name.toLowerCase().replace(/\s+/g, '');
                      const crimeCount = normalizedCrimeData[stateName];
                      return crimeCount ? color(crimeCount) : '#ccc'; // '#ccc' for states without data
                  })
                  .attr('d', path)
                  .each(function(d) {
                      // Store the original color for each state
                      const stateName = d.properties.name.toLowerCase().replace(/\s+/g, '');
                      d.originalFill = normalizedCrimeData[stateName] ? color(normalizedCrimeData[stateName]) : '#ccc';
                  })
                  .on('mouseover', function(event, d) {
                      const stateName = d.properties.name.toLowerCase().replace(/\s+/g, '');
                      const crimeCount = normalizedCrimeData[stateName] || 0;
                      d3.select('#tooltip')
                          .style('left', (event.pageX + 5) + 'px')
                          .style('top', (event.pageY - 28) + 'px')
                          .style('display', 'inline-block')
                          .html(`<strong>${d.properties.name}</strong><br>Crime Cases: ${crimeCount}`);
                      d3.select(this).attr('fill', '#ff0000');
                  })
                  .on('mouseout', function(event, d) {
                      d3.select(this).attr('fill', d.originalFill);
                      d3.select('#tooltip').style('display', 'none');
                  })
                  .append('title')
                  .text(d => {
                      const stateName = d.properties.name.toLowerCase().replace(/\s+/g, '');
                      const crimeCount = normalizedCrimeData[stateName] || 0;
                      return `${d.properties.name}\nCrime Cases: ${crimeCount}`;
                  });
              // Draw the state borders
              svg.append('path')
                  .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
                  .attr('class', 'state-borders')
                  .attr('d', path);
          }).catch(error => {
              console.error('Error loading USA map data:', error);
          });
      })
      .catch(error => {
          console.error('Error fetching crime data:', error);
      });
}