#!/usr/bin/env python

#
# Use to test column and row names for conformity, since we're only human!
# --autocorrect-whitespace will strip spaces and newlines before processing
#

import sys
import csv
import glob
import argparse
import shutil
import re
from tempfile import NamedTemporaryFile


# Compute the Levenshtein edit distance between two strings
# From http://en.wikibooks.org/wiki/Algorithm_Implementation
#          /Strings/Levenshtein_distance#Python
def levenshtein(s1, s2):
    if len(s1) < len(s2):
        return levenshtein(s2, s1)

    # len(s1) >= len(s2)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]


# Tests for whitespace - should probably regex this for tabs etc
def whitespace_test(items, descriptor):
    print "\n\033[1m## Testing %ss for whitespace\033[0m" % descriptor

    for idx, item in enumerate(items):
        if item != item.strip() or "\n" in item or "  " in item:
            exit_code = 1
            print "line:%i: Whitespace found in %s '\033[30;43m%s\033[0m'" % \
                  (idx + 2, descriptor, item)


# Compares passed items vs. passed knowns, calling out anything not matching
def unknowns_test(items, knowns, descriptor):
    print "\n\033[1m## Testing %ss for known values\033[0m" % descriptor

    unknowns_and_indexes = [(idx + 2, item) for idx, item in
                            enumerate(items) if item not in knowns]

    for unknown in unknowns_and_indexes:
        exit_code = 1
        # Sort based on edit distance to suggest alternatives
        possibles = sorted(knowns,
                           key=lambda known: levenshtein(unknown[1], known))
        print "line:%i: Unknown %s '\033[30;43m%s\033[0m', maybe you meant '\033[30;42m%s\033[0m' or '\033[30;42m%s\033[0m'?" % \
            (unknown[0], descriptor, unknown[1], possibles[0], possibles[1])

if len(sys.argv) < 2:
    print "proofread [--autocorrect-whitespace] file.csv [file2.csv ...]"
    exit(1)

# Keep this at 0 if it's successful, return 1 if there are errors
exit_code = 0

# Let's read in the canonical rows and columns
with open('canonical_columns.csv', 'rU') as cols_file:
    col_names = [row['name'] for row in csv.DictReader(cols_file)]

with open('canonical_variables.csv', 'rU') as vars_file:
    var_names = [row['name'] for row in csv.DictReader(vars_file)]

# In what column can we possibly find the variable (aka row) name?
# Description = Guinea
# Variable = Liberia
# variable = Sierra Leone
variable_col_names = ["Description", "Variable", "variable"]

parser = argparse.ArgumentParser(description='Collect proofreading options')

# --autocorrect-whitespace will automatically trim whitespace in csv's
parser.add_argument('--autocorrect-whitespace',
                    dest='autocorrect_whitespace',
                    action='store_true',
                    default=False)
parser.add_argument('filenames', nargs='*')  # This is it!!

args = parser.parse_args()

# Grab the filename from passed arguments
for filename in args.filenames:
    print "\033[1mProcessing file: %s...\033[0m" % filename

    # Remove any 'extra' whitespace in the to-be-processed file
    if args.autocorrect_whitespace:
        tempfile = NamedTemporaryFile(delete=False)

        with open(filename, 'rU') as csvFile, tempfile:
            reader = csv.reader(csvFile)
            writer = csv.writer(tempfile, lineterminator='\n')

            for index, row in enumerate(reader):
                # Remove newlines, duplicate spaces,
                # and beginning/trailing whitespace
                trimmed_row = [re.sub(r' +',
                                      ' ',
                                      cell.replace("\n", "").strip())
                               for cell in row]
                writer.writerow(trimmed_row)

        shutil.move(tempfile.name, filename)
        tempfile.close()

    with open(filename, 'rU') as csvfile:
        reader = csv.DictReader(csvfile)

        headers = reader.fieldnames

        whitespace_test(headers, 'header')
        unknowns_test(headers, col_names, 'header')

        # Is the row variable called 'Description' or 'name' or what?
        # We do a set intersection and take the first match.
        matches = (set(variable_col_names) & set(headers))
        
        if matches:
            col_name = matches.pop()

            variables = [row[col_name] for row in reader]
            whitespace_test(variables, 'variable')
            unknowns_test(variables, var_names, 'variable')
        else:
            print "Could not identify variable column name"
            exit_code = 1

exit(exit_code)
