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
        var casesDeathsCountryChart = dc.barChart("barChart");

        var datatable = dc.dataTable("#dc-data-table");

        // crossfilter(data) provides a way to put the rows of information into crossfilter,
        // dimension is how the data should be sliced (ie day of week, locations, datetime)
        var ndx = crossfilter(data);

        var countryNameRange = [];
        var parseDate = d3.time.format("%m/%_d/%Y").parse;
        var totalCases = 0;
        var totalDeaths = 0;

        data.forEach(function(d) {
        	d.Date = parseDate(d.Date);

          if ($.inArray(d.Country, countryNameRange) == -1) {
              countryNameRange.push(d.Country);
          }

          switch (d.Type) {
              case "Cases" :
                totalCases += d.Value;
              case "Deaths" :
                totalDeaths += d.Value;
          }

        });

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
          if (d.Type = "Cases") {
            return d.Value;
          }
          else {
            return 0;
          }
        });

        var group = dayDimension.group();

        var minDay = dayDimension.bottom(1)[0].Date;
        var maxDay = dayDimension.top(1)[0].Date;

        var width = 800,
            height = 200;


        casesDeathsChart
            .width(width).height(height)
            .x(d3.time.scale().domain([minDay,maxDay]))
            .yAxisLabel("Total")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.lineChart(casesDeathsChart)
                    .dimension(dayDimension)
                    .colors('#555555')
                    .group(casesGroup, "Cases Per Day")
                    .renderArea(false),
                dc.lineChart(casesDeathsChart)
                    .dimension(dayDimension)
                    .colors('#990000')
                    .renderArea(false)
                    .group(deathsGroup, "Deaths Per Day")
                ])
            .brushOn(false)
            .render();

        countryRingChart
            .width(300).height(height)
            .dimension(countryDimension)
            .group(countryGroup)
            .innerRadius(30);

        casesDeathsPieChart
            .width(300).height(height)
            .dimension(typeDimension)
            .group(typeGroup);

        var country = ndx.dimension(function (d) {
          return d.Country;
        });
        var countryGroup = country.group();

        casesDeathsCountryChart
          .width(width).height(height)
          .dimension(country)
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
