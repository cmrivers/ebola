Data for the 2014 Ebola outbeak in West Africa
=====

![](http://dl.dropbox.com/u/47552986/Screenshots/sl.png)

## Contents

* `country_timeseries.csv` contains a time series of case counts and deaths is from the [World Health Organization](http://www.who.int/csr/don/en/) and WHO situation reports.
* `Sierraleone_country.csv` and `SierraLeone_town.csv` is from the Sierra Leone Ministry of Health [website](http://health.gov.sl/). Data in `SierraLeone_town.csv` is cumlative confirmed cases - counts do not include suspected or probable cases.
* `liberia_data/` contains .csv files of data provided by the [Liberia Ministry of Health](http://www.mohsw.gov.lr/).
* `liberia_data.py` converts the liberia_data csv files into a multidimensional pandas dataframe. Pandas is a requirement for this script. Optional argument allows output to .csv.

## How to use

If you are not familiar with Github, click the Download Zip button on the right, at the bottom of vertical menu.

## Disclaimer

I cannot guarantee the accuracy of this data. These data are digitized by hand, so there may be data entry errors; there may also be changes and errors in the source data. I will provide updates when possible.

**Pull requests welcome.**

====

Caitlin Rivers
cmrivers@vbi.vt.edu
[@cmyeaton](https://twitter.com/cmyeaton)
