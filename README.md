# Guruxy Testing Hub

Consola de QA para pruebas beta en producción con formulario público, ingestión remota (Google Apps Script) y paneles de seguimiento (SUS + bugs).

## URL en producción (NO cambiar)
- GitHub Pages: https://haroldsthid.github.io/guruxy-testing-hub/

Mientras QA esté ejecutando pruebas, mantener estable:
1. `index.html` como entrypoint del deploy.
2. Nombre del repositorio y configuración de Pages.
3. Rutas públicas de assets usadas en formularios.

## Estructura principal
- `index.html`: fuente canónica de publicación.
- `guruxy_testing_hub_working.html`: variante de trabajo/experimentos.
- `assets/img/`: imágenes y evidencia de apoyo para formularios.
- `google_apps_script/Code.gs`: backend de submissions (GET/POST).
- `google_apps_script/README.md`: despliegue y operación del backend.
- `QA_LIVE_RUNBOOK.md`: checklist operativo durante ventana de QA activa.

## Botón de ayuda visual en preguntas
El formulario soporta una referencia visual por pregunta (imagen o video) usando:
- `reference` (wrapper compatible; `enabled: false` oculta la referencia aunque existan campos legacy)
- `mediaUrl`
- `mediaType` (`image` o `video`)
- `mediaHint`
- `mediaUrls` / `mediaItems`

Ejemplo:
```js
{
  id: 'A1.1',
  text: 'Mira el Home durante 10 segundos. ¿Qué crees que hace Guruxy?',
  type: 'Paragraph',
  options: [],
  mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-reference.jpg',
  mediaType: 'image',
  mediaHint: 'Home de Guruxy - pantalla que está evaluando el tester'
}
```

## Cargar imágenes rápido desde GitHub (sin instalar nada)
Ideal para capturas, propuestas visuales o referencias por pregunta.

1. Entrar a: https://github.com/HaroldSthid/guruxy-testing-hub/tree/main/assets/img
2. Click en `Add file` -> `Upload files`
3. Subir PNG/JPG/GIF/MP4
4. Click en `Commit changes`
5. Esperar deploy automático de GitHub Pages (~2 min)
6. Usar URL raw del archivo en `mediaUrl`:

```txt
https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/tu-archivo.png
```

## Cargar imágenes desde tu máquina (sin entrar a GitHub web)
Este flujo usa Git local y guarda los archivos en `assets/img` del repo.

Quick path:
1. Guardar la imagen/video localmente.
2. Ejecutar el script desde PowerShell.
3. Abrir la URL de GitHub que imprime el script para verla en el repo.
4. Pegarla en `mediaUrl`.

Comando:

```powershell
pwsh -File .\scripts\publish-asset.ps1 -SourcePath "C:\ruta\a\home-reference.jpg"
```

Opciones útiles:

```powershell
# Nombre custom en assets/img
pwsh -File .\scripts\publish-asset.ps1 -SourcePath "C:\ruta\a\captura.png" -Name "home-step-1"

# Mensaje de commit custom
pwsh -File .\scripts\publish-asset.ps1 -SourcePath "C:\ruta\a\flujo.mp4" -Message "chore(assets): add guru-flow video"

# Sólo commit local (sin push)
pwsh -File .\scripts\publish-asset.ps1 -SourcePath "C:\ruta\a\mock.png" -NoPush
```

Qué hace el script:
- Copia el archivo a `assets/img/` con nombre seguro.
- Ejecuta `git add`, `git commit` y `git push` (salvo `-NoPush`).
- Imprime estas URLs:
  - GitHub URL (navegable en el repo)
  - Raw URL (branch actual)
  - Raw URL (main, ideal para formularios en producción)
  - Pages URL candidata

Recomendación de uso:
- Para ver el archivo en GitHub: usar GitHub URL.
- Para `mediaUrl` en producción: usar Raw URL (main).

Requisitos:
- Tener `git` disponible en PATH.
- Tener permisos de push al repositorio.

## Flujo seguro de actualización en repo
1. Editar y validar primero en rama de trabajo.
2. Confirmar que `index.html` no rompe el flujo público.
3. Ejecutar smoke test de `QA_LIVE_RUNBOOK.md`.
4. Recién después mergear a `main`.

## Verificación rápida de contrato frontend
- Ejecutar `node .\scripts\verify-frontend-contracts.mjs` para validar el contrato puro de referencia visual y parsing de respuestas.
- Esto no toca producción ni requiere dependencias extra.

## Catálogo versionado de formularios
- Las definiciones de Forms A/B/C viven en `forms/catalog.js` como catálogo versionado.
- Cada envío guarda `formVersion` y `formSnapshot` dentro de `answers.__meta` para trazabilidad sin tocar columnas de Spreadsheet.
- Si el catálogo no carga, el hub cae en modo seguro sin romper submissions antiguas.

## Nota de estabilidad para QA
Si necesitas experimentar sin tocar producción inmediata, trabajar en `guruxy_testing_hub_working.html` y promover cambios a `index.html` solo cuando estén verificados.
