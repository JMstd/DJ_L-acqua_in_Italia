function Mappa1_6() {
    // set the dimensions and margins of the graph
    var margin = { top: 60, right: 50, bottom: 30, left: 50 },
        width = 640 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#map_1-6")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("data/Tabelle_pulite/Tavola-1-6-json.csv", function (data) {

        // List of subgroups = header of the csv files
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        // l'array groups lo genero io prendendo il primo valore da "data.columns[0]" --> ciclo for per prendere i valori dentro data."il primo valore di columns" e lo butto dentro groups
        var prova = data.columns[0];  //REGIONI
        var groups = [];   //lo genero io prendendo i valori dalle righe

        for (var i = 0; i < data.length; i++) {   // il for mi cicla nell'array data (le righe della tabella) 
            groups.push(data[i][prova]);		   // aggiungo il nome della riga a groups
        }

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 80])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#6b5b95', '#c1946a'])

        // fino ad ora ho solo scelto come deve essere il grafico e che limiti e colori deve avere, sotto vado a sistemare i dati

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + x(d[data.columns[0]]) + ",0)"; })

            .selectAll("rect")
            .data(function (d) { return subgroups.map(function (key) { return { key: String(key), value: Number(d[key].replace(/,/g, '.')) }; }); })   // qui controllo che i valori passati siano davvero stringhe nei nomi e numeri nei valori 

            .enter().append("rect")
            .attr("x", function (d) { return xSubgroup(d.key); })
            .attr("y", function (d) { return y(d.value); })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function (d) { return height - y(d.value); })
            .attr("fill", function (d) { return color(d.key); });

        var lineLegend = svg.selectAll(".lineLegend").data(subgroups)
            .enter().append("g")
            .attr("class", "lineLegend")
            .attr("transform", function (d, i) {
                position = width - margin.right
                return "translate(" + position + "," + (i * 20) + ")";
            });

        lineLegend.append("text").text(function (d) { return d; })
            .attr("transform", "translate(15,9)"); //align texts with boxes

        lineLegend.append("rect")
            .attr("fill", function (d, i) { return color(d); })
            .attr("width", 10).attr("height", 10);

        svg.append("text")
            .attr("y", -50)
            .attr("x", (width / 2))
            .attr("dy", "1em")
            .attr("font-weight", "bold")
            .attr("font-size", "1.1em")
            .style("text-anchor", "middle")
            .text("Perdite totali della rete nei comuni capoluogo di provincia N.4");
    })
}