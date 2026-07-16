# Grow AI

Plataforma educativa potenciada por inteligencia artificial. Genera videos educativos personalizados a partir de un tema o documentos de recursos.

## Stack

- **Framework:** React 19 + Vite
- **UI:** Ant Design + claymorphism custom
- **Animaciones:** Framer Motion
- **Routing:** React Router v7
- **Linting:** OxLint

## Arquitectura

```
src/
  components/    Componentes reutilizables (GlowCard, NeonButton, AnimatedBorder, etc.)
  context/       Providers globales (Auth, Theme, Videos)
  layouts/       Layouts de navegación (DashboardLayout)
  pages/         Páginas de la aplicación
  theme/         Tokens de diseño y configuración de Ant Design
  utils/         Servicios API y helpers
```

### Sistema de diseño

Todos los colores, sombras y radios viven en `src/theme/tokens.js`. Los componentes consumen estos tokens a través de `useTheme()` — no hay estilos hardcodeados en componentes ni clases CSS custom. Solo resets globales en `index.css`.

### Paleta por modo

| Modo | Superficies | Acento |
|------|------------|--------|
| Dark | `#1b201c` → `#232a25` → `#2c352e` | `#8BC34A` |
| Light | `#e4ddd5` → `#ece5dd` → `#f4ede5` | `#689F38` |

## API de generación de vídeo

Backend `Ruth` con los siguientes endpoints:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/ruth/session/create` | Crea una sesión de generación |
| `POST` | `/api/ruth/session/{slug}/upload-file` | Sube un archivo de recursos |
| `POST` | `/api/ruth/session/{slug}/start` | Inicia la generación en background |
| `GET` | `/api/ruth/session/{slug}/progress` | Consulta progreso y fase actual |
| `GET` | `/api/ruth/session/{slug}/video` | Streaming del vídeo final |

### Flujo

1. **Crear sesión** → `POST /create` con `{ topic }` → devuelve `slug`
2. **Subir archivos** → `POST /upload-file` (multipart) para cada recurso
3. **Iniciar** → `POST /start` → cambia status a `processing`
4. **Polling** → `GET /progress` cada 2s hasta `status: done | failed`
5. **Reproducir** → `<video src="/api/ruth/session/{slug}/video" />`

Stados posibles: `created`, `processing`, `done`, `failed`, `needs_human_review`

Fases: `analysis`, `design`, `script`, `coding`, `assembling`, `done`

## Instalación

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Ejecutar OxLint
```

## Estructura de páginas

| Ruta | Página |
|------|--------|
| `/` | Landing |
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/dashboard` | Generar video (principal) |
| `/dashboard/videos` | Biblioteca de videos |
| `/dashboard/courses` | Cursos disponibles |
| `/dashboard/features` | Características |
| `/dashboard/testimonials` | Testimonios |
| `/dashboard/profile` | Perfil de usuario |
