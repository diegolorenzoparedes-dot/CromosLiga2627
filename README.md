# Cromos Liga 2026-27

Aplicación Android offline para gestionar la colección Panini Liga Este 2026-27.

## Funciones V1
- Catálogo de 593 posiciones de la colección 2026-27.
- Cantidad por cromo: 0 = falta, 1 = colección, 2+ = repetidos.
- Búsqueda por código, jugador o equipo/sección.
- Filtros: Álbum, Faltan, Repetidos y Tengo.
- Entrada rápida de varios códigos separados por comas.
- Progreso total, faltantes, repetidos y número de copias.
- Compartir faltantes y repetidos.
- Copia de seguridad/restauración mediante texto JSON.
- Datos almacenados exclusivamente en el teléfono (localStorage de WebView).

## Compilar
Abrir el proyecto en Android Studio (JDK 17, Android SDK 35) o ejecutar el workflow de GitHub Actions incluido.

El APK debug se genera en `app/build/outputs/apk/debug/app-debug.apk`.
