
delete:
	@echo "----------- deleting -----------"
	kubectl delete service/database-service service/facemash-backend-service service/facemash-frontend-service
	kubectl delete deployment/facemash-backend deployment/facemash-frontend
	kubectl delete statefulset/facemash-db

apply:
	@echo "------------ applying ------------"
	kubectl apply -f k8configs/config-map.yaml
	kubectl apply -f k8configs/db.yaml
	kubectl apply -f k8configs/frontend.yaml
	kubectl apply -f k8configs/backend.yaml
