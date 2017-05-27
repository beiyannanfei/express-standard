#!/bin/bash

# 日期存储数组
dateArr=()
today=`date +%Y%m%d`

# 判断目录是否存在
if [ ! -d "logs.gzip" ]; then
  mkdir logs.gzip
fi
# 以日期作为下标，并以日期作为内容，存入数组
# 对文件标题要求严格

for FILE in logs/*.log
do
  fileDate=${FILE:5:8}
  if [ $fileDate != $today ]
    then
      dateArr[$fileDate]=$fileDate
  fi

done

# 打包
for item in ${dateArr[@]}
do
  tar cvzf logs.gzip/$item.tar.gz logs/$item-*.log
  rm logs/$item-*.log
done

