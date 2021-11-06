BASE_PATH:=$(shell pwd)
LOCAL_IMG_FOLDER:=$(BASE_PATH)/imgs
sync-data: sync-mongo sync-minio

install:
	@echo "============= helm install ============="
	kubectl create namespace playground
	helm install facemash -n playground helm
	@echo "==========================================="

sync-minio:
	@echo "============= sync minio data ============="
	docker build -t sync-data-minio src/sync-data/minio/ 
	docker run --rm -it \
		--network="host" \
		--env MINIO_ACCESS_KEY="${MINIO_ACCESS_KEY}" \
		--env MINIO_SECRET_KEY="${MINIO_SECRET_KEY}" \
		--volume $(LOCAL_IMG_FOLDER):/data \
		sync-data-minio python /app/script.py

sync-mongo:
	@echo "============= sync mongo data ============="
	virtualenv mongo-data-sync-virtualenv
	(\
		source mongo-data-sync-virtualenv/bin/activate; \
		pip install pymongo; \
		export DB_HOST="localhost"; \
		export DB_USERNAME="${MONGO_USER}"; \
		export DB_PASSWORD="${MONGO_PASSWORD}"; \
		python src/sync-data/mongo/script.py imgs \
		deactivate \
	)
	rm -rf mongo-data-sync-virtualenv
	
delete:
	@echo "============= Removing ============="
	helm delete -n playground facemash
	@echo "==========================================="