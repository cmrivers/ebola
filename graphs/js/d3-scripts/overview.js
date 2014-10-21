$(document).ready(function () {
    var chartGroup = "overviewGroup";

    $('#reset').click(function () {
        dc.filterAll();
        dc.redrawAll();
    });

    d3.csv("test-update2.csv", function (error, data) {
        var casesDeathsChart = dc.compositeChart("#casesDeathsChart");
        var countryRingChart = dc.pieChart("#countryRingChart");
        var casesDeathsPieChart = dc.pieChart("#casesDeathsPieChart");
        var casesDeathsCountryChart = dc.barChart("#barChart");

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

        var minDay = dayDimension.bottom(1)[0].Date;
        var maxDay = dayDimension.top(1)[0].Date;

        var width = 798,
            height = 198;

        // d3.json("us-states.geojson", function (countriesJSON) {
         d3.json("locations.geojson", function (countriesJSON) {

          map
            .width(938).height(500)
            .dimension(countryDimension)
            .group(countryGroup)
            .projection(d3.geo.mercator()
              .scale((width -10 ) / Math.PI)
              .center([-25, 16]))
            .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
            .colorDomain([0, 200])
            .colorCalculator(function (d) { return d ? map.colors()(d) : '#ccc'; })
            .overlayGeoJson(countriesJSON.features, "country", function (d) {
                return d.properties.NAME;
            });
//            .title(function (d) {
//                return "Country: " + d.key + "\nCount: " + d.value;
//            });

        casesDeathsChart
            .width(width).height(height)
            .x(d3.time.scale().domain([minDay,maxDay]))
            .yAxisLabel("Total")
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

        countryRingChart
            .width(200).height(height)
            .dimension(countryDimension)
            .group(countryGroup)
            .label(function (d) {
              if (countryRingChart.hasFilter() && !countryRingChart.hasFilter(d.key)) {
                  return d.key + " (0)";
              }
              else {
                var label = d.key;
                label += " (\n" + d.value + ")";
                return label;
              }
            });

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
            .innerRadius(40);
//            .colors(['#3182bd', '#6baed6']);

        casesDeathsCountryChart
          .width(width).height(height)
          .dimension(countryDimension)
          .group(countryGroup)
          .colors(d3.scale.ordinal().range(['#a4dee6', '#95d9e2', '#85d3dd', '#76ced9', '#67c9d5', '#57c3d0', '#48becc']))
          .x(d3.time.scale().domain([minDay,maxDay]))
          .gap(25)
          .centerBar(true);


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
