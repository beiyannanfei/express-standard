#!/bin/bash
#删除n天前的*.log文件
n=$((60*86400))     #保留60天
today=$(date +%Y%m%d)
todayStamp=`date -d "${today}" +%s`
echo "today is ${today} timeStamp is ${todayStamp}"
for file in logs.gzip/*.gz
do
#    echo $file
    fileDate=${file:10:8}    #提取文件前八位字符获取日期
    fileDateStamp=`date -d "${fileDate}" +%s`
    secDiff=`expr ${todayStamp} - ${fileDateStamp}`
#    echo "${fileDate} timeStamp is ${fileDateStamp} diff of ${today} is ${secDiff}"
    if [ ${secDiff} -ge ${n} ]; then
        rm -rf $file
        echo "delete ${file} finish."
    fi
done

