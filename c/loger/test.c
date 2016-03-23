#include <stdio.h>
#include <time.h>  
#include "log.h"


int
main(void) {
  log_open(NULL);
  log("hello, world\n");
  log("log start 001\n");
  log("log start 002\n");
  log("log end\n");
  log_close();
  return 0;
}
