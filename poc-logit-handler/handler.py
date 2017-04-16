import ctypes
import json
import os
import boto3
import logging

# use python logging module to log to CloudWatch
# http://docs.aws.amazon.com/lambda/latest/dg/python-logging.html
logging.getLogger().setLevel(logging.DEBUG)

################### load R
# must load all shared libraries and set the
# R environment variables before you can import rpy2
# load R shared libraries from lib dir

# for file in os.listdir('lib'):
#     if os.path.isfile(os.path.join('lib', file)):
#         ctypes.cdll.LoadLibrary(os.path.join('lib', file))
#  
# # set R environment variables
os.environ["R_HOME"] = os.getcwd()
os.environ["R_LIBS"] = os.path.join(os.getcwd(), 'site-library')

# windows only
# os.environ["R_USER"] = r'C:\Users\jaehyeon'

import rpy2
from rpy2 import robjects
from rpy2.robjects import r
################## end of loading R

BUCKET = 'serverless-poc-models'
KEY = 'admission.rds'
s3 = boto3.client('s3')

def get_file_path(key, name_only=True):
    file_name = key.split('/')[len(key.split('/'))-1]
    if name_only:
        return file_name
    else:
        return '/tmp/' + file_name

def download_file(bucket, key):
    # caching strategies used to avoid the download of the model file every time from S3
    file_name = get_file_path(key, name_only=True)
    file_path = get_file_path(key, name_only=False)
    if os.path.isfile(file_path):
        logging.debug('{} already downloaded'.format(file_name))
        return
    else:
        logging.debug('attempt to download model object to {}'.format(file_path))
        try:
            s3.download_file(bucket, key, file_path)
        except Exception as e:
            logging.error('error downloading key {} from bucket {}'.format(key, bucket))
            logging.error(e)
            raise e

def pred_admit(gre, gpa, rnk, bucket=BUCKET, key=KEY):
    download_file(bucket, key)
    r.assign('gre', gre)
    r.assign('gpa', gpa)
    r.assign('rank', rnk)
    mod_path = get_file_path(key, name_only=False)
    r('fit <- readRDS("{}")'.format(mod_path))
    r('newdata <- data.frame(gre=as.numeric(gre),gpa=as.numeric(gpa),rank=rank)')
    r('pred <- predict(fit, newdata=newdata, type="response")')    
    return robjects.r('pred')[0] > 0.5

def lambda_handler(event, context):
    try:
        gre = event["gre"]
        gpa = event["gpa"]
        rnk = event["rank"]        
        can_be_admitted = pred_admit(gre, gpa, rnk)
        res = {
            "httpStatus": 200,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : True
            },
            "body": {"result": can_be_admitted}
        }
        return res
    except Exception as e:
        logging.error('Payload: {0}'.format(event))
        logging.error('Error: {0}'.format(e.message))        
        err = {
            'errorType': type(e).__name__, 
            'httpStatus': 400, 
            'request_id': context.aws_request_id, 
            'message': e.message.replace('\n', ' ')
            }
        raise Exception(json.dumps(err))


