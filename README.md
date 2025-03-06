# API Server para Actividad de aprendizaje 3: M7 Práctica con Rest API

### Clonar repo
```bash
git clone https://github.com/gmonmarr/apiserver.git
cd apiserver
```

### Instalar dependencias
```bash
npm i
```

### Correr servidor en localhost:3000
```bash
npm run dev
```
Alternativamente:
```bash
nodemon server.js
```

# Ejemplos de uso
## Ruta users (localhost:3000/users)
- GET de users (regresará todos los usuarios en la tabla) (GET localhost:3000/users)
```bash
curl -X GET http://localhost:3000/users
```

- POST de users (creará un usuario nuevo) (POST localhost:3000/users)
```bash
curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john.doe@example.com", "password": "securepass"}'
```
```bash
curl -X GET http://localhost:3000/users
```

- PUT de users (actualizará un usuario existente) (PUT localhost:3000/users/:id)
```bash
curl -X PUT http://localhost:3000/users/2 \
     -H "Content-Type: application/json" \
     -d '{"name": "John Updated", "email": "john.updated@example.com"}'
```
```bash
curl -X GET http://localhost:3000/users
```

- DELETE de users (eliminará de la tabla) (DELETE localhost:3000/users/:id)
```bash
curl -X DELETE http://localhost:3000/users/2
```
```bash
curl -X GET http://localhost:3000/users
```

## Ruta login
- GET de login (obtendrá el login más reciente de un usuario) (GET localhost:3000/login/last/:id)
```bash
curl -X GET http://localhost:3000/login/last/1
```

- POST de login (realizará proceso de login, generará un token JWT) (POST localhost:3000/login)
```bash
curl -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"email": "guille@example.com", "password": "memo123"}'
```
```bash
curl -X GET http://localhost:3000/login/last/1
```

- PUT de login (actualizará el HashPassword de un usuario) (PUT localhost:3000/login/:id)
```bash
curl -X PUT http://localhost:3000/login/1 \
     -H "Content-Type: application/json" \
     -d '{"password": "newsecurepass"}'
```
```bash
curl -X GET http://localhost:3000/users
```


- DELETE de login (hace el hashpassword = 0, haciendo imposible el login) (DELETE localhost:3000/login/:id)
```bash
curl -X DELETE http://localhost:3000/login/1
```
```bash
curl -X GET http://localhost:3000/users
```
