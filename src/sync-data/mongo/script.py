import os
from pymongo import MongoClient

DB_HOST = "localhost"
MONGO_PORT = "27017"

DB_USERNAME = "root"
DB_PASSWORD = "admin123"

DB_DATABASE = "test"

CONNECTION_URL = f"mongodb://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{MONGO_PORT}"
print(CONNECTION_URL)
# connect to database
client = MongoClient(CONNECTION_URL)
# print(client.server_info())
db = client[DB_DATABASE]

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
