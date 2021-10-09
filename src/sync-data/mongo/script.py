import os
import pip
pip.main(["install", "pymongo"])

from pymongo import MongoClient

DB_HOST = "localhost"
MONGO_PORT = "27017"

DB_USERNAME = "user"
DB_PASSWORD = "admin123"

DB_DATABASE = "test"

CONNECTION_URL = f"mongodb://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{MONGO_PORT}/{DB_DATABASE}"
print(CONNECTION_URL)
# connect to database
client = MongoClient(CONNECTION_URL)
db = client[DB_DATABASE]

# create collections
if not db.get_collection("hist"): db.create_collection("hits")
if not db.get_collection("faces"): db.create_collection("faces")

# add data to database
mounted_files = os.listdir("imgs")
faces = db.get_collection("faces")
data = []

for image_file_name in mounted_files:
    print(f"+ {image_file_name}")
    data.append({
        "name": image_file_name,
        "rating": 0
    })

if not data:
    raise Exception("No files to upload")

faces.insert_many(data)

hits = db.get_collection("hits")
hits.insert_one({
    "id": 1,
    "count": 0
})
