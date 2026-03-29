# NestJS Starter Boilerplate
[![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)
[![Run Tests](https://github.com/hmake98/nestjs-starter/actions/workflows/tests.yml/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/main.yml)

Features: <br>
✅ Basic Authentication <br>
📚 Swagger API Documentation <br>
🐳 Containerized with Docker <br>
☸️ Kubernetes Configuration <br>
🧪 Testing Setup <br>

## Installation

```bash
$ yarn
```

## Running Server

```bash
# development
$ yarn dev

# production
$ yarn start
```

## Running all services on Docker

```bash
docker-compose up --build
```

## Run only database and redis services on Docker

```bash
docker-compose up postgres redis
```

## Build

```bash
yarn build
```

## Tests

```bash
# unit tests
$ yarn test
```

## Swagger Documentation

- Swagger documentation endpoint will be running at <b> `/docs` </b>.

## K8s Deployment Local

```bash
# first start minikube
minikube start

# deployment
kubectl apply -f k8s/

# get endpoint of k8s cluster
minikube service nestjs-starter-service
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).

## Author

🇮🇳 Harsh Makwana <br>
[Github](https://github.com/hmake98/nestjs-starter)
[Linkedin](https://www.linkedin.com/in/hmake98)
[Instagram](https://www.instagram.com/hmake98)


## Local Setup
1. install and setup docker (Youtube etc)
2. docker-compose up --build
3. once you see `🚀 Server running on: http://127.0.0.1:3001` run the following commands in `server-1` container inside `exec` tab
  a. npx prisma generate
  b. npx prisma migrate dev
4. Visit `http://127.0.0.1:3001/docs` for swagger UI. Then test the Sign Up API and the Login API. If both are working fine, you can proceed with the frontend integration
