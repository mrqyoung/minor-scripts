# author: Mr.Q.Young ; 2013-06-17

import os, csv

csvIn = 'Q:\\Users\\Mr.Q.Young\\AppData\\Local\\Temp\\mrq\\PT_result_helper\\pt_qqpb_1.csv'
csvOut = 'Q:\\Users\\Mr.Q.Young\\AppData\\Local\\Temp\\mrq\\PT_result_helper\\result.csv'

TITLE = ('NEWORTK', 'MUDULE', 'TIME', 'LOG');
NW = ('CMCC', 'TD', 'EDGE');

def sortNW(csvFile):
    csvReader = csv.reader(open('avDecode_list.csv', 'rb'))
    for nw, m, t, lt in csvReader:
        if nw == 'CMCC':
            r_cmcc.append((nw, m, t, lt))
        elif nw == 'TD':
            r_td.append((nw, m, t, lt))
        elif nw == 'EDGE':
            r_edge.append((nw, m, t, lt))
        else:
            continue


def getList(fileCsv):
    csvReader = csv.reader(open(fileCsv, 'r'))
    r = [(nw,m,t,lt) for nw,m,t,lt in csvReader if nw in NW]
    #print(r)
    return sortCASE(r)


def sortCASE(r):
    r.sort(key=lambda x:(x[0],x[1]))
    return r


def outCsv(r, outFile):
    csvWriter = csv.writer(open(outFile, 'w'))
    csvWriter.writerow(TITLE)
    for line in r:
        csvWriter.writerow(line)


if __name__ == '__main__':
    print('Waiting...');
    outCsv(getList(csvIn), csvOut)
    print('Done.');


