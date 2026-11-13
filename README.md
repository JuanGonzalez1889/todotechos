This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Panel de imágenes

El panel privado está en `/admin`. Para habilitarlo, copiá `.env.example` a `.env.local` y configurá:

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD` y `MYSQL_DATABASE` para una base MySQL/MariaDB.
- `ADMIN_USERNAME` y `ADMIN_PASSWORD` para el único administrador.
- `ADMIN_SESSION_SECRET` con una clave aleatoria de al menos 32 caracteres.

La cuenta de MySQL debe poder crear tablas en la base indicada. La aplicación crea `site_media` automáticamente cuando se abre el panel. Las imágenes JPG, PNG y WebP de hasta 8 MB se guardan como binarios en MySQL; al quitarlas, el sitio vuelve al archivo original o a su ilustración provisoria. El video del hero sigue siendo un archivo estático y no se sube a la base.
Cada imagen personalizada puede ajustarse como “Recortar para llenar” (`cover`) o “Mostrar la imagen completa” (`contain`); las presentaciones y logos usan el segundo modo de forma predeterminada.

En producción, agregá las mismas variables en la configuración del hosting y asegurate de que la aplicación Next.js pueda conectarse a MySQL desde ese entorno. No uses las credenciales de producción en `.env.local` compartido ni las publiques en el repositorio.

### MySQL local con Docker

Para desarrollo local, el proyecto incluye `compose.yaml` con MySQL 8.4 aislado en el puerto `3307` y un volumen persistente. No modifica ni reutiliza otros servidores MySQL que ya estén instalados.

Creá `.env.mysql.local` con `MYSQL_ROOT_PASSWORD` y `MYSQL_PASSWORD` aleatorias y ejecutá:

```powershell
docker compose --env-file .env.mysql.local up -d
```

En `.env.local`, configurá `MYSQL_HOST=127.0.0.1`, `MYSQL_PORT=3307`, `MYSQL_DATABASE=todo_techos`, `MYSQL_USER=todo_techos_app` y el mismo `MYSQL_PASSWORD` de `.env.mysql.local`. La aplicación crea la tabla de imágenes al abrir el panel.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
