#include<stdio.h>
#include<sys/time.h>
#include<errno.h>
#include<unistd.h>


void msleep(int m_sec) {
  struct timeval tv;
  tv.tv_sec = m_sec / 1000;
  tv.tv_usec = (m_sec % 1000) * 1000;
  int err;
  do {
    err = select(0, NULL, NULL, NULL, &tv);
  } while (err < 0 && errno == EINTR);
}

void usage() {
  struct timeval tv;
  gettimeofday(&tv,0);
  printf("Usage: timer %d [d | debug]\n", tv.tv_sec + 10);
  printf("Now: %d.%06d\n", tv.tv_sec, tv.tv_usec);
}

int main(int argc, char *argv[]) {
  int target, long_sleep;
  time_t ts;
  char debug = '\0';
  if (argc < 2) {
    usage();
    return 1;
  }
  if (argc > 2) debug = '1';
  target = atoi(argv[1]);
  time(&ts);
  long_sleep = target - ts - 2;
  if (long_sleep > 0) {
    printf("-- Wait %d seconds...\n", long_sleep);
    sleep(long_sleep);
    printf("Preparing");
  }
  do {
  do {
      time(&ts);
      if (debug) printf(".");
      msleep(1);
  } while (ts < target);
  printf("\nNow: %d\n", ts);
  return 0;
}
