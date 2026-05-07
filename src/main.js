import './style.css'

const PLAYLIST_URL = '/layouts/playlist.json'
const DEFAULT_DURATION_MS = 10000
const TRANSITION_MS = 700

const app = document.querySelector('#app')

app.innerHTML = `
  <div id="signage-root" aria-live="off">
    <section class="screen-layer active" data-layer="a"></section>
    <section class="screen-layer" data-layer="b"></section>
  </div>
`

const layerA = app.querySelector('[data-layer="a"]')
const layerB = app.querySelector('[data-layer="b"]')

let layouts = []
let currentLayoutIndex = 0
let activeLayer = layerA
let inactiveLayer = layerB
let rotationTimerId = null
let lastManualAdvanceAt = 0

const MANUAL_ADVANCE_GUARD_MS = 250

function normalizeRegion(region) {
  return {
    id: region.id,
    x: Number(region.x ?? 0),
    y: Number(region.y ?? 0),
    width: Number(region.width ?? 100),
    height: Number(region.height ?? 100),
    media: region.media ?? null,
  }
}

function normalizeImageFit(media) {
  const requestedFit = String(media.fit ?? media.objectFit ?? 'contain').toLowerCase()

  if (requestedFit === 'cover') {
    return 'cover'
  }

  return 'contain'
}

function normalizeVideoFit(media) {
  const requestedFit = String(media.fit ?? media.objectFit ?? 'cover').toLowerCase()

  if (requestedFit === 'contain') {
    return 'contain'
  }

  return 'cover'
}

function createMediaElement(media, regionId) {
  if (!media || !media.type || !media.src) {
    throw new Error(`La región "${regionId}" no tiene media válida.`)
  }

  if (media.type === 'image') {
    const image = document.createElement('img')
    image.src = media.src
    image.alt = media.alt ?? ''
    image.loading = 'eager'
    image.decoding = 'async'
    image.className = 'region-media'
    image.style.objectFit = normalizeImageFit(media)
    return image
  }

  if (media.type === 'video') {
    const video = document.createElement('video')
    video.src = media.src
    video.className = 'region-media'
    video.autoplay = true
    video.muted = true
    video.loop = media.loop !== false
    video.playsInline = true
    video.controls = media.controls === true
    video.style.objectFit = normalizeVideoFit(media)
    return video
  }

  if (media.type === 'html' || media.type === 'web') {
    const iframe = document.createElement('iframe')
    iframe.src = media.src
    iframe.className = 'region-media'
    iframe.loading = 'eager'
    iframe.referrerPolicy = media.referrerPolicy ?? 'no-referrer-when-downgrade'
    iframe.allow = media.allow ?? 'autoplay; fullscreen'
    iframe.title = media.title ?? `iframe-${regionId}`
    return iframe
  }

  throw new Error(`Tipo de media no soportado: ${media.type}`)
}

function renderLayoutInLayer(layer, layout) {
  layer.replaceChildren()

  const fragment = document.createDocumentFragment()

  for (const regionRaw of layout.regions) {
    const region = normalizeRegion(regionRaw)
    const regionNode = document.createElement('section')
    regionNode.className = 'layout-region'
    regionNode.dataset.regionId = region.id
    regionNode.style.left = `${region.x}%`
    regionNode.style.top = `${region.y}%`
    regionNode.style.width = `${region.width}%`
    regionNode.style.height = `${region.height}%`

    const mediaNode = createMediaElement(region.media, region.id)
    regionNode.append(mediaNode)
    fragment.append(regionNode)
  }

  layer.append(fragment)
}

function activateNextLayout() {
  if (!layouts.length) {
    return
  }

  const layout = layouts[currentLayoutIndex]
  renderLayoutInLayer(inactiveLayer, layout)

  inactiveLayer.classList.add('active')
  activeLayer.classList.remove('active')

  const previousLayer = activeLayer
  activeLayer = inactiveLayer
  inactiveLayer = previousLayer

  const durationMs = Number(layout.durationMs ?? DEFAULT_DURATION_MS)
  currentLayoutIndex = (currentLayoutIndex + 1) % layouts.length

  clearTimeout(rotationTimerId)
  rotationTimerId = window.setTimeout(activateNextLayout, Math.max(durationMs, TRANSITION_MS + 100))
}

function normalizeLayouts(rawLayouts) {
  return rawLayouts.map((layout, index) => {
    if (!Array.isArray(layout.regions) || layout.regions.length === 0) {
      throw new Error(`El layout #${index + 1} no tiene regiones válidas.`)
    }

    return {
      id: layout.id ?? `layout-${index + 1}`,
      durationMs: Number(layout.durationMs ?? DEFAULT_DURATION_MS),
      regions: layout.regions,
    }
  })
}

async function loadLayouts() {
  const playlistResponse = await fetch(PLAYLIST_URL, { cache: 'no-store' })
  if (!playlistResponse.ok) {
    throw new Error(`No se pudo cargar ${PLAYLIST_URL}`)
  }

  const playlist = await playlistResponse.json()
  if (!Array.isArray(playlist.layouts) || playlist.layouts.length === 0) {
    throw new Error('La playlist no tiene layouts definidos.')
  }

  const loadedLayouts = await Promise.all(
    playlist.layouts.map(async (layoutPath) => {
      const response = await fetch(layoutPath, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`No se pudo cargar el layout ${layoutPath}`)
      }

      return response.json()
    }),
  )

  return normalizeLayouts(loadedLayouts)
}

function renderError(message) {
  app.innerHTML = `<main class="error-screen"><h1>Error de configuración</h1><p>${message}</p></main>`
}

function handleManualAdvance() {
  if (!layouts.length) {
    return
  }

  const now = Date.now()
  if (now - lastManualAdvanceAt < MANUAL_ADVANCE_GUARD_MS) {
    return
  }

  lastManualAdvanceAt = now
  activateNextLayout()
}

async function startSignage() {
  try {
    layouts = await loadLayouts()
    activateNextLayout()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    renderError(message)
  }
}

window.addEventListener('pointerdown', handleManualAdvance)

startSignage()
