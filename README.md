# Sistema de Alumnos Pensionados

Este proyecto es una aplicación web desarrollada con **Node.js**, **Express** y HTML/CSS, diseñada para gestionar el registro y acceso de alumnos pensionados.

## Características

- Página principal con información del sistema.
- Registro de nuevos usuarios.
- Inicio de sesión para usuarios registrados.
- Interfaz moderna y responsiva.
- Archivos estáticos servidos con Express.

## Estructura de Carpetas

```
app/
├── index.js
├── pages/
│   ├── index.html
│   ├── login.html
│   └── register.html
├── public/
│   ├── styles.css
│   ├── login.css
│   ├── register.css
│   └── assets/
│       ├── icon.ico
│       └── departament.webp
```

## Instalación

1. Clona este repositorio.
   
3. Instala las dependencias:
   ```
   npm install
   ```
4. Inicia el servidor:
   ```
   npm run dev
   ```
5. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## Dependencias

- express
- path

## Notas

- Puedes personalizar los estilos en la carpeta `public/`.
- Las rutas principales son `/` (inicio), `/login` (inicio de sesión) y `/register` (registro).

---

Desarrollado por Jose Francisco Flores Amador [@JFFA25](https://github.com/JFFA25)
