#ifndef LOG_H
#define LOG_H

void log(char *s);
void logf(char *fmt, ...);
void log_open(char *f);
void log_close();

#endif
