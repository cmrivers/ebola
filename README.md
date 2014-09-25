Data for the 2014 Ebola outbeak in West Africa
=====

## Contents

* `country_timeseries.csv` contains a time series of case counts and deaths is from the [World Health Organization](http://www.who.int/csr/don/en/) and WHO situation reports.
* `country_timeseries.json` JSON format of `country_timeseries.csv`, NOTE: this file may lag behind the CSV file.
* `liberia_data/` contains .csv files of data provided by the [Liberia Ministry of Health](http://www.mohsw.gov.lr/). I have noticed the data are somewhat inconsistent. Cross-check the data when analyzing.
* `sl_data/` contains .csv files of data provided by the [Sierra Leone Ministry of Health](https/health.gov.sl/)
* `liberia_data.py` converts the liberia_data csv files into a multidimensional pandas dataframe. Pandas is a requirement for this script. Optional argument allows output to .csv.
  * You can run this script with ./liberia_data.py --help to learn more.

* `line_list.csv` is a line listing I manually compiled from media reports and published case series of case clusters. It is unverified and almost certainly contains errors. Use with extreme caution. The legrand compartment specifies with infectious compartment each case would originate from in the Legrand et al model. The source_id column is the case_id of the node from whom the case was infected.
* `Sierraleone_country.csv` and `SierraLeone_town.csv` is from the Sierra Leone Ministry of Health [website](http://health.gov.sl/). Data in `SierraLeone_town.csv` is cumlative confirmed cases - counts do not include suspected or probable cases. These spreadsheets will no longer be updated as of Sept 12 (newer data can be found in the sl_data/* files), but pull requests will be accepted.
* `locations.json` contains the detailed case location information for Sierra Leon and Liberia.

![Epicurves](https://github.com/cmrivers/ebola/blob/master/analyses/liberia_cumulative.png)

## Contribute
The analysis folder and [analyses/ebola_analyses.md](https://github.com/cmrivers/ebola/blob/master/analyses/ebola_analyses.md) file contains community-contributed analyses. If you have something to contribute, send a pull request or email.

## How to use

If you are not familiar with Github, click the Download Zip button on the right, at the bottom of vertical menu.

## Disclaimer

I cannot guarantee the accuracy of this data. These data are digitized by hand, so there may be data entry errors; there may also be changes and errors in the source data. I will provide updates when possible.

**Pull requests welcome.**

## Contact

I am **Caitlin Rivers**, a scholar in computational epidemiology at Virginia Tech. You can reach me at:
* cmrivers@vbi.vt.edu
* [@cmyeaton](https://twitter.com/cmyeaton)

*Please note*: I receive numerous requests every day for customized versions of these data. While I appreciate that these data are in demand and am glad they are useful to you, I simply do not have time to provide customized versions.


