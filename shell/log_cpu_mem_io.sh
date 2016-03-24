#!/bin/bash

end=$((SECONDS+${1:?Need run-seconds at arg1}))
interval=5

echo "Start I/O logging, seconds=$1, interval=$interval"
iotop -obtqkd $interval -n $(($1/5+2)) >> io.log &

pid_app1=$(ps -ef | grep [a]pp1 | awk '{print $2}')
pid_app2=$(ps -ef | grep [a]pp2 | awk '{print $2}')
echo "CPU & MEM logging..."
while [ $SECONDS -lt $end ]; do
    ps -p $pid_app1 -o %cpu,%mem,comm >> app1.cm 
    ps -p $pid_app2 -o %cpu,%mem,comm >> app2.cm 
    ps -C nginx -o %cpu,%mem,comm >> nginx.cm
    ps -C mysqld,mysqld_safe -o %cpu,%mem,comm >> mysql.cm
    # ...
    sleep  $interval
done
