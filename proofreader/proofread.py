#!/usr/bin/env python

#
# Use to test column and row names for conformity, since we're only human!
#

import sys, csv

if len(sys.argv) < 2:
    print "Usage: proofread filename.csv"
    exit(1)

# Keep this at 0 if it's successful, return 1 if there are errors
exit_code = 0

# Compute the Levenshtein edit distance between two strings
# From http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#Python
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
            insertions = previous_row[j + 1] + 1 # j+1 instead of j since previous_row and current_row are one character longer
            deletions = current_row[j] + 1       # than s2
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
 
    return previous_row[-1]

# Tests for whitespace - should probably regex this for tabs etc
def whitespace_test(items, descriptor):
    print "\n\033[1m## Testing %ss for whitespace\033[0m" % descriptor
    
    for item in items:
        if item != item.strip() or "\n" in item or "  " in item:
            exit_code = 1
            print "Whitespace found in %s '\033[30;43m%s\033[0m'" % (descriptor, item)

# Compares passed items vs. passed knowns, calling out anything not matching
def unknowns_test(items, knowns, descriptor):
    print "\n\033[1m## Testing %ss for known values\033[0m" % descriptor
    
    unknowns = [item for item in items if item not in knowns]
    
    for unknown in unknowns:
        exit_code = 1
        # Sort based on edit distance to suggest alternatives
        possibles = sorted(knowns, key=lambda known: levenshtein(unknown, known))
        print "Unknown %s '\033[30;43m%s\033[0m', maybe you meant '\033[30;42m%s\033[0m' or '\033[30;42m%s\033[0m'?" % (descriptor, unknown, possibles[0], possibles[1])

# Let's read in the canonical rows and columns
with open('canonical_columns.csv', 'rU') as cols_file:
    col_names = [row['name'] for row in csv.DictReader(cols_file)]

with open('canonical_variables.csv', 'rU') as vars_file:
    var_names = [row['name'] for row in csv.DictReader(vars_file)]

# In what column can we possibly find the variable (aka row) name?
# Description = Guinea
# Variable = Liberia
# variable = Sierra Leone
variable_col_names = [ "Description", "Variable", "variable" ]
    
# Grab the filename from passed arguments
filename = sys.argv[1]

print "\033[1mProcessing file: %s...\033[0m" % filename

with open(filename, 'rU') as csvfile:
    reader = csv.DictReader(csvfile)
    
    headers = reader.fieldnames
    whitespace_test(headers, 'header')
    unknowns_test(headers, col_names, 'header')    

    # Is the row variable called 'Description' or 'name' or what?
    # We do a set intersection and take the first match.
    col_name = (set(variable_col_names) & set(headers)).pop()
    
    variables = [row[col_name] for row in reader]    
    whitespace_test(variables, 'variable')
    unknowns_test(variables, var_names, 'variable')

exit(exit_code)