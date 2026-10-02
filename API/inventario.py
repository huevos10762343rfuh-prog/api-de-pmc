from modelos import ejercito
import sqlite3


class vsp:
    def __init__(self):
        pass

    def agregar_ejercitos(self, ejercito:ejercito, conexion: sqlite3.Connection) -> str:
        conexion.execute(
            "INSERT INTO ejercitos(nombre, espec, cantidad, imagen, precio) VALUES (?,?,?,?,?)",
            (ejercito.nombre, ejercito.espec, ejercito.cantidad, ejercito.imagen, ejercito.precio)
        )
        return f"ejercito subido {ejercito.nombre}"
    
    def ver_ejercitos(self, conan: sqlite3.Connection) -> list[dict]:
        snp = conan.execute("SELECT * FROM ejercitos").fetchall()
        return [dict(item) for item in snp]

    def delete_ejercitos (self, id: int, conchadelalora: sqlite3.Connection) -> str:
        cursor = conchadelalora.execute("DELETE FROM ejercitos WHERE id = ?", (id,))
        if cursor.rowcount == 0:
            return f"no se encontró ningún invento con la id {id}"
        return f"se eliminó el invento de la id {id}"

    def update_ejercitos(self, id: int, ejercito : ejercito, conchadetuhermana: sqlite3.Connection) -> str:
        conchadetuhermana.execute(
            "UPDATE ejercitos SET nombre = ?, espec = ?, cantidad = ?, imagen = ?, precio = ? WHERE id = ?",
            (ejercito.nombre, ejercito.espec, ejercito.cantidad, ejercito.imagen, ejercito.precio, id)
        )
        return "invento actualizado"
        
    def buscar(self, id: int, conan: sqlite3.Connection) -> dict | None:
        res = conan.execute("SELECT * FROM ejercitos WHERE id = ?", (id,)).fetchone()
        return dict(res) if res else None