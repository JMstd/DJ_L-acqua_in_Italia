function Mappa1_4() {

    var margin = { top: 50, right: 20, bottom: 30, left: 100 },
        width = 650 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#map_1-4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(2000)
        .center([12.368775000000001, 42.9451139])
        .translate([width / 2, height / 2]);

    var legend_labels = ["Fino a 100", "101 - 200", "201 - 250", "251 - 300", "301 - 350", "351 - 400", "451 - 500", "501 e oltre"]
    var ext_color_domain = [0, 100, 200, 250, 300, 350, 400, 450, 500, 600]
    // Data and color scale
    var data = d3.map();
    var color = d3.scaleThreshold()
        .domain([0, 100, 200, 250, 300, 350, 400, 450, 500, 600])
        .range(["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c", "#005e26", "#014f20", "#013616"]);


    // Load external data and boot
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/aquablue8200/maps/master/ItalyReg2016-WGS84.geojson")
        .defer(d3.csv, "data/Tabelle_pulite/Tavola-1-4-json.csv")
        .await(ready);

    function ready(error, map, data) {
        var rateById = {};
        var nameById = {};

        // in pratica sotto prende le colonne che gli servono, inoltre controlla i nomi di quelle regioni speciali che possono variare
        // non presentando questa tabella nessuna situazione particolare/anomala dei dati ho preferito non inserire controlli sui singoli valori
        data.forEach(function (d) {
            if (d.REGIONI == "Valle d\\u2019Aosta/Vall\\u00e9e d\\u2019Aoste")
                d.REGIONI = "Valle D'Aosta";
            else if (d.REGIONI == "Friuli-Venezia Giulia")
                d.REGIONI = "Friuli Venezia Giulia";
            else if (d.REGIONI == "Trentino-Alto Adige/S\\u00fcdtirol")
                d.REGIONI = "Trentino-Alto Adige";

            rateById[d.REGIONI] = +d["Acqua immessa in rete pro capite"];
            nameById[d.REGIONI] = d.REGIONI;
        });

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) { return color(rateById[d.properties.REGIONE]) })
            .on("mouseover", function (d) {
                d3.select(this).transition().duration(300).style("opacity", 1);
                div.transition().duration(300)
                    .style("opacity", 1)
                div.text(nameById[d.properties.REGIONE] + " : " + rateById[d.properties.REGIONE] + " Litri")   //aggiunge la scritta quando ci passi sopra
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition().duration(300)
                    .style("opacity", 0.8);
                div.transition().duration(300)
                    .style("opacity", 0);
            })

        var ls_w = 20, ls_h = 20;
        var legend = svg.selectAll("g.legend")
            .data(ext_color_domain)
            .enter().append("g")
            .attr("class", "legend");

        // la parte sotto gestisce la leggenda e il titolo
        legend.append("rect")
            .attr("x", width - margin.right)
            .attr("y", function (d, i) { return height - (i * ls_h) - 2 * ls_h; })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function (d, i) { return color(d); })
            .style("opacity", 0.8);

        legend.append("text")
            .attr("x", width - margin.right + 30)
            .attr("y", function (d, i) { return height - (i * ls_h) - ls_h - 4; })
            .text(function (d, i) { return legend_labels[i]; });

        // title
        svg.append("text")
            .attr("y", 0)
            .attr("x", (width / 2))
            .attr("dy", "1em")
            .attr("font-weight", "bold")
            .attr("font-size", "16px")
            .style("text-anchor", "middle")
            .text("Litri di acqua immessa in rete pro capite");
    }
}