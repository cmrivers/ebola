Data for the 2014 Global Ebola outbeak
=====

## Announcements

Creating and maintaining this database has required and continues to require an immense amount of work. After six months of providing these data with no strings attached, I am moving to an incentive scheme to lighten my load.

I will continue to publish data for free to this repository. However, the data will only become available here two weeks after publication. Newer data (no more than two days behind) will be hosted on a private repository. You can gain access to the new data one of two ways:

* Digitize three Ebola situation reports. Check the folders in the `DATA_ENTRY/` folder. Fill out the template with data from the corresponding PDF. You must do this for three PDFs. Email the files (cmrivers@vbi.vt.edu) or send me github/google drive links.
* Pay a [one-time fee of $100](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=E65JEGJUSZD7S) for permanent access. If you choose this option, make sure to add your github username in the 'special instructions to seller' box.

Please note that Sierra Leone and Liberia are the only two countries (in addition to the WHO) that regularly publish situation reports, so they are the only countries for which regular data will be available on the private repo.

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

I am **Caitlin Rivers**, a grad student in computational epidemiology at the [Network Dynamics and Simulation Science Laboratory](http://www.vbi.vt.edu/ndssl) at Virginia Tech. Also see the NDSSL website for additional Ebola data resources. You can reach me at:
* cmrivers@vbi.vt.edu
* [@cmyeaton](https://twitter.com/cmyeaton)

*Please note*: I receive numerous requests for customized versions of these data. If you are interested in purchasing different formats, send me an email.


