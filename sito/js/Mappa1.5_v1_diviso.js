function Mappa1_5() {

    var margin = { top: 50, right: 20, bottom: 30, left: 100 },
        width = 650 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#map_1-5")
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

    var legend_labels = ["negativi", "0.1 - 1", "1.1 - 5", "5.1 - 10", "10.1 - 15", "15.1 - 20"]
    var ext_color_domain = [-10, 0, 1, 5, 10, 15]
    // Data and color scale
    var data = d3.map();
    var color = d3.scaleThreshold()
        .domain([0, 1, 5, 10, 15])
        .range(["#b6ec13", "#ecec13", "#ecb613", "#ec8013", "#ec4913", "#ec1313", "#ec1313"]);
    /*["#0000ff", "#00ffff", "#005e26", "#ffff00", "#ff9900", "#ff0000", "#ff00ff"]*/

    // Load external data and boot
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/aquablue8200/maps/master/ItalyReg2016-WGS84.geojson")
        .defer(d3.csv, "data/Tabelle_pulite/Tavola-1-5-json.csv")
        .await(ready);

    var my_dati = [];
    function ready(error, map, data) {
        var rateById = {};
        var nameById = {};

        // in pratica sotto prende le colonne che gli servono, inoltre controlla i nomi di quelle regioni speciali che possono variare
        // sostituisce le virgole con punti e controlla che i valori siano numeri e non stringhe 
        data.forEach(function (d) {
            if (d.REGIONI == "Valle d’Aosta/Vallée d’Aoste  ")
                d.REGIONI = "Valle D'Aosta";
            else if (d.REGIONI == "Friuli-Venezia Giulia  ")
                d.REGIONI = "Friuli Venezia Giulia";
            else if (d.REGIONI == "Trentino-Alto Adige/Südtirol  ")
                d.REGIONI = "Trentino-Alto Adige";

            d.REGIONI = d.REGIONI.trim();   // mi toglie eventuali spazi bianchi 

            rateById[d.REGIONI] = +Number(d["Differenze_2015-2012"].replace(/,/g, '.'));
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
                div.text(nameById[d.properties.REGIONE] + " : " + rateById[d.properties.REGIONE] + " %")   //aggiunge la scritta quando ci passi sopra
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
            .attr("font-size", "1.1em")
            .style("text-anchor", "middle")
            .text("Differenze 2015-2012 percentuale N.5");
    }
}