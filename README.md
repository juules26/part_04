# Bloglist Backend

Este es el backend de la aplicación de blogs, donde se manejan las rutas para registrar usuarios, agregar, editar y eliminar blogs, así como dar likes.

Usa **Node.js**, **Express** y **MongoDB** para almacenar los datos.

## Características

- API RESTful para manejar blogs
- Autenticación de usuarios con JWT (JSON Web Token)
- CRUD (Crear, Leer, Actualizar, Eliminar) para los blogs
- Validaciones para los datos
- Manejo de errores

## Tecnologías usadas

- **Backend:** Node.js, Express
- **Base de datos:** MongoDB, Mongoose
- **Autenticación:** JWT (JSON Web Tokens)

## Cómo iniciar el backend

Primero, asegúrate de tener **MongoDB** corriendo localmente o usar un servicio como **MongoDB Atlas**.

```bash
git clone https://github.com/[tu usuario]/bloglist-backend.git
cd bloglist-backend
npm install
npm start
