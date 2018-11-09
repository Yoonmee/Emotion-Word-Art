__author__ = 'vfdev'
# Python
import os
import subprocess
# pip install opencv-python
import cv2
def main():
    if not os.path.exists("./"+file):
        print("Input video file is not found")
        return 1
    if os.path.exists("./"+outputDir):
        print ("Remove existing output folder")
    try:
        os.makedirs("./output")
    except:
        pass
    cap = cv2.VideoCapture()
    cap.open("./"+file)
    frameCount = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    skipDelta = 0
    if maxframes and frameCount > maxframes:
        skipDelta = frameCount / maxframes

    frameId = 0
    rotateAngle = 0
    idx = 0
    while frameId < frameCount:
        ret, frame = cap.read()
        # print frameId, ret, frame.shape
        if not ret:
            print ("Failed to get the frame {f}".format(f=frameId))
            continue

        # Rotate if needed:
        if rotateAngle > 0:
            if rotateAngle == 90:
                frame = cv2.transpose(frame)
                frame = cv2.flip(frame, 1)
            elif rotateAngle == 180:
                frame = cv2.flip(frame, -1)
            elif rotateAngle == 270:
                frame = cv2.transpose(frame)
                frame = cv2.flip(frame, 0)

        fname = file.split('.')[0] +"_" + str(idx) + ".jpg"
        fname2 = file.split('.')[0] +"_" + str(idx) + "_rgb.txt"
        idx += 1

        frame = cv2.resize(frame, (100, 70), interpolation=cv2.INTER_CUBIC)
        ofname2 = os.path.join(outputDir, fname2)
        rgbof = open(ofname2, 'w')
        tmpStr = "rgb({},{},{}):"
        for i in range(70):
            for j in range(100):
                px = frame[i,j]
                rgbof.write(tmpStr.format(px[2],px[1],px[0]))

        ofname = os.path.join(outputDir, fname)

        rgbof.close()
        # args.output = cv2.resize(args.output, (108, 192), interpolation=cv2.INTER_CUBIC)
        ret = cv2.imwrite(ofname, frame)

        if not ret:
            print ("Failed to write the frame {f}".format(f=frameId))
            continue

        frameId += int(1 + skipDelta)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frameId)
        # args.output = np.array(args.output)
        # for img in args.output:
        #     img = cv2.resize(img, (108, 192), interpolation=cv2.INTER_CUBIC)
    return 0


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
    #python3 video2frames.py ./pos.mov ./output/images —maxframe=10

    print ("Start Video2Frames script ...")
    file = input(">>> 영상이름을 확장자포함 입력하세요 : ").strip()
    outputDir = "./output"
    maxframes = int( input(">>> 뽑으려는 사진갯수를 정하세요 : ").strip())
    # parser = argparse.ArgumentParser(description="Video2Frames converter")
    # parser.add_argument('input', metavar='<input_video_file>', help="Input video file")
    # parser.add_argument('output', metavar='<output_folder>', help="Output folder. If exists it will be removed")
    # parser.add_argument('--maxframes', type=int, help="Output max number of frames")
    # parser.add_argument('--rotate', type=int, choices={90, 180, 270}, help="Rotate clock-wise output frames")
    # parser.add_argument('--exifmodel', help="An example photo file to fill output meta-tags")
    # parser.add_argument('--verbose', action='store_true', help="Enable verbose")
    # args = parser.parse_args()
    main()