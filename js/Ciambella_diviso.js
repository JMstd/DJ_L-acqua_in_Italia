function ciambella1_1() {

    var n_tab = [];

    d3.csv("data/Tabelle_pulite/Tavola-1-1-json.csv", function (data) {

        var colonne = ["Sorgente", " Pozzo", " Corso d’acqua superficiale", "Lago naturale o bacino artificiale"/*, "Acque marine o salmastre"*/];

        // set the dimensions and margins of the graph
        var margin = { top: 5, right: 30, bottom: 30, left: 30 },
            width = 480 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom;

        // per ogni elementro in colonne, cicla l'ultima riga dei dati (Italia) e restituisce il valore formattandolo in modo che d3 lo riconosca correttamente 
        var totale = Number(data[data.length - 1].Totale.replace(".", "").replace(/,/g, '.'));
        for (i in colonne) {
            var t;
            t = Number((data[data.length - 1][colonne[i]]).replace(".", "").replace(/,/g, '.')) * 100 / totale;

            n_tab.push(Math.round(t * 100) / 100);
        }

        var dataset = n_tab;

        var outerRadius = width / 2;
        var innerRadius = width / 5;
        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var pie = d3.layout.pie();

        //Easy colors accessible via a 10-step ordinal scale
        var color = d3.scale.category10();

        //Create SVG element
        var svg = d3.select("#ciambella1-1")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            // .append("g")   // probabilmente non serve 
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        //Set up groups
        var arcs = svg.selectAll("g.arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", arc).style('stroke', 'white')
            .style('stroke-width', 3)

        //Labels
        arcs.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "85%")
            .attr("font-weight", "bold")
            .text(function (d) {
                return d.value + "%";
            });

        // legenda

        svg.append("circle").attr("cx", margin.left + margin.right).attr("cy", width + margin.top).attr("r", 6).style("fill", "#1f77b4");
        svg.append("circle").attr("cx", margin.left + margin.right).attr("cy", width + margin.top * 4).attr("r", 6).style("fill", "#ff7f0e");
        svg.append("circle").attr("cx", margin.left + margin.right).attr("cy", width + margin.top * 7).attr("r", 6).style("fill", "#2ca02c");
        svg.append("circle").attr("cx", margin.left + margin.right).attr("cy", width + margin.top * 10).attr("r", 6).style("fill", "#d62728");
        svg.append("text").attr("x", margin.left + margin.right * 2).attr("y", width + margin.top).text("Sorgente").style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", margin.left + margin.right * 2).attr("y", width + margin.top * 4).text("Pozzo").style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", margin.left + margin.right * 2).attr("y", width + margin.top * 7).text("Corso d'acqua superficiale").style("font-size", "15px").attr("alignment-baseline", "middle");
        svg.append("text").attr("x", margin.left + margin.right * 2).attr("y", width + margin.top * 10).text("Lago naturale o bacino artificiale").style("font-size", "15px").attr("alignment-baseline", "middle");

    });
}
