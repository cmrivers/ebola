Data for the 2014 Global Ebola outbeak
=====

## Announcements
Datamarket has made these data available through their API [here](https://datamarket.com/data/list/?q=ebola&ref=search). Their website also has interactive visualizations, and allows export to other file formats. As you browse the data on their site, please take note of possible errors, for example when cumulative counts temporarily drop. **Please be aggressive about identifying and correcting these errors through pull requests, so we can improve our data quality.** 


## Contents

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

## How to use

If you are not familiar with Github, click the Download Zip button on the right, at the bottom of vertical menu.

## Disclaimer

I cannot guarantee the accuracy of this data. These data are digitized by hand, so there may be data entry errors; there may also be changes and errors in the source data. I will provide updates when possible.

**Pull requests welcome.**

## Contact

I am **Caitlin Rivers**, a grad student in computational epidemiology at the [Network Dynamics and Simulation Science Laboratory](http://www.vbi.vt.edu/ndssl) at Virginia Tech. Also see the NDSSL website for additional Ebola data resources. You can reach me at:
* cmrivers@vbi.vt.edu
* [@cmyeaton](https://twitter.com/cmyeaton)

*Please note*: I receive numerous requests every day for customized versions of these data. While I appreciate that these data are in demand and am glad they are useful to you, I simply do not have time to provide customized versions.


