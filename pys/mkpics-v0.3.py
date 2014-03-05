import os, shutil;


_wd = os.getcwd() + '\\';
_outdir = _wd + 'out\\';
_fi = (_wd + '1.JPG', _wd + '1.DOC', _wd + '1.DOCX');
f_exts = ('.jpg', '.doc', '.docx');
d_outs = (_wd + 'out\\pics\\', _wd + 'out\\docs\\', _wd + 'out\\pics1\\');
d_nws = ('nw1\\', 'nw2\\', 'nw3\\');


def newFiles(start, count, fileType):
  #print(start, count, 'doc?->', isDoc);
  x = fileType;
  mkdirs(x);
  for i in range(count):
    fn = '%04d' % (i + start);
    fo = d_outs[x] + d_nws[i%3] + fn + f_exts[x];
    if i >= 60:
      fo = d_outs[2] + d_nws[i%3] + '%02d'%(i%20) + '\\' + fn + f_exts[x];
    newFile(_fi[x], fo, fn);


def newFile(fi, fo, fn):
  shutil.copyfile(fi, fo);
  f = open(fo, 'a');
  print(fn, file=f);
  f.close();
  '''
  cmd = 'copy ' + fi + ' ' + fo;
  print(cmd);
  os.system(cmd);
  cmd = 'echo ' + fn + '>>' + fo;
  print(cmd);
  os.system(cmd);
  '''


def mkdirs(isPic):
  #print('Working-dir: ' + os.getcwd());
  print('Set-dir: ' + _wd);
  os.system('rd /s /q ' + _outdir);
  if not os.path.exists(_outdir): os.mkdir(_outdir);
  for i in range (3):
    os.mkdir(d_outs[i]);
    for j in range(3):
      os.mkdir(d_outs[i] + d_nws[j]);
      if isPic and i==2:
        for k in range(20):
          print(d_outs[2] + d_nws[j] + '%02d'%(k));
          os.mkdir(d_outs[2] + d_nws[j] + '%02d'%(k));
    


if __name__ == '__main__':
  print('Tips: pic-count = 660, doc-count = 60');
  print('Last pic ends:', 1461, '\nLast doc ends:', 61);
  print('-' * 32);
  fileType = int(input('File Type: 1. JPEG; 2. DOC ? :'));
  count = 60 if fileType == 2 else 660;
  print('File Type ->', f_exts[fileType], 'Files count: ->', count);
  start = int(input('Start:'));
  #count = int(input('How many? :'));
  newFiles(start, count, fileType);


'''
LOG:
--------------------------------
2013-09-09: PIC=801~1460; DOC=1~60
2013-07-07: PIC=1~661; DOC=0
'''
