# Guía de Administración - Club Deportivo Quito

Esta guía proporciona instrucciones detalladas sobre cómo utilizar el panel de administración para gestionar el sitio web de Club Deportivo Quito.

## Contenido

1. [Acceso al Panel de Administración](#acceso-al-panel-de-administración)
2. [Gestión de Noticias](#gestión-de-noticias)
3. [Gestión de Partidos](#gestión-de-partidos)
4. [Gestión de Jugadores](#gestión-de-jugadores)
5. [Gestión de Patrocinadores](#gestión-de-patrocinadores)
6. [Gestión de Usuarios](#gestión-de-usuarios)
7. [Configuración del Sitio](#configuración-del-sitio)

## Acceso al Panel de Administración

1. Accede al panel de administración en `/admin`
2. Inicia sesión con tus credenciales de administrador
3. Una vez iniciada la sesión, serás redirigido al panel principal

## Gestión de Noticias

### Crear Nueva Noticia

1. En el menú lateral, haz clic en "Noticias" → "Añadir Nueva"
2. Completa el formulario con:
   - **Título**: Título principal de la noticia
   - **Extracto**: Breve resumen de la noticia (aparecerá en listados)
   - **Contenido**: Contenido completo de la noticia (editor visual)
   - **Imagen**: Sube una imagen destacada
   - **Categoría**: Selecciona la categoría apropiada
   - **Etiquetas**: Añade etiquetas relevantes (separadas por comas)
   - **Estado**: Publicado o Borrador
   - **Fecha de publicación**: Fecha y hora de publicación
3. Haz clic en "Guardar" para crear la noticia

### Editar Noticia Existente

1. En el menú lateral, haz clic en "Noticias" → "Todas las Noticias"
2. Busca la noticia que deseas editar
3. Haz clic en el botón "Editar"
4. Modifica los campos necesarios
5. Haz clic en "Actualizar" para guardar los cambios

### Eliminar Noticia

1. En el listado de noticias, haz clic en el botón "Eliminar" junto a la noticia
2. Confirma la eliminación cuando se te solicite

## Gestión de Partidos

### Añadir Nuevo Partido

1. En el menú lateral, haz clic en "Partidos" → "Añadir Nuevo"
2. Completa el formulario con:
   - **Competición**: Selecciona la competición
   - **Temporada**: Indica la temporada
   - **Jornada**: Indica la jornada o fase
   - **Fecha y Hora**: Selecciona la fecha y hora del partido
   - **Equipo Local**: Selecciona el equipo local
   - **Equipo Visitante**: Selecciona el equipo visitante
   - **Estadio**: Indica el estadio donde se jugará
   - **Estado**: Programado, En vivo, Finalizado, etc.
   - **URL de Entradas**: Enlace para comprar entradas (opcional)
   - **URL de Transmisión**: Enlace para ver la transmisión (opcional)
3. Haz clic en "Guardar" para crear el partido

### Actualizar Resultado de Partido

1. En el menú lateral, haz clic en "Partidos" → "Todos los Partidos"
2. Busca el partido que deseas actualizar
3. Haz clic en el botón "Actualizar Resultado"
4. Introduce:
   - **Goles Local**: Goles marcados por el equipo local
   - **Goles Visitante**: Goles marcados por el equipo visitante
   - **Estado**: Actualiza a "FINALIZADO" si el partido ha terminado
5. Haz clic en "Guardar" para actualizar el resultado

### Actualizar Partido en Vivo

1. En el listado de partidos, busca el partido que está en curso
2. Haz clic en "Actualizar en Vivo"
3. Actualiza:
   - **Goles Local**: Goles actuales del equipo local
   - **Goles Visitante**: Goles actuales del equipo visitante
   - **Minuto**: Minuto actual del partido
   - **Estado**: Debe ser "LIVE"
4. Haz clic en "Actualizar" para actualizar la información en tiempo real

## Gestión de Jugadores

### Añadir Nuevo Jugador

1. En el menú lateral, haz clic en "Jugadores" → "Añadir Nuevo"
2. Completa el formulario con:
   - **Nombre**: Nombre completo del jugador
   - **Número**: Número de camiseta
   - **Posición**: Selecciona la posición del jugador
   - **Fecha de Nacimiento**: Fecha de nacimiento
   - **Nacionalidad**: País de origen
   - **Altura**: Altura en centímetros
   - **Peso**: Peso en kilogramos
   - **Foto**: Sube una foto del jugador
   - **Biografía**: Información biográfica y trayectoria
   - **Fecha de Incorporación**: Fecha en que se unió al club
   - **Contrato Hasta**: Fecha de finalización del contrato
   - **Clubes Anteriores**: Lista de clubes anteriores
   - **Redes Sociales**: Enlaces a perfiles de redes sociales
3. Haz clic en "Guardar" para añadir el jugador

### Actualizar Estadísticas de Jugador

1. En el listado de jugadores, busca el jugador que deseas actualizar
2. Haz clic en "Actualizar Estadísticas"
3. Actualiza:
   - **Apariciones**: Número de partidos jugados
   - **Goles**: Goles marcados
   - **Asistencias**: Asistencias de gol
   - **Tarjetas Amarillas**: Número de tarjetas amarillas
   - **Tarjetas Rojas**: Número de tarjetas rojas
   - **Minutos Jugados**: Total de minutos jugados
4. Haz clic en "Guardar" para actualizar las estadísticas

## Gestión de Patrocinadores

### Añadir Nuevo Patrocinador

1. En el menú lateral, haz clic en "Patrocinadores" → "Añadir Nuevo"
2. Completa el formulario con:
   - **Nombre**: Nombre del patrocinador
   - **Logo**: Sube el logo del patrocinador
   - **URL**: Enlace al sitio web del patrocinador
   - **Descripción**: Breve descripción del patrocinador
   - **Nivel**: Selecciona el nivel de patrocinio
   - **Activo**: Indica si el patrocinador está activo
   - **Fecha de Inicio**: Fecha de inicio del patrocinio
   - **Fecha de Fin**: Fecha de finalización del patrocinio
   - **Orden de Visualización**: Número para ordenar la visualización
3. Haz clic en "Guardar" para añadir el patrocinador

## Gestión de Usuarios

### Crear Nuevo Usuario

1. En el menú lateral, haz clic en "Usuarios" → "Añadir Nuevo"
2. Completa el formulario con:
   - **Nombre de Usuario**: Identificador único para el usuario
   - **Correo Electrónico**: Dirección de correo electrónico
   - **Contraseña**: Contraseña segura
   - **Rol**: Selecciona el rol (Admin, Editor, Visualizador)
3. Haz clic en "Crear Usuario" para añadir el usuario

### Editar Permisos de Usuario

1. En el listado de usuarios, haz clic en "Editar" junto al usuario
2. Modifica el rol según sea necesario
3. Haz clic en "Actualizar" para guardar los cambios

## Configuración del Sitio

### Ajustes Generales

1. En el menú lateral, haz clic en "Configuración" → "General"
2. Actualiza la información según sea necesario:
   - **Nombre del Sitio**: Nombre que aparece en el título de la página
   - **Descripción**: Breve descripción del sitio
   - **Correo de Contacto**: Dirección de correo para contacto
   - **Redes Sociales**: Enlaces a perfiles de redes sociales

### Configuración de API Deportiva

1. En "Configuración" → "API Deportiva"
2. Introduce o actualiza:
   - **Clave API**: Clave de acceso a la API deportiva
   - **Equipo Principal**: ID del equipo para seguimiento especial
   - **Intervalo de Actualización**: Frecuencia de actualización de datos

---

Esta guía cubre las operaciones básicas del panel de administración. Para asistencia adicional, contacta al equipo de soporte técnico.