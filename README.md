Data for the 2014 Global Ebola outbeak
=====

## Announcements
As of Dec 15, 2015, I will no longer be updating the data. Pull requests will be accepted.

Please refer to Brian Rowe's [R package](https://github.com/muxspace/ebola.sitrep) for scraping Liberia's sitreps.

## Contents

Datamarket has made these data available through their API [here](https://datamarket.com/data/list/?q=ebola&ref=search). The DataMarket API is documented [here](https://datamarket.com/api/v1/). To access it programmatically you need a sharing key, which you can find in the file 'datamarket_sharingkey.txt'


* `country_timeseries.csv` contains a time series of case counts and deaths is from the [World Health Organization](http://www.who.int/csr/don/en/) and [WHO situation reports](http://www.who.int/csr/disease/ebola/situation-reports/en/).
* `liberia_data/` contains .csv files of data provided by the [Liberia Ministry of Health](http://www.mohsw.gov.lr/content_display.php?sub=report2). I have noticed the data are somewhat inconsistent. Cross-check the data when analyzing.
* `sl_data/` contains .csv files of data provided by the [Sierra Leone Ministry of Health](http://health.gov.sl/?page_id=583)
* `guinea_data/` contains a mix of .csv and PDF files from the [Guinea Ministry of Health](http://actuconakry.com/wp-content/uploads/2014/10/). These data are not consistently available online, so I will keep the PDFs in the repo for reference.
* `mali_data/` contains a mix of .csv and PDF files from the [Mali Ministry of Health](http://www.sante.gov.ml/).
* `who_data/` contains data from the [WHO](http://apps.who.int/gho/data/node.ebola-sitrep) that compare sitrep case counts with patient database counts for select cities and countries.
* `data_products/` contains analyses, processing scripts, etc. Highlights include:
  * `liberia_data.py` converts the liberia_data csv files into a multidimensional pandas dataframe. Pandas is a requirement for this script. Optional argument allows output to .csv. You can run this script with ./liberia_data.py --help to learn more.
* `line_list.csv` is a line listing I manually compiled from media reports and published case series of case clusters. It is unverified and almost certainly contains errors. Use with extreme caution. The legrand compartment specifies with infectious compartment each case would originate from in the Legrand et al model. The source_id column is the case_id of the node from whom the case was infected.
* `Sierraleone_country.csv` and `SierraLeone_town.csv` is from the Sierra Leone Ministry of Health [website](http://health.gov.sl/?page_id=583). Data in `SierraLeone_town.csv` is cumlative confirmed cases - counts do not include suspected or probable cases. These spreadsheets will no longer be updated as of Sept 12 (newer data can be found in the sl_data/* files), but pull requests will be accepted.


## Disclaimer

I cannot guarantee the accuracy of this data. These data are digitized by hand (and sometimes with Tabula) so there may be data entry errors; there may also be changes and errors in the source data. I will provide updates when possible.


## Contact

I am **Caitlin Rivers**, formerly of [Network Dynamics and Simulation Science Laboratory](http://www.vbi.vt.edu/ndssl) at Virginia Tech. Also see the NDSSL website for additional Ebola data resources. You can reach me at:
* caitlin.rivers@gmail.com
* [@cmyeaton](https://twitter.com/cmyeaton)

*Please note*: I receive numerous requests for customized versions of these data. I am not able to accommodate these requests.

## Contribute

Please feel free to send a pull request or a [cup of coffee](https://ko-fi.com/cmrivers).

