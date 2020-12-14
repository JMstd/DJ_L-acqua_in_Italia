function Serie_temporale() {

    // set the dimensions and margins of the graph
    var margin = { top: 50, right: 30, bottom: 30, left: 100 },
        width = 640 - margin.left - margin.right,
        height = 580 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#line")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("../Tabelle_pulite/Tavola-3-2-json.csv",

        // When reading the csv, I must format variables:
        // prendo solo le prime due colonne (quelle che mi interessano e di cui ci sono dati sufficienti)
        function (d) {
            if (d["Famiglie che non si fidano di bere l’acqua del rubinetto (%)"] != "-") {

                return {
                    date: d3.timeParse("%Y")(d.ANNI),
                    "% Mancanza di  fiducia dei consumatori": Number(d["Famiglie che non si fidano di bere l’acqua del rubinetto (%)"].replace(/,/g, '.').replace("-", 0)),
                    "% Lamentele irregolarità servizio": Number(d["Famiglie che lamentano irregolarità nell'erogazione di acqua (%)"].replace(/,/g, '.').replace("-", 0))
                }
            }
        },

        // Now I can use this dataset:
        function (data) {
            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) { return d.date; }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return (+d["% Mancanza di  fiducia dei consumatori"] + 5); })])
                .range([height, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            // text label for the y axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left / 1.5)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em") //The dy attribute indicates a shift along the y-axis on the position of an element or its content.
                .attr("font-size", "32px")
                .style("text-anchor", "middle")
                .text("%");

            // title
            svg.append("text")
                .attr("y", 0 - margin.top + 2)
                .attr("x", (width / 2))
                .attr("dy", "1em")
                .attr("font-weight", "bold")
                .attr("font-size", "1.1em")
                .style("text-anchor", "middle")
                .text("Percentuale sulle dichiarazioni delle famiglie all'ISTAT N.6");

            var countries = ["% Lamentele irregolarità servizio", "% Mancanza di  fiducia dei consumatori"];

            // color palette
            var color = d3.scaleOrdinal()
                .domain(countries)
                .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])


            for (var i = 0; i < countries.length; i++) {
                // Add the line
                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", function (d) { return color(countries[i]) })
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()

                        .x(function (d) { return x(d.date) })
                        .y(function (d) { return y(d[countries[i]]) })
                    )
            }

            var lineLegend = svg.selectAll(".lineLegend").data(countries)
                .enter().append("g")
                .attr("class", "lineLegend")
                .attr("transform", function (d, i) {
                    position = width / 2 - margin.right * 2
                    return "translate(" + position + "," + (i * 20) + ")";
                });

            lineLegend.append("text").text(function (d) { return d; })
                .attr("transform", "translate(15,9)"); //align texts with boxes

            lineLegend.append("rect")
                .attr("fill", function (d, i) { return color(d); })
                .attr("width", 10).attr("height", 10);
        })
}