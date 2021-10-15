BASE_PATH:=$(shell pwd)

LOCAL_CONFIG_FOLDER:=$(BASE_PATH)/k8configs
LOCAL_IMG_FOLDER:=$(BASE_PATH)/imgs

MONGO_USERNAME="root"
MONGO_PASSOWRD="admin123"

sync-data: sync-mongo sync-minio

start:
	@echo "============= kube apply ============="
	kubectl apply \
		-f $(LOCAL_CONFIG_FOLDER)/config-map.yaml \
		-f $(LOCAL_CONFIG_FOLDER)/secrets.yaml \
		-f $(LOCAL_CONFIG_FOLDER)/db.yaml \
		-f $(LOCAL_CONFIG_FOLDER)/minio.yaml \
		-f $(LOCAL_CONFIG_FOLDER)/backend.yaml \
		-f $(LOCAL_CONFIG_FOLDER)/frontend.yaml
	@echo "==========================================="

sync-minio:
	@echo "============= sync minio data ============="
	docker build -t sync-data-minio src/sync-data/minio/ 
	docker run --rm -it --network="host" --volume $(LOCAL_IMG_FOLDER):/data sync-data-minio python /app/script.py
	@echo "==========================================="

sync-mongo:
	@echo "============= sync mongo data ============="
	virtualenv mongo-data-sync
	(\
		source mongo-data-sync/bin/activate; \
		pip install pymongo; \
		python3 src/sync-data/mongo/script.py imgs \
		deactivate \
	)
	rm -rf mongo-data-sync
	@echo "==========================================="
	
delete:
	@echo "============= Removing ============="
	kubectl delete configmap/database-config \
		configmap/mongo-initdb-script \
		configmap/minio-config \
		secret/database-credentials \
		deployment.apps/facemash-db \
		service/database-service \
		deployment.apps/facemash-minio \
		service/minio-service \
		deployment.apps/facemash-backend \
		service/facemash-backend-service \
		deployment.apps/facemash-frontend \
		service/facemash-frontend-service
	@echo "==========================================="