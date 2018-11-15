Emotion-Word-Art
================
### Sub : Emotion React Word Art Library using Machine Learning

# 1. Project Name 'Emotion-Word-Art'
## 1.1 What Emotion-Word-Art  ??
글자들을 이용해 실시간 데이터들을 받아와 긍정 부정 여부를 분석하고 전체단어를 시각화 하여 보여주는 라이브러리
Library that receives real-time data using letters and analyzes positive affirmation and visualizes whole word
![example](library/gitimage/1.png)
## 1.2 How ? 
실시간 피드를 파싱하여 머신러닝을 이용해 글에 대해 감정의 긍정 부정을 판별하고 그 판별된 정보를 React 프레임워크를 이용하여 Virtual DOM 에 실시간으로 타이핑 애니메이션과 글자색을 이용하여 영상을 구현하였다. 자세한 흐름은 아래와 같다.
The real - time feed is parsed, machine learning is used to judge affirmative denial of the sentence, and the discriminated information is imaged using real - time typing animation and character color in Virtual DOM using React framework. The detailed flow is as follows.
![example2](library/gitimage/2.PNG)

## 1.3 Directory hierarchy
```sh
├─Github
│  │  README.md
│  │ package.json
│  │ package-lock.json
│  │ yarn.lock
│  ├─ data
│  │      img/    # video to frame result 
│  │      twitter # texx file using react upload
│  ├─ library
│  │       twitter.py      # twitter parsing script
│  │       video2frames.py # Video to frames script
│  ├─ public
│  │       index.html
│  │       manifest.json
│  ├─ server
│  │       index.js
│  ├─ src
│  │       Typing.js + ETC...
│  │ CONFIG.txt            # ** Input Your Info ** 
```

# 2. Development environment
## 2.1. Testing
Tested on Windows 10 with Python 3.6, Mac OS X High Sierra 10.+, Both 64 bit
## 2.2. Development Spec
```
CPU : intel i5 - 6600
RAM : 16G
OS  : windows 10 pro
GPU : nvidia GeForce 960 4G
++ IDLE : Pycharm (script), Atom(Web) - if occur the encoding error, Check encoding! 
++ Interpreter : Python 3.6.X (not support 3.7 because library not support latest python)
```

# 3. How To Use
## 3.1. Requirement
```bash 
# Install the python module 
$ pip install opencv-python tweepy

# Install the Node module
$ npm install 
```

## 3.2. Command
```bash
# 0. CONFIG 파일 설정 (Input your info CONFIG file)
$ open CONFIG.txt

# 1. 영상을 준비한후 Video2frames 를 실행(After preparing the video, execute Video2frames.)
$ py -3 ./library/video2frames.py
    >>> 긍정 영상 이름을 확장자를 포함해서 입력해주세요 : pos.mp4
    >>> 부정 영상 이름을 확장자를 포함해서 입력해주세요 : neg.mp4

# 2. 실시간 피드 파싱 실행 (real-time parsing script execute)
$ py -3 ./library/twitter.py 

# 3. Node + React 실행 
$ npm start
```

