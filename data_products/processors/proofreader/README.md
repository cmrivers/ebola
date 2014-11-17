# proofread.py

Since so much of this data is hand-entered or csv-by-csv, sometimes misspellings happen or variable names are slightly altered in different releases. This script helps proofread new data to make sure it's up to snuff.

`proofread.py` checks for extra whitespace or newlines in variable names and column headers, along with testing them against a set of known headers/variables. If it finds an unknown header, it suggests a couple replacements using [Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance). 

#### Usage Example

These examples will currently return warnings about unknown elements or extra whitespace.

```
./proofread.py ../guinea_data/ebola_guinea_04Aug2014.csv
```

```
./proofread.py ../sl_data/SLSep_29_2014.csv 
```

```
./proofread.py ../liberia_data/LiberiaSep_28_2014.csv 
```

Or, if you're feeling exceptionally fancy

```
./proofread.py --autocorrect-whitespace ../sl_data/*.csv
```

`--autocorrect-whitespace` will automatically remove 'extra' whitespace from files before proofreading them. It won't warn you what it's doing, though, so caveat emptor! 'Extra' whitespace in a cell consists of: multiple spaces in a row, newlines, leading or trailing spaces.

#### Files

[proofread.py](proofread.py) is the Python script that does the proofreading

[canonical_variables.csv](canonical_variables.csv) is a list of acceptable variable names (the content of the `description` or `variable` in a row)

[canonical_columns.csv](canonical_columns.csv) is a list of acceptable column headers