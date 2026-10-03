const api = "http://127.0.0.1:8000"

const section = document.getElementById('.section')
const form = document.getElementById('.form')
const lista = document.getElementById('.ul')



ejercitos = []

/*aca va el fetch para poder ver los elementos de la api*/
 async function ver_ejercitos(){
    const ver_lista = fetch(api)
    const datos = request.json()
    ejercitos = datos
  }
  console.log(ver_ejercitos)
