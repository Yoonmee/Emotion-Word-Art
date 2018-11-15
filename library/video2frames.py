__author__ = 'yoongotto'
# Python
import os
import subprocess
# pip install opencv-python
import cv2
def main():
    video2frame(pos_file, pos_outputDir)
    video2frame(neg_file, neg_outputDir)
    return 0

def video2frame(file, dir):
    if not os.path.exists("./"+file):
        print("Input video file is not found")
        return 1
    if os.path.exists(dir):
        print ("Remove existing output folder")
    try:
        os.makedirs(dir)
    except:
        pass
    cap = cv2.VideoCapture()
    cap.open("./"+file)
    frameCount = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    skipDelta = 0
    maxframes = 10
    if maxframes and frameCount > maxframes:
        skipDelta = frameCount / maxframes

    frameId = 0
    idx = 0
    while frameId < frameCount:
        ret, frame = cap.read()
        if not ret:
            print ("Failed to get the frame {f}".format(f=frameId))
            continue

        fname = file.split('.')[0] +"_" + str(idx) + ".jpg"
        fname2 = file.split('.')[0] +"_" + str(idx) + "_rgb.txt"
        idx += 1

        frame = cv2.resize(frame, (100, 70), interpolation=cv2.INTER_CUBIC)
        ofname2 = os.path.join(dir, fname2)
        rgbof = open(ofname2, 'w')
        tmpStr = "rgb({},{},{}):"
        for i in range(70):
            for j in range(100):
                px = frame[i,j]
                rgbof.write(tmpStr.format(px[2],px[1],px[0]))

        ofname = os.path.join(dir, fname)

        rgbof.close()
        ret = cv2.imwrite(ofname, frame)

        if not ret:
            print ("Failed to write the frame {f}".format(f=frameId))
            continue

        frameId += int(1 + skipDelta)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frameId)

def write_exif_model(folder_path, model, fields=None):
    cmd = ['exiftool', '-overwrite_original', '-r']
    for field in fields:
        if field in model:
            cmd.append('-' + field + "=" + model[field])
    cmd.append(folder_path)
    ret = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = ret.communicate()
    return ret.returncode == 0 and len(err) == 0


if __name__ == "__main__":
    #python3 video2frames.py ./pos.mov ./output/images
    print ("Start Video2Frames script ...")
    pos_file = input(">>> 긍정 영상 이름을 확장자를 포함해서 입력해주세요 : ").strip()
    pos_outputDir = "../data/img/pos"
    neg_file = input(">>> 부정 영상 이름을 확장자를 포함해서 입력해주세요 : ").strip()
    neg_outputDir = "../data/img/neg"
    main()
