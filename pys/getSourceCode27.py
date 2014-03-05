import os, glob

sourceDir = "Q:\\Users\\MRQ~1.YOU\\AppData\\Local\\Temp\mrq\\admin";
outputFileName = "Q:\\Users\\MRQ~1.YOU\\AppData\\Local\\Temp\mrq\\sourceCode.txt";

dirList = [];
fileList = [];

def getFileList(dirPath):
    #files = os.listdir(sourceDir);
    files = glob.glob(dirPath + '\\*');

    for f in files:
        if (os.path.isdir(f)):
            if (f[-1] == '.'):
                pass
            else:
                dirList.append(f);
                getFileList(f);
        if (os.path.isfile(f)):
            fileList.append(f);


def outputCode(flist):
    outputFile = open(outputFileName, 'a');
    for f in flist:
        codeFile = open(f);
        codeLines = codeFile.readlines();
        print >> '=' * 64, file = outputFile;
        print >> codeLines[0][8:-2], file = outputFile;
        print >> '-' * 64, file = outputFile;
        outputFile.writelines(codeLines);
        #print(codeFile.read(), file = outputFile);
    outputFile.close();

if __name__ == '__main__':
    if not os.path.exists(sourceDir):
        print 'Failed: please check your Dir settings [line 3]';
        exit(0);
    getFileList(sourceDir);
    print str(len(dirList)) + ' dirs found';
    #print(dirList);
    print '-' * 8;
    print str(len(fileList)) + ' files found';
    #print(fileList);
    outputCode(fileList);


