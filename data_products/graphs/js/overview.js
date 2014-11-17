$(document).ready(function () {
    $('#reset').click(function () {
        dc.filterAll();
        dc.redrawAll();
    });

    d3.csv("graph_data.csv", function (error, data) {

        //define charts
        var casesDeathsChart = dc.compositeChart("#casesDeathsChart"),
            cumulative = dc.compositeChart("#cumulative"),
            mortality = dc.numberDisplay("#mortality"),
            casesDeathsRowChart = dc.rowChart("#casesDeathsRowChart"),
            map = dc.geoChoroplethChart("#map"),
            datatable = dc.dataTable("#dc-data-table");

        //data pre-processing
        var countryNameRange = [];
        var parseDate = d3.time.format("%m/%_d/%Y").parse;

        data.forEach(function(d) {
          d.Date = parseDate(d.Date);

          if ($.inArray(d.Country, countryNameRange) == -1) {
              countryNameRange.push(d.Country);
          }
        });

        //crossfilter
        var ndx = crossfilter(data);
        var all = ndx.groupAll();

        var dayDimension = ndx.dimension(function (d) { return d.Date; });
        var countryDimension = ndx.dimension(function (d) { return d.Country; });
        var typeDimension = ndx.dimension(function (d) { return d.Type; });

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

        //get the first and last day
        var minDay = dayDimension.bottom(1)[0].Date;
        var maxDay = dayDimension.top(1)[0].Date;

        var height = 198;

        d3.json("locations.geojson", function (countriesJSON) {

          //mortality %
          mortality
            .valueAccessor(function(d) { return typeGroup.all()[1].value / typeGroup.all()[0].value; })
            .html({ some:"<span style=\"color:#555555; font-size: 26px;\">Mortality: </span><br><span style=\"color:#990000; font-size: 46px;\">%number</span>" })
            .formatNumber(d3.format("%"))
            .group(typeGroup);

          //case deaths row chart
          casesDeathsRowChart
            .width(200).height(height)
            .margins({top: 20, left: 10, right: 10, bottom: 20})
            .dimension(typeDimension)
            .group(typeGroup)
            .ordinalColors(['#555555', '#990000'])
            .label(function (d) {
              if (casesDeathsRowChart.hasFilter() && !casesDeathsRowChart.hasFilter(d.key)) {
                return d.key + " (0)";
              }
              else {
                var label = d.key;
                label += " (" + d.value + ")";
                return label;
              }
            })
            .elasticX(true)
            .labelOffsetY(40)
            .xAxis().ticks(4);

          //map
          map
            .width(928).height(500)
            .dimension(countryDimension)
            .group(countryGroup)
            .projection(d3.geo.mercator()
              .scale((800) / Math.PI)
              .center([-25, 16]))
            .colors(d3.scale.quantize().range(["#DDD","#CCC","#BBB", "#AAA", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]))
            .colorDomain([0, typeGroup.all()[0].value])
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
              .columns([
                  function(d) {return d.Day;},
                  function(d) {return d.Country;},
                  function(d) {return d.Type;},
                  function(d) {return d.Value;},
                  function(d) {return d.TotalValue;}
              ]);

        dc.renderAll();
      });
    });
});
