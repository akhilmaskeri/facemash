import os
from pymongo import MongoClient

INIT_USER = "root"
INIT_PASSWORD = "admin123"
MONGO_HOST = "localhost"
MONGO_PORT = "27017"

DB_USER = "user"
DB_PASSWORD = "admin123"
DATABASE_NAME = "test"

CONNECTION_URL = f"mongodb://{INIT_USER}:{INIT_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}"

# connect to database
client = MongoClient(CONNECTION_URL)
db = client[DATABASE_NAME]

# create collections
if not db.get_collection("hist"):
    db.create_collection("hits")
if not db.get_collection("faces"):
    db.create_collection("faces")

faces = db.get_collection("faces")

# add data to database
mounted_files = os.listdir("/data")

data = []
for image_file_name in mounted_files:
    print(f"+ {image_file_name}")
    data.append({
        "name": os.path.basename(image_file_name),
        "rating": 0
    })

if data:
    faces.insert_many(data)
else:
    raise Exception("No files to upload")

hits = db.get_collection("hits")
hits.insert_one({
    "id": 1,
    "count": 0
})
