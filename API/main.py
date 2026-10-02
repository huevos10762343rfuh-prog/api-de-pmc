from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlite3 import Connection
from conan import get_connection, init_db
from modelos import ejercito
from inventario import vsp

app = FastAPI()
inventario = vsp()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    print("iniciando el el mercado de pmc")
    init_db()


@app.get("/ver_ejercitos")
def ver(conn: Connection = Depends(get_connection)):
    return inventario.ver_ejercitos(conn)


@app.get("/search_for_id/{id}")
def buscar(id: int, conn: Connection = Depends(get_connection)):
    inv =  inventario.buscar(id, conn)
    if inv is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return inv

@app.post("/agregar ejercito", status_code=status.HTTP_201_CREATED)
def agregarejercitos(ejercito: ejercito, conn: Connection = Depends(get_connection)):
    return inventario.agregar_ejercitos(ejercito, conn)

@app.put("/actualizar_ejercito/{id}")
def update(id: int, ejercito: ejercito, conn: Connection = Depends(get_connection)):
    return inventario.update_ejercitos(id, ejercito, conn)

@app.delete("/delete_ejecito/{id}")
def delete(id: int, conn: Connection = Depends(get_connection)):
    return inventario.delete_ejercitos (id, conn)