import os
import json
from minio import Minio

MINIO_URL = "localhost:9000"
ACCESS_KEY = "testkey"
SECRET_KEY = "testsecret"
MOUNTED_FILE_PATH = "/data"

client = Minio(
    MINIO_URL, 
    access_key=ACCESS_KEY, 
    secret_key=SECRET_KEY,
    secure=False
)

if not client.bucket_exists("facemash"):
    client.make_bucket("facemash")

mounted_files = os.listdir(MOUNTED_FILE_PATH)

for image_file_name in mounted_files:
    print(f"uploading : {image_file_name}")
    client.fput_object(
        "facemash", 
        image_file_name, 
        os.path.join(MOUNTED_FILE_PATH, image_file_name)
    )

client.set_bucket_policy("facemash", json.dumps({
    "Version": "2012-10-17",
    "Statement": [{
        "Sid": "",
        "Effect": "Allow",
        "Principal":{"AWS":"*"},
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::facemash/*"
    }]
}))