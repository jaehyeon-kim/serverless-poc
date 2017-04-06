import os
import boto3

s3 = boto3.resource('s3')
s3_client = boto3.client('s3')

bucket = 'serverless-poc-models'
path = r'C:\workspace\serverless\serverless-poc\poc-logit-model'
file = 'admission.rds'

s3.create_bucket(Bucket=bucket)

s3_client.upload_file(os.path.join(path, file), bucket, file)

poc_bucket = s3.Bucket(bucket)
for key in poc_bucket.objects.all():
    print key

# for bucket in s3.buckets.all():
#     print(bucket)

# bucket = s3.Bucket('serverless-poc-jh')
# for key in bucket.objects.all():
#     key.delete()
# bucket.delete()