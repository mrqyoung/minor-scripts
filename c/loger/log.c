#include <stdio.h>
#include <time.h>  
#include <stdarg.h>


time_t rawtime;
struct tm * timeinfo;
char now[20];
FILE *p_file;

void
log(char *s) {
  if (!p_file) return;
  time( &rawtime );
  strftime(now, 24, "%Y-%m-%d %H:%M:%S", localtime( &rawtime ));
  fprintf(p_file, "[%s] %s", now, s);
}

void
logf(char *fmt, ...) {
  if (!p_file) return;
  va_list ap;
  va_start(ap, fmt);
  vfprintf(p_file, fmt, ap);
  va_end(ap);
}

void
log_open(char *f) {
  char *log_path = "./log.out";
  if (NULL != f) log_path = f;
  p_file = fopen(log_path, "a+");
  if (!p_file) printf("[ERROR] Cannot open log file : %s\n", log_path);
}

void 
log_close() {
  if ( !p_file ) return;
  if ( fclose(p_file) )
    printf("[ERROR] Cannot close log file.\n");
}
