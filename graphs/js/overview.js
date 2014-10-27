$(document).ready(function () {
    var chartGroup = "overviewGroup";

    $('#reset').click(function () {
        dc.filterAll();
        dc.redrawAll();
    });

    d3.csv("test-update3.csv", function (error, data) {
        var casesDeathsChart = dc.compositeChart("#casesDeathsChart");
        var cumulative = dc.compositeChart("#cumulative");

        var casesDeathsBarChart = dc.rowChart("#casesDeathsBarChart")
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

        var cumulativeCaseGroup = dayDimension.group().reduceSum( function (d) {
          if (d.Type == "Cases") {
            return d.TotalValue;
          }
          else {
            return 0;
          }
        })
        var cumulativeDeathsGroup = dayDimension.group().reduceSum( function (d) {
          if (d.Type == "Deaths") {
            return d.TotalValue;
          }
          else {
            return 0;
          }
        })

        var minDay = dayDimension.bottom(1)[0].Date;
        var maxDay = dayDimension.top(1)[0].Date;

        var height = 198;

         d3.json("locations.geojson", function (countriesJSON) {

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


            casesDeathsBarChart
              .width(200).height(height)
              .margins({top: 20, left: 10, right: 10, bottom: 20})
              .dimension(typeDimension)
              .group(typeGroup)
              // .x(d3.scale.ordinal().domain(["Cases", "Deaths"]))
              // .xUnits(dc.units.ordinal)
              // .renderHorizontalGridLines(true)
              .ordinalColors(['#555555', '#990000'])
              // .elasticY(true);
              .label(function (d) {
                if (casesDeathsBarChart.hasFilter() && !casesDeathsBarChart.hasFilter(d.key)) {
                    return d.key + " (0)";
                }
                else {
                  var label = d.key;
                  label += " (" + d.value + ")";
                  return label;
                }
              })
              .labelOffsetY(40)
              // title sets the row text
              .title(function (d) {
                  return d.value;
              })
              .elasticX(true)
              .xAxis().ticks(4);


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

          //cumulative case deaths over time
          cumulative
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
                    .group(cumulativeDeathsGroup, "Cumulative Deaths"),
                dc.lineChart(casesDeathsChart)
                    .dimension(dayDimension)
                    .colors('#555555')
                    .group(cumulativeCaseGroup, "Cumulative Cases")
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
