BASE_PATH:=$(shell pwd)

LOCAL_CONFIG_FOLDER:=$(BASE_PATH)/k8configs
LOCAL_IMG_FOLDER:=$(BASE_PATH)/imgs

MONGO_USERNAME="root"
MONGO_PASSOWRD="admin123"

run:
	@echo "============= kube apply ============="
	kubectl apply -f $(LOCAL_CONFIG_FOLDER)/config-map.yaml \
				  -f $(LOCAL_CONFIG_FOLDER)/secrets.yaml \
				  -f $(LOCAL_CONFIG_FOLDER)/db.yaml \
				  -f $(LOCAL_CONFIG_FOLDER)/minio.yaml \
				  -f $(LOCAL_CONFIG_FOLDER)/backend.yaml \
				  -f $(LOCAL_CONFIG_FOLDER)/frontend.yaml

sync-data:
	@echo "============= sync data ============="
	docker build -t sync-data-minio src/sync-data/minio/ 
	docker run --rm -it --network="host" --volume $(LOCAL_IMG_FOLDER):/data sync-data-minio python /app/script.py

	python3 src/sync-data/mongo/script.py

remove:
	@echo "============= Removing ============="
	kubectl get svc | awk '(NR>1){print "svc/"$$1}' | xargs kubectl delete
	kubectl get deployments | awk '(NR>1){print "deployments/"$$1}' | xargs kubectl delete
	kubectl get secrets | awk '(NR>1){print "secrets/"$$1}' | xargs kubectl delete
	kubectl get configmap | awk '(NR>1){print "configmap/"$$1}' | xargs kubectl delete
	kubectl get statefulset | awk '(NR>1){print "statefulset/"$$1}' | xargs kubectl delete
	