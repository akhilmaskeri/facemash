# facemash

The website is inspired from social-network movie. But its a massive overkill.

```
    git clone https://github.com/akhilmaskeri/facemash.git && cd facemash
```

run it with docker compose
```
    docker-compose up 
```

or run with kubernetes
```
    kubectl apply -f k8configs/config-map.yaml
	kubectl apply -f k8configs/db.yaml
	kubectl apply -f k8configs/frontend.yaml
	kubectl apply -f k8configs/backend.yaml
```