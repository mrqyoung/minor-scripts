#import os, sys


outputFileName = "Q:\\Users\\MRQ~1.YOU\\AppData\\Local\\Temp\mrq\\500.vcf";


def output2vcf(numberOfContacts):
    outputFile = open(outputFileName, 'a');
    for i in range(1, numberOfContacts + 1):
        j = str(i);
        print('BEGIN:VCARD',    file = outputFile);
        print('VERSION:2.1',    file = outputFile);
        print('N:;' + j + ';;;', file = outputFile);
        print('FN:' + j,        file = outputFile);
        print('TEL;CELL:' + j,     file = outputFile);
        print('END:VCARD',      file = outputFile);
        #outputFile.writelines(codeLines);
    outputFile.close();
    


if __name__ == '__main__':
    print('start');
    output2vcf(500);
    print('done');



