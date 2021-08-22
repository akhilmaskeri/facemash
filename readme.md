# facemash

The project is inspired from movie <b>social network</b>.

### install
```
    git clone https://github.com/akhilmaskeri/facemash.git && cd facemash
```

run it with docker compose
```
    docker-compose up --build
```

or run with kubernetes
```
    kubectl apply -f k8configs/secrets.yaml
	kubectl apply -f k8configs/config-map.yaml
	kubectl apply -f k8configs/db.yaml
	kubectl apply -f k8configs/frontend.yaml
	kubectl apply -f k8configs/backend.yaml
```

### mischief
make your own facemash by adding images to `imgs/`
- image names should not contain special characters other than `_`
- while building infr, `_` gets replaced by empty space

