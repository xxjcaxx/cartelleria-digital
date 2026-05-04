# Cartelería digital (frontend con Vite)

Proyecto `Vite` + JavaScript vanilla para mostrar layouts de pantalla definidos por JSON.

## Ejecutar

```bash
npm install
npm run dev
```

Para build de producción:

```bash
npm run build
npm run preview
```

## Estructura

```text
public/
  layouts/
    playlist.json        # Lista ordenada de layouts a reproducir
    layout-1.json
    layout-2.json
    media/               # Imágenes, vídeos y HTML locales
      promo.svg
      demo-video.mp4
      widget.html
```

## Formato JSON

`playlist.json`:

```json
{
  "layouts": [
    "/layouts/layout-1.json",
    "/layouts/layout-2.json"
  ]
}
```

Cada layout:

```json
{
  "id": "layout-1",
  "durationMs": 10000,
  "regions": [
    {
      "id": "zona-1",
      "x": 0,
      "y": 0,
      "width": 50,
      "height": 100,
      "media": {
        "type": "image",
        "src": "/layouts/media/promo.svg",
        "alt": "Promo",
        "fit": "contain"
      }
    }
  ]
}
```

- `x`, `y`, `width`, `height` están en porcentaje y deben cubrir la pantalla completa entre todas las zonas.
- `durationMs` indica cuánto tiempo se muestra el layout antes de pasar al siguiente.
- Tipos soportados en `media.type`:
  - `image` → etiqueta `img`
  - `video` → etiqueta `video`
  - `html` → `iframe` apuntando a HTML local
  - `web` → `iframe` apuntando a web externa
- En imágenes puedes usar `media.fit` u `media.objectFit` con estos valores:
  - `contain` → muestra toda la imagen sin deformarla
  - `cover` → cubre toda la región sin deformarla, recortando si hace falta

## Pantalla completa

La app ocupa `100vw` x `100vh`. Para cartelería:

1. Abre la URL en navegador.
2. Activa pantalla completa (`F11` o modo kiosk del navegador/SO).

## Notas

- Reemplaza `public/layouts/media/demo-video.mp4` por un vídeo real.
- Si una web externa bloquea `iframe`, no se mostrará por política del sitio remoto (`X-Frame-Options`/`CSP`).
