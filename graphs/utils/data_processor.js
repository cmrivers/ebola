#! /usr/local/bin/node

var util = require("util");
var fs = require("fs");

var writeFile = true;
var toFile = "test-update.csv";

var file = "country_timeseries.csv";
var data = readFileIntoArray(file);

util.puts(data);

if (data.length > 0) {
  outputTable(data);

    util.puts(" ");
    util.puts("Countries: ");
  var countries = getCountries(data);
    util.puts(countries);
    util.puts(" ");

  data = convertCumulativeDataToDailyNumbers(data);
  outputTable(data);

  var newData = [];
  newData.push(["Date", "Day", "Country", "Cases", "Deaths"]);

    util.puts(" ");
    util.puts("New Data: ");
  for (var i = 1; i < data.length; i++) {
    newData = newData.concat(convertDateRowToCountryRow(data[0], data[i]));
  }
    outputTable(newData);
    util.puts(" ");


  util.puts(" ");
  //util.puts("String: ");
  var string = convertArrayToCSVString(newData);
  //util.puts(string);
  util.puts(" ");

  util.puts(" ");
  if (writeFile) {
    util.puts("Writing data to file: " + toFile);
    fs.writeFile(toFile, string);
  }
  else {
    util.puts("Not writing to file.");
  }
}

function readFileIntoArray(file) {
  var newRows = [];

  var fileContents = fs.readFileSync(file);
  var rows = fileContents.toString().split("\n");

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i].split(",");
    for (var j = 0; j < row.length; j++) {
      if (!row[j]) {
        row[j] = 0;
      }
    }
    newRows.push(row);
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

  //start at the bottom of the array
  //assume the last row is 'initial' values

  var headers = data[0];

  var runningTotals = [];
  for (var i = 0; i < countries.length; i++) {
    runningTotals.push([countries[i], 0, 0]);
  }
  util.puts("Running Totals: " + runningTotals);

  for (var i = data.length - 1; i > 0; i--){
      for (var j = 2; j < headers.length; j++) {
        for ( var k = 0; k < countries.length; k++) {
          if(headers[j].indexOf(countries[k]) != -1) {
            if (headers[j].indexOf("Case") != -1) {
              var value = data[i][j];
              var currentTotal = runningTotals[k][1];

              runningTotals[k][1] = Math.max(currentTotal, value);

              var dayIncrease = value - currentTotal;

              util.puts("Cases: Value - Current Total - Difference" +
                    value + " - " + currentTotal + " - " + dayIncrease);

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

              util.puts("Deaths: Value - Current Total - Difference" +
                    value + " - " + currentTotal + " - " + dayIncrease);

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

function convertDateRowToCountryRow(header, row) {
  var rows = [];

  var date = row[0];
  var day = row[1];

  for (var i = 0; i < countries.length; i++) {
    var newRow = [];
    newRow.push(date);
    newRow.push(day);
    newRow.push(countries[i]);

    var cases = 0, deaths = 0;
    for (var j = 2; j < header.length; j++) {
      var value = header[j];
      if (value.indexOf(countries[i]) != -1) {
        if (value.indexOf("Case") != -1) {
            cases = row[j].toString();
        }
        else if (value.indexOf("Death") != -1) {
            deaths = row[j].toString();
        }
      }
    }

    newRow.push(cases);
    newRow.push(deaths);

    rows.push(newRow);
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
