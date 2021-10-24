# facemash

This project is inspired from movie **social network**.

requires `docker-desktop (kubernetes enabled)`,
`virtualenv` for syncing mongo data and `helm` for installing

clone this repository and run " `make start` " \
add your images to the **imgs/** and sync data with " `make sync-data` "

### Run in your local
```
    git clone https://github.com/akhilmaskeri/facemash.git && cd facemash
    
    make install      # -- install the helm chart
    make MINIO_ACCESS_KEY=accesskey MINIO_SECRET_KEY=secretkey MONGO_USER=root MONGO_PASSWORD=admin123 sync-data # -- add initial data
    make delete     # -- deletes the helm chart
```
