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
import time
import tweepy
import random
import re
hangul = re.compile('[^ 0-9A-Za-zㄱ-ㅣ가-힣:/#@]+')
if __name__ == "__main__":
    ''' CONFIG FROM FILE  START '''
    with open('../CONFIG.txt',encoding='utf8') as f:
        lines = f.readlines()
        consumer_key = lines[0].split(":",maxsplit=1)[1].strip()
        consumer_secret = lines[1].split(":",maxsplit=1)[1].strip()
        access_token = lines[2].split(":",maxsplit=1)[1].strip()
        access_token_secret = lines[3].split(":",maxsplit=1)[1].strip()
        keyword = lines[4].split(":",maxsplit=1)[1].strip()
        delay = int ( lines[5].split(":",maxsplit=1)[1].strip() )
    ''' CONFIG FROM FILE  END '''

    ''' TWEEPY AUTH  '''
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)
    loopIdx = 0
    initfile = open("./init.txt", mode='w')  # 텍스트 파일로 출력(쓰기모드)
    print(">>> START")
    while True:
        ''' 조건 설정 '''
        location = "%s,%s,%s" % ("35.95", "128.25", "1000km")  # 검색기준(대한민국 중심) 좌표, 반지름
        saveStr = """{}:::{}"""
        # twitter 검색 cursor 선언
        now = time.localtime()
        s = "%04d-%02d-%02d" % (now.tm_year, now.tm_mon, now.tm_mday)
        cursor = tweepy.Cursor(api.search,
                               q=keyword,
                               since=s,
                               count=100,
                               geocode=location,
                               include_entities=True)
        for i, tweet in enumerate(cursor.items()):
            if loopIdx == 11:
                initfile.close()
            if loopIdx <= 10:
                result = hangul.sub('', tweet.text.replace('\n', '').replace(' ', ''))
                initfile.write(result)
            else:
                print("{}: {}".format(i, tweet.text))
                result = hangul.sub('', tweet.text.replace('\n', '').replace(' ', ''))
                wfile = open("./twitter.txt", mode='w')  # 텍스트 파일로 출력(쓰기모드)
                wfile.write(saveStr.format(random.randint(-1, 1), result))
                wfile.close()
                time.sleep(delay)
            loopIdx += 1
