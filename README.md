# SICPES (Sistema Integral de Control de Pensión de Estudiantes)

Este proyecto es una aplicación web desarrollada con **Node.js**, **Express** y HTML/CSS, diseñada para gestionar el registro y acceso de alumnos pensionados.

## Características

- Registro de usuarios con validación de contraseña.
- Verificación de correo electrónico vía enlace enviado por email.
- Inicio de sesión solo para usuarios con cuenta verificada.
- Sistema de rutas API modular.
- Uso de variables de entorno seguras con `dotenv`.
- Hashing de contraseñas con `bcryptjs`.
- Envío de correos con `nodemailer`.
- Conexión segura a MongoDB con `mongoose`.
- Manejo de tokens (listo para implementar JWT si se desea).
- Servidor Express sirviendo archivos HTML/CSS estáticos.

## Instalación

1. Clona este repositorio. 
    ```
    https://github.com/JFFA25/SICPES.git
    ```
 
   
2. Instala las dependencias:
   ```
   npm install
   ```
3. Inicia el servidor:
   ```
   npm run dev
   ```
4. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## Dependencias

- bcryptjs: Encriptación de contraseñas.
- cookie-parser: Manejo de cookies.
- dotenv: Manejo de variables de entorno.
- express: Framework web para Node.js.
- jsonwebtoken: Generación de tokens JWT (aún no integrado, pero listo para usar).
- mongoose: ODM para MongoDB.
- nodemailer: Envío de correos de verificación.
- path: Utilidades para rutas de archivos.

Desarrollado por [Jose Francisco Flores Amador](https://github.com/JFFA25)
