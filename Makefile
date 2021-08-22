
kubedelete:
	@echo "----------- deleting -----------"
	kubectl delete \
		service/database-service \
		service/facemash-backend-service \
		service/facemash-frontend-service \
		deployment/facemash-backend \
		deployment/facemash-frontend \
		statefulset/facemash-db \
		secrets/database-credentials \
		configmap/mongo-initdb-script \
		configmap/database-config

kubeapply:
	@echo "------------ applying ------------"
	kubectl apply -f k8configs/secrets.yaml
	kubectl apply -f k8configs/config-map.yaml
	kubectl apply -f k8configs/db.yaml
	kubectl apply -f k8configs/frontend.yaml
	kubectl apply -f k8configs/backend.yaml


