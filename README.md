# api-de-pmc![Logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnhk-JbYFBRR5WB0P7Pbb5EZ6FZ6wOdof2PBG9KWU-BA&s=10)

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
algo asi 
![Diseño Excalidraw 1](https://excalidraw.com/#json=ycyKwcHB4CqBB2LCTwOKB,FZTAyKZfsWk6C-aW8S5OPw)

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
 las 7 preguntas 
 Pregunta 1: El ciclo de vida de una petición

Cuando hago clic en "Guardar" en el formulario del frontend pasa lo siguiente:

El navegador detecta el evento del botón y agarra los datos que cargué en el formulario.
El frontend arma un objeto JSON y manda una petición HTTP (normalmente un POST) hacia mi API.
La petición sale del navegador, viaja por la red y llega al backend.
El backend la recibe y la valida con Pydantic. Después llama al Manager, que es el que escribe en SQLite.
SQLite guarda el registro en el archivo de la base de datos.
El backend me responde con un código 201 y el objeto que se creó.
El frontend recibe la respuesta, actualiza el estado local y vuelve a dibujar la pantalla.

Diagrama de secuencia (en texto):

Usuario → Frontend → API → Manager → SQLite
Usuario ← Frontend ← API ← Manager ← SQLite
Pregunta 2: ¿Quién es el cliente y quién es el servidor?

En mi app el cliente es el navegador, o sea el frontend que corre en la máquina del usuario. El servidor es el backend (FastAPI + SQLite), que es el que atiende las peticiones.

La diferencia con una aplicación de escritorio tradicional es esta:

En una app de escritorio todo corre en la misma máquina y el programa habla directo con la base de datos.
En el modelo cliente-servidor el frontend y el backend están separados. El cliente solo manda y recibe JSON, y el servidor es el único que toca la base de datos.

Arquitectura simple:

Frontend (navegador)
      ↓ HTTP
Backend (FastAPI)
      ↓
Manager
      ↓
SQLite
Pregunta 3: HTTP como lenguaje común

Los métodos HTTP le dicen al servidor qué quiero hacer:

GET: pedir datos
POST: crear
PUT: actualizar completo
DELETE: borrar

Los códigos de estado me avisan cómo salió la operación:

200: ok
201: creado
404: no encontrado
422: datos inválidos

Tabla aproximada de mi API:

Operación	Método	Ruta	Código de éxito	Código de error
Crear	POST	/items/	201	422
Listar	GET	/items/	200	404
Obtener	GET	/items/{id}	200	404
Actualizar	PUT	/items/{id}	200	404 / 422
Borrar	DELETE	/items/{id}	200	404
Pregunta 4: CORS

El SOP (Same-Origin Policy) es una regla del navegador que dice que solo puedo hablar con el mismo origen, es decir mismo protocolo, dominio y puerto. Si mi frontend corre en http://localhost:3000 y el backend en http://localhost:8000, el navegador bloquea la petición porque son orígenes distintos.

El middleware CORS del backend agrega cabeceras que le avisan al navegador que esa comunicación está permitida, y así la petición puede pasar.

Flujo CORS:

El navegador manda un preflight (OPTIONS).
El backend responde con Access-Control-Allow-Origin.
El navegador deja pasar el POST o GET real.
Pregunta 5: Separación de responsabilidades

Separo el Manager de los endpoints porque cada uno tiene su responsabilidad:

El endpoint solo recibe y responde HTTP.
El Manager solo se ocupa de hablar con la base de datos.

La inyección de dependencias hace que FastAPI le pase la misma conexión (o sesión) a quien la necesite. Si abriera una conexión nueva en cada línea de código, se gastarían recursos al pedo, se podrían quedar conexiones abiertas y el código sería un desastre de mantener.

Pregunta 6: JSON como formato de intercambio

Cliente y servidor usan JSON porque es texto simple, se lee fácil y casi todos los lenguajes lo entienden. Pydantic agarra el body, lo convierte en un modelo de Python y valida los tipos, los campos obligatorios, etc. Si algo falla, devuelve automáticamente un 422 con el detalle del error.

Ejemplo de request inválido:

json
{ "nombre": 123 }

Respuesta del servidor:

json
{
  "detail": [
    {
      "loc": ["body", "nombre"],
      "msg": "str type expected",
      "type": "type_error.str"
    }
  ]
}
Pregunta 7: Statelessness (sin estado)

Que HTTP sea stateless significa que cada petición es independiente: el servidor no se acuerda de lo que pasó en la petición anterior. El "estado" de mi aplicación (los datos) está guardado en SQLite y no en la memoria del servidor.

La ventaja es que si mañana pongo 3 servidores, cualquiera puede atender cualquier petición, porque todos leen y escriben en la misma base de datos. No hay ninguna sesión guardada en un servidor en particular.

hecho por Juan Andrés de Zan 
en memoria del proyecto anterior que lo voy a dejar en papel
![Diseño Excalidraw 2](https://excalidraw.com/#json=v-Dly2a9f3GTLBHOuZJhl,R-M0A6V-zU237fs595a_kA)
