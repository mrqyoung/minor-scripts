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

void usage(int interval) {
  int i;
  time_t ts;
  printf("iexec v0.3 YW20151102\n");
  printf("eg: iexec -c 200 -e \"start.sh &\" -i 100\n");
  for (i = 1; i <= 10; i++) {
    printf("%2d. %d\n", i, time(&ts));
    msleep(interval);
  }
}

int main(int argc, char *argv[]) {
  int i, opt;
  int interval = 100;
  int count = 1;
  char *execute;
  char buffer[10], cmd[128];
  if (argc < 3) {
    if (argc == 2) interval = atoi(argv[1]);
    usage(interval);
    return 1;
  }
  while((opt = getopt(argc, argv, "c:e:i:")) != -1) {
      switch (opt) {
          case 'c':
              count = atoi(optarg);
              printf("-- set count=%d\n", count);
              break;
          case 'e':
              execute = optarg;
              printf("-- set exec=%s\n", execute);
              break;
          case 'i':
              interval = atoi(optarg);
              printf("-- set interval=%d\n", interval);
              break;
          case '?':
          default:
              printf("Error: unknown: %c", opt);
              return 1;
      }
  }
  for (i = 0; i < count; i++) {
      sprintf(buffer, " %d", i+1);
      sprintf(cmd, execute);
      strcat(cmd, buffer);
      //printf("%d. %s\n", i, cmd);
      system(cmd);
      msleep(interval);
  }
  return 0;
}
