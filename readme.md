# facemash

This project is inspired from movie **social network**.

you would need `docker-desktop` (and enable kubernetes) and
`virtualenv` for syncing mongo data

clone this repository and run " `make start` " \
add your images to the **imgs/** and sync data with " `make sync-data` "

### Run in your local
```
    git clone https://github.com/akhilmaskeri/facemash.git && cd facemash
    
    make start      # -- spins up the pods 
    make sync-data  # -- populates mongdb and minio
    make delete     # -- deletes 
```
