function grafico_1_4() {
    var my_dati = []; // qui andrò ad inserire i valori di dati in modo da poterli meglio manipolare

    var opzioni_selezzione = ["Nord-ovest", "Nord-est", "Centro", "Sud", "Isole"];   // sono i valopri delle righe che mi interessano 

    // set the dimensions and margins of the graph
    var margin = { top: 65, right: 40, bottom: 10, left: 60 },
        width = 680 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz_1-4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // d3.csv(file,preprocessing(),processing())
    d3.csv("../Tabelle_pulite/Tavola-1-4-json.csv", function (data) {

        //******************* questa parte mi serve per popolare my_dati che conterrà tutti i valori ***********************
        // mi controlla il contenuto riga per riga di dati e passa a my_dati solo quello che mi serve

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < opzioni_selezzione.length; j++)
                if (data[i].REGIONI == opzioni_selezzione[j]) {
                    my_dati.push(data[i]);
                }
        }

        my_dati.push(data.columns.slice(1));  //rappresenta i titoli di colonna  equivalente a "my_dati[5]"

        //******************* fine parte popolamento my_dati  **************************************************************

        // List of subgroups = header of the csv files
        var subgroups = [];
        subgroups.push(my_dati[5][2], my_dati[5][3]);  // mi fa selezzionare solo le ultime 2 colonne della tabella generata 
        // quindi i litri erogati per cittadino 

        //****************** questa parte mi genera groups in pratica i titoli di riga (che vanno sotto asse X) ************

        var groups = [];   //lo genero io prendendo i valori dalle righe

        for (var i = 0; i < my_dati.length; i++) {   // il for mi cicla nell'array my_dati (le righe della tabella) 
            groups.push(my_dati[i].REGIONI);       // aggiungo il nome della riga a groups
        }

        //********************************************* fine generazione groups ********************************************

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
            .domain([0, 500])
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

        // fino ad ora ho solo scelto come deve essere il grafico e che limiti e colori deve avere, sotto vado a sistemare i dati  *****************************************

        // la parte sotto mi serve a passare i vaolori al grafico 
        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(my_dati)
            .enter()
            .append("g")
            .attr("transform", function (d) { return "translate(" + x(d["REGIONI"]) + ",0)"; })
            //posso far traslare le barre rispetto all'asse x  

            .selectAll("rect")
            // qui sotto controllo che i valori passati siano davvero stringhe nei nomi e numeri nei valori 
            // in questo caso non è necessario fare conversione di "," in "." poiché i numeri sono tutti interi 
            .data(function (d) { return subgroups.map(function (key) { return { key: String(key), value: Number(d[key]) }; }); })

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
                position = width - margin.left - (width / 2)
                return "translate(" + position + "," + (i * 20) + ")";
            });

        lineLegend.append("text").text(function (d) { return d; })
            .attr("transform", "translate(15,9)"); //align texts with boxes 

        lineLegend.append("rect")
            .attr("fill", function (d, i) { return color(d); })
            .attr("width", 10).attr("height", 10);
        // title
        svg.append("text")
            .attr("y", -70)
            .attr("x", (width / 2.5))
            .attr("dy", "1em")
            .attr("font-weight", "bold")
            .attr("font-size", "1.1em")
            .style("text-anchor", "middle")
            .text("Acqua immessa ed erogata in rete N.3");

        svg.append("text")
            .attr("y", (height / 2))
            .attr("x", (width / width - 40))
            .attr("dy", "1em")
            .attr("font-weight", "bold")
            .attr("font-size", "1.1em")
            .style("text-anchor", "middle")
            .attr("transform", "translate(-250,150) rotate(-90)")
            .text("Litri");
    })

}