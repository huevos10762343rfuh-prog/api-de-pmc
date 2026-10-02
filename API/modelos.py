from pydantic import BaseModel

class ejercito(BaseModel):
    nombre : str 
    cantidad : int
    espec : str
    precio : int
    imagen : str

