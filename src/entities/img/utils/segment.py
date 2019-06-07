#!/usr/bin/python3
# import
import numpy as np
import imutils
import base64
import cv2
import sys

# constants
angle = -14
sensitivity = 20

# read rgb image then create hsv image
f = open("src/entities/img/utils/data.txt", "r")
uri = f.read()
encoded_data = uri.split(',')[1]
nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# rotate
rotated = imutils.rotate_bound(hsv_image, angle)
image = imutils.rotate_bound(image, angle)

# create binary image
# define green in HSV: https://stackoverflow.com/questions/31590499/opencv-android-green-color-detection
lower_green = np.array([60 - sensitivity, 100, 100])
upper_green = np.array([60 + sensitivity, 255, 255])
# threshold
mask = cv2.inRange(rotated, lower_green, upper_green)

# initial close (close the small patches in between fields)
# kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (55, 55))
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 30))
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
# open 
# kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (55, 55))
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 30))
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
# dilate (enlarge the fields for padding)
# kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 40))
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 25))
mask = cv2.dilate(mask, kernel)
# close again (rows of the same field are combined)
# kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (105, 105))
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (45, 45))
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

# return region of interests
contours = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[1]
index = 0
for cnt in contours:
        index = index + 1
        (x, y, w, h) = cv2.boundingRect(cnt)
        ROI = image[y:y+h, x:x+w]
        cv2.imwrite('src/entities/img/utils/field' + str(index) + '.jpg', ROI)