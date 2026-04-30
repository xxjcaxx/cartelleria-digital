# Layout Schema Reference

Referencia normativa para crear layouts de cartelería digital en este proyecto.

## Objetivo

Definir archivos JSON que el reproductor frontend pueda cargar sin errores desde:

- `public/layouts/playlist.json`
- `public/layouts/*.json`
- medios en `public/layouts/media/*`

## Contrato de datos

### 1) Playlist

Archivo: `public/layouts/playlist.json`

```json
{
  "layouts": [
    "/layouts/layout-1.json",
    "/layouts/layout-2.json"
  ]
}
```

Reglas:
- `layouts` es obligatorio y debe ser array no vacío.
- Cada entrada debe ser una ruta pública absoluta empezando por `/layouts/`.
- El orden del array define el orden de reproducción.

### 2) Layout individual

Archivo típico: `public/layouts/layout-N.json`

```json
{
  "id": "layout-1",
  "durationMs": 10000,
  "regions": [
    {
      "id": "zona-1",
      "x": 0,
      "y": 0,
      "width": 100,
      "height": 100,
      "media": {
        "type": "image",
        "src": "/layouts/media/promo.svg",
        "alt": "Promo principal"
      }
    }
  ]
}
```

Reglas:
- `id`: opcional pero recomendado; string único por layout.
- `durationMs`: opcional; número entero positivo recomendado (`>= 1000`).
- `regions`: obligatorio, array no vacío.

### 3) Región

Cada región describe un rectángulo relativo al 100% de pantalla:

- `id` (string): identificador único dentro del layout.
- `x` (number): posición horizontal en `%`, rango recomendado `0..100`.
- `y` (number): posición vertical en `%`, rango recomendado `0..100`.
- `width` (number): ancho en `%`, rango recomendado `>0..100`.
- `height` (number): alto en `%`, rango recomendado `>0..100`.
- `media` (object): definición del contenido.

Buenas prácticas geométricas:
- Evitar solapes salvo que sean intencionales.
- Procurar cobertura total del lienzo (sumando regiones).
- Garantizar que cada región quede dentro de pantalla (`x + width <= 100`, `y + height <= 100`).

## Tipos de media soportados

### image

```json
{
  "type": "image",
  "src": "/layouts/media/promo.svg",
  "alt": "Texto alternativo"
}
```

Campos:
- `type`: `image` (obligatorio)
- `src`: ruta pública del recurso (obligatorio)
- `alt`: recomendado

### video

```json
{
  "type": "video",
  "src": "/layouts/media/demo-video.mp4",
  "loop": true,
  "controls": false
}
```

Campos:
- `type`: `video` (obligatorio)
- `src`: obligatorio
- `loop`: opcional (`true` por defecto recomendado)
- `controls`: opcional (`false` recomendado para cartelería)

### html

```json
{
  "type": "html",
  "src": "/layouts/media/widget.html",
  "title": "Widget local"
}
```

Campos:
- `type`: `html` (obligatorio)
- `src`: obligatorio (HTML local en `/layouts/media/`)
- `title`: recomendado para accesibilidad

### web

```json
{
  "type": "web",
  "src": "https://example.org",
  "title": "Sitio externo"
}
```

Campos:
- `type`: `web` (obligatorio)
- `src`: obligatorio (URL externa)
- `title`: recomendado

Nota: algunas webs bloquean `iframe` por `X-Frame-Options` o `CSP`.

## Plantillas recomendadas

### Fullscreen única región

```json
{
  "id": "full-screen",
  "durationMs": 8000,
  "regions": [
    {
      "id": "full",
      "x": 0,
      "y": 0,
      "width": 100,
      "height": 100,
      "media": {
        "type": "image",
        "src": "/layouts/media/promo.svg",
        "alt": "Pantalla completa"
      }
    }
  ]
}
```

### Rejilla 2x2

```json
{
  "id": "grid-2x2",
  "durationMs": 12000,
  "regions": [
    {
      "id": "r1",
      "x": 0,
      "y": 0,
      "width": 50,
      "height": 50,
      "media": { "type": "image", "src": "/layouts/media/promo.svg", "alt": "r1" }
    },
    {
      "id": "r2",
      "x": 50,
      "y": 0,
      "width": 50,
      "height": 50,
      "media": { "type": "html", "src": "/layouts/media/widget.html", "title": "r2" }
    },
    {
      "id": "r3",
      "x": 0,
      "y": 50,
      "width": 50,
      "height": 50,
      "media": { "type": "video", "src": "/layouts/media/demo-video.mp4", "loop": true, "controls": false }
    },
    {
      "id": "r4",
      "x": 50,
      "y": 50,
      "width": 50,
      "height": 50,
      "media": { "type": "web", "src": "https://example.org", "title": "r4" }
    }
  ]
}
```

## Errores frecuentes

- `layouts` vacío en playlist.
- Ruta de layout sin prefijo `/layouts/`.
- `regions` vacío o inexistente.
- `media.type` no soportado.
- `media.src` ausente.
- Regiones fuera de rango o con tamaño `0`.
- JSON inválido (comas de más, comillas simples, comentarios inline).

## Checklist de validación rápida

- [ ] `playlist.json` existe y tiene `layouts` no vacío.
- [ ] Cada entrada de playlist apunta a un JSON existente.
- [ ] Cada layout tiene `regions` no vacío.
- [ ] Todas las regiones tienen `id`, `x`, `y`, `width`, `height`, `media`.
- [ ] Cada `media` tiene `type` válido y `src` válido.
- [ ] Los recursos referenciados existen en `public/layouts/media` (excepto URLs web).
- [ ] No hay solapes involuntarios.
- [ ] Pantalla cubierta según el diseño previsto.
