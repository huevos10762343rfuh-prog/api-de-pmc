import sqlite3

def get_connection():
    conan = sqlite3.connect("./pmc_contracts.db")
    conan.row_factory = sqlite3.Row
    try:
        yield conan
    finally:
        conan.commit()
        conan.close()


def init_db():
    conan = sqlite3.connect("./pmc_contracts.db")
    cursor = conan.cursor()
    conan.execute("CREATE TABLE IF NOT EXISTS ejercitos(id INTEGER PRIMARY KEY, nombre TEXT, cantidad INTEGER, espec TEXT, imagen TEXT, precio INTEGER);")
    conan.commit()
    conan.close()