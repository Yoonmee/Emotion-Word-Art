# -*- coding: utf-8 -*-
#!/usr/bin/env python3
'''
@desc:
    트위터 실시간 피드 받아서 React 에 뿌려줄 글 생성
@require:
    pip install tweepy
'''
__author__ = '박형준'
__email__  = 'khuphj@gmail.com'
import random
import re
import time

hangul = re.compile('[^ 0-9A-Za-zㄱ-ㅣ가-힣:/#@]+')
def read_data(filename):
    with open(filename, 'r',encoding='utf8') as f:
        data = [line.split('\t') for line in f.read().splitlines()]
    return data



if __name__ == "__main__":
    txt = read_data('ratings_train.txt')[1:]
    initfile = open("../data/init.txt", mode='w')  # 텍스트 파일로 출력(쓰기모드)
    for t in txt[:20]:
        initfile.write(t[1])
    initfile.close()
    saveStr = """{}:::{}"""

    randomIdx = 10
    operatorIdx = 0
    while True:
        per = random.randint(0,100) # 퍼센트변수
        if randomIdx <= 10:
            operatorIdx = 1 # plus로
        elif randomIdx >= 90:
            operatorIdx = 0  # 마이너스로로\
        if operatorIdx == 0:
            randomIdx -= 5
        else:
            randomIdx += 5
        wfile = open("../data/twitter.txt", mode='w')  # 텍스트 파일로 출력(쓰기모드)
        if per <= randomIdx: #긍정부분
            while True:
                r = random.choice(txt)
                if r[-1]=='1':
                    wfile.write(saveStr.format('1', r[1]))
                    print(saveStr.format('1', r[1]))
                    break
        else: # 부정
            while True:
                r = random.choice(txt)
                if r[-1]=='0':
                    wfile.write(saveStr.format('0', r[1]))
                    print(saveStr.format('0', r[1]))
                    break
        wfile.close()
        time.sleep(5)
