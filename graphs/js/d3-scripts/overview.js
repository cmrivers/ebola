$(document).ready(function () {
    var chartGroup = "overviewGroup";

    $('#reset').click(function () {
        dc.filterAll();
        dc.redrawAll();
    });

    d3.csv("test-update2.csv", function (error, data) {
        //var compositeChart = dc.compositeChart("#compositeChart");
        var barCases = dc.barChart("#barCases");
        var barDeaths = dc.barChart("#barDeaths");
        var casesDeathsChart = dc.compositeChart("#casesDeathsChart");
        var casesDeathsPieChart = dc.pieChart("#casesDeathsPieChart");
        var map = dc.geoChoroplethChart("#map");
        var datatable = dc.dataTable("#dc-data-table");

        var ndx = crossfilter(data);
        var all = ndx.groupAll();

        var countryNameRange = [];
        var parseDate = d3.time.format("%m/%_d/%Y").parse;

        data.forEach(function(d) {
        	d.Date = parseDate(d.Date);

          if ($.inArray(d.Country, countryNameRange) == -1) {
              countryNameRange.push(d.Country);
          }
        });

        var dayDimension = ndx.dimension(function (d) { return d.Date; });
        var countryDimension = ndx.dimension(function (d) { return d.Country; });
        var typeDimension = ndx.dimension(function (d) { return d.Type; });

        var group = dayDimension.group();
        var typeGroup = typeDimension.group().reduceSum( function (d) {return d.Value });
        var casesGroup = dayDimension.group().reduceSum( function (d) {
            if (d.Type == "Cases") {
              return d.Value;
            }
            else {
              return 0;
            }
          });
        var deathsGroup = dayDimension.group().reduceSum( function(d) {
          if (d.Type == "Deaths") {
            return d.Value;
          }
          else {
            return 0;
          }
        });
        var countryGroup = countryDimension.group().reduceSum( function (d) {
            return d.Value;
        });
        var casesCountryGroup = countryDimension.group().reduceSum( function (d) {
            if (d.Type == "Cases") {
              return d.Value;
            }
            else {
              return 0;
            }
          });
        var deathsCountryGroup = countryDimension.group().reduceSum( function(d) {
          if (d.Type == "Deaths") {
            return d.Value;
          }
          else {
            return 0;
          }
        });

        var minDay = dayDimension.bottom(1)[0].Date;
        var maxDay = dayDimension.top(1)[0].Date;

        var height = 198;

        // d3.json("us-states.geojson", function (countriesJSON) {
         d3.json("locations.geojson", function (countriesJSON) {

            //country bar chart
            barCases
                .width(400).height(300)
                // .gap(100)
                .dimension(countryDimension)
                .group(casesCountryGroup)
                .x(d3.scale.ordinal().domain(countryNameRange))
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .renderHorizontalGridLines(true)
                //.colors(['#555555'])
                .valueAccessor(function (d) {
                   console.log(d);
                    return d.value;
                });

            barDeaths
                .width(400).height(300)
                // .gap(100)
                .dimension(countryDimension)
                .group(deathsCountryGroup)
                .x(d3.scale.ordinal().domain(countryNameRange))
                .xUnits(dc.units.ordinal)
                .renderHorizontalGridLines(true)
                .colors(['#990000'])
                .valueAccessor(function (d) {
                    return d.value;
                });

            // compositeChart
                // .width(928).height(300)
                //.dimension(countryDimension)
                //.group(group)
                // .elasticY(true)
                // .x(d3.scale.ordinal().domain(countryNameRange))
                // .xUnits(dc.units.ordinal)
                // .renderHorizontalGridLines(true)
                // .compose([countryCasesChart, countryDeathsChart])
                // .brushOn(true);

            // compositeChart
                // .renderlet(function (chart) {
                    // chart.selectAll("g._1").attr("transform", "translate(" + 24 + ", 0)");
                    // chart.selectAll("g._0").attr("transform", "translate(" + -18 + ", 0)");
                // });

            //case deaths pie
            casesDeathsPieChart
              .width(200).height(height)
              .dimension(typeDimension)
              .group(typeGroup)
              .label(function (d) {
                if (casesDeathsPieChart.hasFilter() && !casesDeathsPieChart.hasFilter(d.key)) {
                    return d.key + " (0)";
                }
                else {
                  var label = d.key;
                  label += " (" + d.value + ")";
                  return label;
                }
              })
  //            .innerRadius(40);
              .colors(d3.scale.ordinal().range(['#555555', '#990000']));

            //map
            map
              .width(938).height(500)
              .dimension(countryDimension)
              .group(countryGroup)
              .projection(d3.geo.mercator()
                .scale((800) / Math.PI)
                .center([-25, 16]))
              .colors(d3.scale.quantize().range(["#CCCCCC", "#BBBBBB", "#AAAAAA", "#999999", "#888888", "#777777", "#666666", "#555555", "#444444", "#333333"]))
              .colorDomain([0, 200])
              .colorCalculator(function (d) { return d ? map.colors()(d) : '#fff'; })
              .overlayGeoJson(countriesJSON.features, "country", function (d) {
                  return d.properties.NAME;
              })
             .title(function (d) {
                 return "Country: " + d.key + "\nCount: " + d.value;
             });

            //case deaths over time
            casesDeathsChart
              .width(698).height(197)
              .x(d3.time.scale().domain([minDay,maxDay]))
              .yAxisLabel("Total")
              .elasticY(true)
              .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
              .renderHorizontalGridLines(true)
              .compose([
                  dc.lineChart(casesDeathsChart)
                      .dimension(dayDimension)
                      .colors('#990000')
                      .renderArea(false)
                      .group(deathsGroup, "Deaths Per Day"),
                  dc.lineChart(casesDeathsChart)
                      .dimension(dayDimension)
                      .colors('#555555')
                      .group(casesGroup, "Cases Per Day")
                      .renderArea(false)
              ])
              .brushOn(false);


            //data table
            datatable
              .dimension(dayDimension)
              .group(function(d) {return d.Day;})
              // dynamic columns creation using an array of closures
              .columns([
                  function(d) {return d.Day;},
                  function(d) {return d.Country;},
                  function(d) {return d.Type;},
                  function(d) {return d.Value;}
              ]);

        dc.renderAll();

      });
    });
});
