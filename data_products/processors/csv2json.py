#!/usr/local/bin/python
# coding: utf-8

import csv
import json
import argparse

parser = argparse.ArgumentParser(
    description="Process a csv file into a JSON array-of-dicts")
parser.add_argument('source_file',
                    metavar = 'source_file',
                    type = str,
                    help = 'source file (csv)')
parser.add_argument('target_file',
                    metavar = 'target_file',
                    type = str,
                    help = 'target file (JSON)')

def convert(source, target, **kwargs):
    """
    Converts a CSV file to a JSON array of dicts.

    :param source: a source csv file.
    :type source: file
    :param target: a target file – you have to have writing permissions or else the operation will fail.
    :type target: file
    :param kwargs: Array of params to be passed on to the `csv.reader` object.
    :type kwargs: list
    :return: the source csv file as JSON.
    :rtype: file
    """

    result = []
    try:
        with open(source) as sourcefile:
            data = csv.reader(sourcefile, kwargs)
            header = data.next()
            for row in data:
                row_dict = {}
                for idx, val in enumerate(header):
                    row_dict["%s" % val] = row[idx]
                result.append(row_dict)

        with open(target, 'w+') as targetfile:
            json.dump(result, targetfile)
            return targetfile

    except Exception as e:
        print "Operation failed: %s" % e

if __name__ == '__main__':

    args = parser.parse_args()
    convert(args.source_file,
            args.target_file)
