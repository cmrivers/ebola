#! /usr/local/bin/node

var util = require("util");
var fs = require("fs");

var writeFile = true;
var toFile = "../html/graph_data.csv";

var file = "../../country_timeseries.csv";
var data = readFileIntoArray(file);

if (data.length > 0) {
  var countries = getCountries(data);
  data = convertCumulativeDataToDailyNumbers(data);

  var newData = [];
  newData.push(["Date", "Day", "Country", "Type", "Value", "TotalValue"]);

  var casesTotals = {};
  var deathsTotals = {};

  for (var i = 0; i < countries.length; i++) {
    casesTotals[countries[i]] = 0;
    deathsTotals[countries[i]] = 0;
  }

  for (var i = data.length - 1; i > 0; i--) {
    newData = newData.concat(convertDateRowToCountryRow(data[0], data[i]));
  }

  var string = convertArrayToCSVString(newData);

  if (writeFile) {
    util.puts("Writing data to file: " + toFile);
    fs.writeFile(toFile, string);
  }
  else {
    util.puts("Not writing to file.");
  }
}

//functions
function readFileIntoArray(file) {
  var newRows = [];

  var fileContents = fs.readFileSync(file);
  var rows = fileContents.toString().split("\n");

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i].split(",");
    if (row.length > 1) { //watch for empty line at end of file
      for (var j = 0; j < row.length; j++) {
        if (!row[j]) {
          row[j] = 0;
        }
      }
      newRows.push(row);
    }
  }

  return newRows;
}

function convertArrayToCSVString(data) {
  var string = "";
  for (var i = 0; i < data.length; i++) {
    var row = "";
    for (var j = 0; j < data[i].length; j++) {
      row += data[i][j];
      if (j != data[i].length - 1) {
        row += ",";
      }
    }
    string += row;
    if (i != data.length - 1) {
      string += "\n";
    }
  }
  return string;
}

function convertCumulativeDataToDailyNumbers(data) {
  var headers = data[0];

  var runningTotals = [];
  for (var i = 0; i < countries.length; i++) {
    runningTotals.push([countries[i], 0, 0]);
  }

  for (var i = data.length - 1; i > 0; i--){
    for (var j = 2; j < headers.length; j++) {
      for ( var k = 0; k < countries.length; k++) {
        if(headers[j].indexOf(countries[k]) != -1) {
          if (headers[j].indexOf("Case") != -1) {
            var value = data[i][j];
            var currentTotal = runningTotals[k][1];

            runningTotals[k][1] = Math.max(currentTotal, value);

            var dayIncrease = value - currentTotal;

            if (dayIncrease < 0) {
              dayIncrease = 0;
            }
            data[i][j] = dayIncrease;
          }
          else if (headers[j].indexOf("Deaths") != -1) {
            var value = data[i][j];
            var currentTotal = runningTotals[k][2];

            runningTotals[k][2] = Math.max(currentTotal, value);

            var dayIncrease = value - currentTotal;

            if (dayIncrease < 0) {
              dayIncrease = 0;
            }
            data[i][j] = dayIncrease;
          }
        }
      }
    }
  }

  return data;
}

function convertDailyNumbersToCumulative(data) {

  //leave the first and last row
  for (var i = data.length - 2; i > 0; i--) {
    for (var j = 2; j < data[i].length; j++) {
      data[i][j] = data[i][j] + data[i+1][j];
    }
  }

  return data;
}

function convertDateRowToCountryRow(header, row) {
  var rows = [];

  // make sure the date is in the correct format
  var newDate = new Date(row[0]);
  var date = ((newDate.getMonth() + 1) + "/" + newDate.getDate() + "/" + newDate.getFullYear());

  var day = row[1];

  for (var i = 0; i < countries.length; i++) {
    for (var j = 2; j < header.length; j++) {
      var headerValue = header[j];
      if (headerValue.indexOf(countries[i]) != -1) {
        var newRow = [];

        if (headerValue.indexOf("Case") != -1) {
          newRow.push(date);
          newRow.push(day);
          newRow.push(countries[i]);
          newRow.push("Cases");
          newRow.push(row[j]);

          casesTotals[countries[i]] += row[j];
          newRow.push(casesTotals[countries[i]]);

          rows.push(newRow);
        }
        else if (headerValue.indexOf("Death") != -1) {

          newRow.push(date);
          newRow.push(day);
          newRow.push(countries[i]);
          newRow.push("Deaths");
          newRow.push(row[j]);

          deathsTotals[countries[i]] += row[j];
          newRow.push(deathsTotals[countries[i]]);

          rows.push(newRow);
        }
      }
    }
  }

  return rows;
}

function getCountries(data) {
  var countries = [];
  for (var i = 0; i < data[0].length; i++) {
    if (data[0][i].toString().indexOf("Case") != -1) {
      countries.push(data[0][i].split("_")[1]);
    }
  }
  return countries;
}

function outputTable(data) {
  var widths = [];

  for (var i = 0; i < data[0].length; i++) {
    var max = 0;
    for (var j = 0; j < data.length; j++) {
      var len = data[j][i].toString().length;
      max = Math.max(max, len);
    }
    widths[i] = max;
  }

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      var toP = data[i][j].toString();
      var len = toP.length;
      var diff = widths[j] - len;

      for (var a = 0; a < diff; a++) {
        util.print(" ");
      }

      util.print(data[i][j] + " | ");
    }
    util.puts("");
  }
}
