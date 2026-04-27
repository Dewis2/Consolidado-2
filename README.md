# Hospital Dr. Sano - Gestión de Pacientes (Angular)

Aplicación web frontend para gestionar pacientes del hospital **Dr. Sano** con operaciones CRUD completas, validaciones robustas, control de aforo máximo y persistencia local con `localStorage`.

## Funcionalidades principales

- Registrar paciente.
- Listar pacientes.
- Ver detalle de paciente.
- Editar paciente.
- Eliminar paciente (con confirmación).
- Control de aforo máximo: **10 pacientes**.
- Mensajes visuales de éxito, error y advertencia.
- Indicador de aforo en pantalla: `Pacientes registrados: X / 10`.
- Diseño responsive con Bootstrap.

## Estructura del proyecto

```text
src/
  app/
    models/
      patient.model.ts
    services/
      patient.service.ts
    components/
      patient-list/
      patient-form/
      patient-detail/
    app.component.ts
    app.component.html
    app.routes.ts
  styles.css
```

## Rutas

- `/pacientes` → listado.
- `/pacientes/nuevo` → registro.
- `/pacientes/editar/:id` → edición.
- `/pacientes/detalle/:id` → detalle.
- Ruta vacía redirige a `/pacientes`.

---

## Guía detallada para ejecutar en Windows

### 1) Requisitos previos

Instala:
- **Node.js** (recomendado LTS).
- **Angular CLI** global.

Verifica versiones:

```bash
node -v
npm -v
ng version
```

> Si `ng` no existe, revisa la sección de errores comunes.

### 2) Crear el proyecto (si empiezas desde cero)

```bash
ng new hospital-dr-sano --routing --style=css
```

### 3) Entrar a la carpeta del proyecto

```bash
cd hospital-dr-sano
```

### 4) Instalar Bootstrap

```bash
npm install bootstrap
```

### 5) Importar Bootstrap

Tienes dos opciones:

#### Opción A (recomendada): `angular.json`
En `projects.hospital-dr-sano.architect.build.options.styles` agrega:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.css"
]
```

#### Opción B: `src/styles.css`

```css
@import 'bootstrap/dist/css/bootstrap.min.css';
```

### 6) Generar componentes y servicio (opcional si construyes manualmente)

```bash
ng generate component components/patient-list
ng generate component components/patient-form
ng generate component components/patient-detail
ng generate service services/patient
```

### 7) Instalar dependencias

```bash
npm install
```

### 8) Ejecutar proyecto

```bash
ng serve
```

Abre en el navegador:

```text
http://localhost:4200
```

---

## Errores comunes y solución

### Error: “ng no se reconoce como comando”

1. Instala Angular CLI globalmente:
   ```bash
   npm install -g @angular/cli
   ```
2. Cierra y abre la terminal.
3. Verifica nuevamente:
   ```bash
   ng version
   ```

### Error: “Cannot find module ...”

1. Elimina `node_modules` y `package-lock.json`.
2. Reinstala:
   ```bash
   npm install
   ```
3. Ejecuta otra vez `ng serve`.

### Puerto 4200 ocupado

Ejecuta en otro puerto:

```bash
ng serve --port 4300
```

Luego abre `http://localhost:4300`.

### Error con dependencias

- Revisa versión de Node (usa LTS reciente).
- Limpia caché:
  ```bash
  npm cache clean --force
  npm install
  ```

### Problemas al instalar Bootstrap

1. Verifica internet y permisos de terminal.
2. Ejecuta:
   ```bash
   npm install bootstrap --save
   ```
3. Comprueba que esté en `package.json` y correctamente importado.

---

## Cómo explicar el proyecto en clase

### ¿Qué hace el sistema?
Permite gestionar pacientes del hospital Dr. Sano: crear registros, listarlos, ver detalle, editar y eliminar, todo desde el navegador.

### ¿Qué es CRUD?
CRUD significa:
- **Create**: crear paciente.
- **Read**: listar/ver detalle.
- **Update**: editar datos.
- **Delete**: eliminar paciente.

### ¿Cómo se controla el aforo máximo de 10 pacientes?
El servicio central define `maxPatients = 10`, expone señales de conteo y capacidad, bloquea altas cuando se llega al límite y muestra alertas en interfaz.

### ¿Qué validaciones tiene el formulario?
- DNI obligatorio, numérico y de 8 dígitos.
- Nombres y apellidos obligatorios, mínimo 2 caracteres.
- Edad obligatoria entre 0 y 120.
- Sexo obligatorio.
- Teléfono obligatorio, numérico y de 9 dígitos.
- Dirección obligatoria, mínimo 5 caracteres.
- Diagnóstico obligatorio, mínimo 5 caracteres.
- Fecha de ingreso obligatoria.
- DNI no duplicado (con excepción del mismo registro al editar).

### ¿Por qué se usó LocalStorage?
Porque el proyecto es 100% frontend sin backend: `localStorage` permite persistir datos entre recargas y pruebas locales.

### ¿Por qué se usó Bootstrap?
Para acelerar un diseño profesional y responsive con componentes reutilizables: navbar, tabla responsive, alertas, botones y formularios.

### ¿Qué parte corresponde al frontend?
Toda la aplicación: vistas, rutas, formularios, validaciones, estado y persistencia local. No hay API ni base de datos externa.

### ¿Qué son los formularios reactivos?
Son formularios manejados desde TypeScript con `FormGroup` y `FormControl`, permitiendo validaciones declarativas y control preciso del estado.

### ¿Qué son signals en Angular y cómo se usaron?
Signals son una forma reactiva moderna de manejar estado. En este proyecto se usan para mantener la lista de pacientes, conteo, estado de aforo y mensajes derivados en tiempo real.

---

## Checklist de requisitos cumplidos

- [x] CRUD de pacientes.
- [x] Máximo 10 pacientes.
- [x] Mínimo 5 datos por paciente (se incluyen 9 campos clínico-administrativos).
- [x] Aplicación responsive.
- [x] Angular.
- [x] Formularios reactivos.
- [x] Signals.
- [x] Bootstrap.
- [x] Validaciones completas.
- [x] Persistencia en LocalStorage.
