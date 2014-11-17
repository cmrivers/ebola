#!/usr/bin/env python

"""
Caitlin Rivers
cmrivers@vbi.vt.edu

Converts data from the Liberian Ministry of Health on the 2014 ebola outbreak into a multidimentional dataframe.

"""

from __future__ import division
import pandas as pd
import os
import glob
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import argparse

def dimensionalize_flatfiles():
    """
    Concats flat files into multiindexed dataframe.
    Hard coded.
    """
    in_files = os.path.join("/liberia_data/", '*.csv')
    concat_data = []
    for in_file in glob.glob('./liberia_data/' + "/*.csv"):
        headers = ['specimens_collected', 'specimens_pending', 'specimens_tested', 'new_deaths', 'total_deaths_confirmed', \
               'total_deaths_probable', 'total_deaths_suspected', 'total_deaths_combo', 'CFR', 'new_contacts', \
               'total_contacts_listed', 'current_followups', 'contacts_seen', 'contacts_completed_followup', \
               'contacts_lost', 'new_admissions', 'total_in_treatment', 'total_discharges', 'cumulative_admission_isolation', \
               'new_HCW', 'cum_HCW', 'new_HCW_deaths', 'cum_HCW_deaths', 'new_suspected', 'new_probable', 'new_confirmed', \
               'total_suspected', 'total_probable', 'total_confirmed', 'total_SL', 'total_guinea']

        tmp_data = pd.read_csv(in_file, parse_dates=True, infer_datetime_format=True, index_col=0)
        tmp_data['variables'] = headers

        concat_data.append(tmp_data)

    liberia = pd.concat(concat_data)
    liberia = liberia.T.drop(['Variable', 'Unnamed: 14'])
    liberia = liberia.T.set_index('variables', append=True)
    liberia = liberia.swaplevel(0, 1)

    return liberia


def clean_sparse(df, interpolate='yes'):
    """
    Removes columns that are all NaNs and/or all zero values
    """
    drop_empty = df.dropna(how='all').fillna(0)
    drop_zeros = drop_empty[drop_empty > 0].dropna(1, how='all')

    if interpolate == 'yes':
        drop_zeros = interpolate_ts(df)
    else: pass

    return drop_zeros


def interpolate_ts(df):
    """
    Interpolates missing values in *sparse* time series
    Index must be DateTimeIndex
    """
    tmp = df.sort_index()

    delta = (tmp.index[-1])-(tmp.index[0])
    ix = pd.date_range(tmp.index[0], periods=delta.days, freq='D')

    cases_reix = tmp.reindex(ix)
    cases = cases_reix.replace(0, np.nan).dropna(axis=1, how='all')

    return cases.interpolate()

parser = argparse.ArgumentParser(description="Collate Liberian Ebolia info to CSV or Visual Graph")
parser.add_argument('--format', help="Which format would you like the data to be in? opts csv/graph (default=graph)", default="graph")
args = parser.parse_args()

liberia = dimensionalize_flatfiles()

fig, ax = plt.subplots(figsize=(12, 8))
total_cases = liberia.ix['total_suspected'] + liberia.ix['total_probable'] + liberia.ix['total_confirmed']
totals = clean_sparse(total_cases)

if args.format == "graph":
    totals.plot(title='Cumulative case totals in affected Liberian counties', linewidth=2, ax=ax);
else:
    print totals.to_csv()
