import os
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
        ".".join(image_file_name.split(".")[0:-1]), 
        os.path.join(MOUNTED_FILE_PATH, image_file_name)
    )
