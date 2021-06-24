


// Build function to create the metadata visualization in the panel body
function buildMetaData(sample) {

    // get samples.json data using d3
    d3.json("samples.json").then((data) => {
        // console.log(data);

        // use .then to extract the sample's metadata
        var metadata = data.metadata;
        // console.log(metadata);

        // // filter the metadata array to get the metadata for the sample object requested by the user
        // assuming the user wants the first sample; sample 940
        // then modify once a function buildMetaData is created
        var sampleArray = metadata.filter(sampleObject => sampleObject.id == sample);
        // console.log(sampleArray_940);
        results = sampleArray[0];
        console.log(results);

        // use d3 to select the panel with id="sample=metadata"
        var panelBody = d3.select("#sample-metadata");

        // clear out any existing metadata by assigning the html for the panelBody to an empty string
        panelBody.html("");

        // access the key value pairs for the metadata results using Object.entries
        // iterate over each key and value using forEach
        // append the panelBody with an header element 
        // and add text for the key and value of the metadata for the given sample
        Object.entries(results).forEach(([key, value]) => {
            // console.log(`key: ${key} value: ${value}`);
            panelBody.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}


function buildBarChart(sample) {

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        // console.log(samples);

        // filter the metadata array to get the metadata for the sample object requested by the user
        // assuming the user wants the first sample; sample 940
        // then modify once a function buildMetaData is created
        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);
        // console.log(sampleArray_940);
        results = sampleArray[0];
        console.log(results);

        // create variables needed to create bar chart
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        // build plotly bar chart for the first ten bacteria in the sample
        // note the sample bacteria are in descending order so this will be the top ten most common bacteria in the sample
        // use map to iterate over each out_ids and create a literal string
        // to get slide in reverse order use reverse 
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        console.log(yticks);

        // create barData array
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        // create barLayout
        barLayout = {
            title: "Top 10 Baterial Cultures Found",
            hovermode: "closest",
            xaxis: { title: "OTU Count in Sample" },
            margin: { top: 30, left: 100 },
        };

        // create the barchart
        Plotly.newPlot("bar", barData, barLayout);

    });

}

function buildBubbleChart(sample) {
    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        // console.log(samples);

        // filter the metadata array to get the metadata for the sample object requested by the user
        // assuming the user wants the first sample; sample 940
        // then modify once a function buildMetaData is created
        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);
        // console.log(sampleArray_940);
        results = sampleArray[0];
        console.log(results);

        // create variables needed to create bar chart
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        // Build a Bubble Chart
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 30 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
        };

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);



    });

}

// create an init function to inialize the webpage
function init() {
    // get dropdown selector from the select element in the DOM
    // selector has id="selDataset"
    var selector = d3.select("#selDataset");

    // populate the list of options in the dropdown selector
    // using d3.json to get data
    d3.json("samples.json").then((data) => {

        // create variable for sample names
        var sampleNames = data.names;

        // iterate over each using forEach
        sampleNames.forEach((sample) => {

            // using chaining append option with text containing the sample names
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // get the first sample and create inial plots
        var firstSample = sampleNames[0];        
        buildMetaData(firstSample);
        buildBarChart(firstSample);
        buildBubbleChart(firstSample);
    });
}

// get new data and build plots each time a different sample is selected by the user
// Note this onchange event is called optionChanged
// and uses the this.value technique to get the value for newSample
function optionChanged(newSample) {
    buildMetaData(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
    

}

// initalize the webpage with plots by calling init funciton
init();