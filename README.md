# api-de-pmc
en esta se guarda el tp evaluativo que me dejaron en la escuela. esto se basa en lo que me parece que seria el hecho de contratar un pmc en el universo de metal gear 


este tema se me ocurrio por estar jugando al metal gear solid 5 the phantom pain y se me surgio una duda como contratan las pmc o compañias militares privadas en el mundo del juego por que no creo que haya comerciales publicitarios de pmc en la tele o no.

la estructura del archivo es la api
|-conan = conexion
|-modelos = los modelos de los objetos 
|-inventario = el manejo de los endpoints 
|- main = donde se maneja donde va cada información 
    |
    |
    |  esto va al js 
    |
    |
| main js = donde se recibe tanto la informacion de la api y la transforma en el dom 
| styles = es la forma de ver la pagina de forma bonita 
| index =   el frente de todo 

hay 5 cruds dentro del api
ver = se encarga de ver todos los datos dentro del api 
search for id = buscar por id cada objeto
agregar =  obviamente agrega un elemento a la base de datos 
upd = actualizar cualquier objeto
delete = eliminar los objetos que selecciones


La forma de instalar la api desde tu maquina necesitas son
copiar estos comandos de pip en tu vscode
pip install "fastapi[standard]"
y si no tenes 
pip install pydantic
obviamente necesitas un  interprete de python

decidi diseñar el css como esta en el por que trate de hacerlo como si fuera la terminal viejas  

Pregunta 1 — El ciclo de vida de una petición
Cuando el usuario hace clic en “Guardar” en el formulario del frontend pasa lo siguiente:

El navegador captura el evento del botón y toma los datos del formulario.
El frontend arma un objeto JSON y manda una petición HTTP (normalmente POST) hacia la API.
La petición sale del navegador, atraviesa la red y llega al backend.
El backend recibe la petición, la valida con Pydantic, llama al Manager y este escribe en SQLite.
SQLite guarda el registro en el archivo de la base de datos.
El backend responde con un código 201 y el objeto creado.
El frontend recibe la respuesta, actualiza el estado local y vuelve a pintar la pantalla.

Diagrama de secuencia (texto):
Usuario → Frontend → API → Manager → SQLite

Usuario ← Frontend ← API ← Manager ← SQLite
Pregunta 2 — ¿Quién es el cliente y quién es el servidor?
En esta app el cliente es el navegador (el frontend que corre en el navegador del usuario).

El servidor es el backend (FastAPI + SQLite) que atiende las peticiones.
Diferencia con una aplicación de escritorio tradicional:

En una app de escritorio todo corre en la misma máquina y el programa habla directo con la base de datos.

En el modelo cliente-servidor el frontend y el backend están separados: el cliente solo manda y recibe JSON, el servidor es el único que toca la base de datos.
Arquitectura simple:
Frontend (navegador)

  ↓ HTTP

Backend (FastAPI)

  ↓

Manager

  ↓

SQLite
Pregunta 3 — HTTP como lenguaje común
Los métodos HTTP dicen qué se quiere hacer:

GET → pedir datos
POST → crear
PUT → actualizar completo
DELETE → borrar

Los códigos de estado avisan cómo salió:

200 → ok
201 → creado
404 → no encontrado
422 → datos inválidos

Tabla aproximada de su API:















































OperaciónMétodoRutaCódigo de éxitoCódigo de errorCrearPOST/items/201422ListarGET/items/200404ObtenerGET/items/{id}200404ActualizarPUT/items/{id}200404 / 422BorrarDELETE/items/{id}200404
Pregunta 4 — CORS
El SOP (Same-Origin Policy) es la regla del navegador que dice: “solo podes hablar con el mismo origen (mismo protocolo + dominio + puerto)”.
Si el frontend corre en http://localhost:3000 y el backend en http://localhost:8000, el navegador bloquea la petición porque son orígenes distintos.
El middleware CORS del backend agrega cabeceras que le dicen al navegador “está permitido”. Así la petición puede pasar.
Flujo CORS:

Navegador manda preflight (OPTIONS)
Backend responde con Access-Control-Allow-Origin
Navegador deja pasar el POST/GET real

Pregunta 5 — Separación de responsabilidades
Se separa el Manager de los endpoints porque cada uno tiene una responsabilidad:

El endpoint solo recibe y responde HTTP.
El Manager solo habla con la base de datos.

La inyección de dependencias permite que FastAPI le pase la misma conexión (o sesión) a quien la necesite.

Si abrieran una conexión nueva en cada línea de código se gastarían recursos, se podrían dejar conexiones abiertas y el código se volvería un desastre de mantenimiento.
Pregunta 6 — JSON como formato de intercambio
Cliente y servidor usan JSON porque es texto simple, legible y casi todos los lenguajes lo entienden.
Pydantic toma el body, lo convierte en un modelo de Python y valida tipos, campos obligatorios, etc.

Si algo falla, devuelve automáticamente un 422 con el detalle del error.
Ejemplo de request inválido:
JSON{ "nombre": 123 }
Respuesta del servidor:
JSON{
  "detail": [
    {
      "loc": ["body", "nombre"],
      "msg": "str type expected",
      "type": "type_error.str"
    }
  ]
}
Pregunta 7 — Statelessness (sin estado)
HTTP es stateless significa que cada petición es independiente: el servidor no guarda información de la petición anterior.
El “estado” de la aplicación (los datos) está guardado en SQLite, no en la memoria del servidor.
Ventaja: si mañana ponen 3 servidores, cualquiera de ellos puede atender cualquier petición porque todos leen y escriben en la misma base de datos. No hay sesión guardada en un servidor concreto.
hecho por Juan Andrés de Zan 
