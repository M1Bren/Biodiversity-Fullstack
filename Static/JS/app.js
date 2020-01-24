function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample from flask app
  let url = `/metadata/${sample}`
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(response => {
    let panelSelect = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panelSelect.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    Object.defineProperties(response).forEach(([key, value])) => {
      panelSelect.append("p")
      .text(`${key}:${value}`);  // tags for each key-value in the metadata.
    }

    // Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })

    


};

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  let url = `/samples/${sample}`;

    // Generate the data for the charts using the response
    d3.json(url).then(response => {
      let xValue = response['otu_ids'];
      let yValue = response['sample_values'];
      let sizeValue = response['sample_values'];
      let label = response['otu_labels'];

      let trace1 = {
        x: xValue,
        y: yValue,
        mode: 'markers',
        marker: {
          size: sizeValue,
          color: xValue,
          colorscale: 'Portland',
          labels: label,
          type: 'scatter',  // Makes a combo bubble and scatter chart
          opacity: 0.5
        }
      }
    });

    // Define the specs and build the Bubble Scatter Plot
    let trace1 = [trace1]    // Specify that trace1 should be in list form
    
    let layout = {
      title: 'Marker Size',
      xAxis: {title: 'OTU ID'},
      showlegend: true
    };


    Plotly.newPlot("bubble", trace1, layout)

    // Build a Pie Chart according to specs (Top 10 Samples)
    let trace2 = [{
      values: sizeValue.splice(0,10),
      labels: xValue.splice(0,10),
      text: yValue.splice(0,10),
      type: 'pie'
    }];

    Plotly.newPlot('pie', trace2);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();