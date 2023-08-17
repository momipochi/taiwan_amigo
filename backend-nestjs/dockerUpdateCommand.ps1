docker build --tag 610image .
docker login 610registry.azurecr.io --username 610registry
docker tag 610image 610registry.azurecr.io/610image:latest
docker push 610registry.azurecr.io/610image:latest