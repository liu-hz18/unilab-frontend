.PHONY: build deploy
build:
	docker build -t unilab-frontend-docker .

deploy:
	docker run --name unilab-frontend -p 8001:80 -v ../unilab-frontend-mount/nginx/logs:/var/log/nginx unilab-frontend-docker

stop:
	docker stop unilab-frontend
