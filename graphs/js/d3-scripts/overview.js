$(document).ready(function () {
    var chartGroup = "overviewGroup";

    $('#reset').click(function () {
        dc.filterAll(chartGroup);
        dc.redrawAll(chartGroup);
    });

    d3.csv("country_timeseries-working.csv", function (error, data) {
        var casesDeathsChart = dc.barChart("#casesDeathsChart");

        // crossfilter(data) provides a way to put the rows of information into crossfilter,
        // dimension is how the data should be sliced (ie day of week, locations, datetime)
        var ndx = crossfilter(data);
        var dimension = ndx.dimension(function (d) { return d.Day; });

        var totalGroup = dimension.group().reduceSum(dc.pluck('Total'));
        var group = dimension.group();

        var minDay = dimension.bottom(1)[0].Day;
        var maxDay = dimension.top(1)[0].Day;

        var width = 500,
            height = 200;

        casesDeathsChart
            .width(width).height(height)
            .dimension(dimension)
            .group(totalGroup)
            .x(d3.scale.linear().domain([minDay, maxDay]))
            .yAxisLabel("Total");

        dc.renderAll();
    });
});
