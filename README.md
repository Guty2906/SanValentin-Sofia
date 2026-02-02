# Dockerización del proyecto ⚙️

## Construir y ejecutar

- Construir la imagen con Docker:

```bash
docker build -t sofi_app .
```

- Levantar con docker-compose (recomendado):

```bash
docker-compose up --build -d
```

- Abrir en el navegador: http://localhost:8080

## Comandos útiles

- Parar y eliminar contenedores:

```bash
docker-compose down
```

- Ver logs:

```bash
docker-compose logs -f
```

> Nota: Si tu app usa Service Worker, localhost es un contexto seguro y funcionará para pruebas locales. Para producción, sirve el site con HTTPS.
