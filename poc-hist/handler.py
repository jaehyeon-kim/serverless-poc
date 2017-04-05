import ctypes
import json
import os

# use python logging module to log to CloudWatch
# http://docs.aws.amazon.com/lambda/latest/dg/python-logging.html
import logging
logging.getLogger().setLevel(logging.DEBUG)

# must load all shared libraries and set the R environment variables before we can import rpy2
# load R shared libraries from lib dir
for file in os.listdir('lib'):
    if os.path.isfile(os.path.join('lib', file)):
        ctypes.cdll.LoadLibrary(os.path.join('lib', file))

# set R environment variables
os.environ["R_HOME"] = os.getcwd()
os.environ["R_LIBS"] = os.path.join(os.getcwd(), 'site-library')

# Windows only
# os.environ["R_USER"] = 'C:\Users\jaehyeon'

# import rpy2
import rpy2
from rpy2 import robjects
from rpy2.robjects import r
from rpy2.robjects.packages import importr

datasets = importr("datasets")
faithful = datasets.faithful

print("OK")



