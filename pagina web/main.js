const apigeneral = "http://127.0.0.1:8000";
const eae = `${apigeneral}/agregar_ejercito`; /*api del endpoint de agregar_ejercito*/
const ede = (id) =>`${apigeneral}/delete_ejercito/${id}`; /* endpoint de eliminar */
const eve = `${apigeneral}/ver_ejercitos`; /* endpoint para la lista*/
const eupd =(id) =>`${apigeneral}/actualizar_ejercito/${id}`; /* endpoint de update*/
/* porque pongo los endpoints separados de la api, es por que soy paranoico, me quiero revisar que el endpoint sea el correcto 
asi ahorro errores y lo hago mas eficiente. y es por que no me gusta los metodos con http los veo poco descriptivos y bastante 
especulativos ejemplo es como un gps y un mapa, el metodo que aplico es el mapa te muestra todo el trayecto y si me equivoco es mi culpa
lo cual lo hace mas facil de resolver en vez de simplemente confiar que el fetch esta bien escrito. me gusta complicarme la vida : ) 
*/
const section = document.querySelector('.section')
const form = document.querySelector('form')
const lista = document.querySelector('lista')
const btn = document.querySelector('.enviar')
const carrito1 = document.querySelector('.carrito')

const carrito = []
const ejercitos = []

/*aca va el fetch para poder ver los elementos de la api*/
async function ver_ejercitos(){
  const respuesta = await fetch(eve);
  const ejercitos = await respuesta.json();

  ejercitos.forEach(abc => {
    /*datos de cada pmc de la lisa*/
    const guilliman = document.createElement('li'); /*elemento de lista */
    const horus = document.createElement("img"); /*imagen del pmc */
    const perturabo = document.createElement("h2"); /*nombre del pmc */
    const sanguinius = document.createElement("p"); /* especificaciones de la pmc*/
    const vulkan = document.createElement("p"); /* cantidad de los efectivos en el momento de la pmc*/
    const dorn = document.createElement("p"); /*precio del conjunto de efectivos de la pmc*/

    /*botones de eliminar actualizar y contratar*/
    const sicarius = document.createElement("button"); /* boton de eliminar*/
    const titus = document.createElement("button"); /* boton de contrato*/
    const marneus = document.createElement("button"); /* boton de actualizar */
    sicarius.className = "eliminar";
    titus.className = "contratar";
    marneus.className = "actualizar";
    sicarius.type = "submit";
    titus.type = "submit";
    marneus.type = "submit";

    sicarius.addEventListener("click", async () => {
      try{
        const respuesta = await fetch(ede(abc.id), {method : "DELETE"});
        guilliman.remove();
        alert("se elimino exitosamente");
      }
      catch(error){
        console.error(error);
        alert("no se pudo eliminar");
      }
    });

    titus.addEventListener("click", async () => {
      try{
        const respuesta = guilliman.append(carrito);
        alert("contrato exitoso revisa el carrito");
      }
      catch (error){
        alert("se produjo un error");
      }
    });

    marneus.addEventListener("click", () => {
      const updformulario = document.createElement('form');
      const dialog = document.createElement('dialog');

      const anakin = document.createElement('input'); // cambiar de nombre
      anakin.name = "nombre";
      anakin.placeholder = "nombre";
      anakin.value = abc.perturabo;
      anakin.required = true;

      const boba = document.createElement('input'); // cambiar img
      boba.name = "imagen";
      boba.placeholder = "imagen";
      boba.value = abc.horus;
      boba.required = true;

      const obiwan = document.createElement('input'); // especificaciones
      obiwan.name = "espec";
      obiwan.placeholder = "espec";
      obiwan.value = abc.sanguinius;
      obiwan.required = true;

      const luke = document.createElement('input'); // cantidad
      luke.name = "cantidad";
      luke.type = "number";
      luke.placeholder = "cantidad";
      luke.value = abc.vulkan;
      luke.required = true;

      const cody = document.createElement('input'); // precio
      cody.name = "precio";
      cody.type = "number";
      cody.placeholder = "precio";
      cody.value = abc.dorn;
      cody.required = true;

      const rex = document.createElement('button'); // enviar
      rex.type = "submit";
      rex.append("enviar");

      rex.addEventListener("click", async (e) => {
        // datos encapsulados, con las claves del modelo de la API
        const datos = {
          nombre: anakin.value(),
          imagen: boba.value(),
          espec: obiwan.value(),
          cantidad: Number(luke.value),
          precio: Number(cody.value),
        };

        try{
          const respuesta = await fetch(eupd(abc.id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
          });

          // actualizamos la tarjeta en pantalla sin volver a pedir la lista
          horus.src = datos.imagen;
          horus.alt = datos.nombre;
          perturabo.replaceChildren(datos.nombre);
          sanguinius.replaceChildren(datos.espec);
          vulkan.replaceChildren("cantidad de efectivos por el contrato : ", datos.cantidad);
          dorn.replaceChildren("precio del contrato : ", datos.precio);

          // y guardamos los valores nuevos para la próxima vez que se abra el formulario
          abc.perturabo = datos.nombre;
          abc.horus = datos.imagen;
          abc.sanguinius = datos.espec;
          abc.vulkan = datos.cantidad;
          abc.dorn = datos.precio;

          dialog.close();
          alert("se actualizo exitosamente");
        }catch(error){
          console.error(error);
          alert("no se pudo actualizar");
        }
      });

      updformulario.append(anakin, boba, obiwan, luke, cody, rex);
      dialog.append(updformulario);
      document.body.append(dialog);
      dialog.addEventListener("close", () => dialog.remove());
      dialog.showModal();
    });

    /*append final*/
    /*nota de developer si lees esto  mas te vale no hacer preguntas sobre el nombre de las variables del codigo*/
    horus.src = abc.horus;
    horus.alt = abc.ferrus;
    perturabo.append(abc.perturabo);
    sanguinius.append(abc.sanguinius);
    vulkan.append("cantidad de efectivos por el contrato : ", abc.vulkan);
    dorn.append("precio del contrato : ", abc.dorn);

    guilliman.append(horus, perturabo, sanguinius, vulkan, dorn, sicarius, marneus, titus);
    lista.append(guilliman);
  });
}
  console.log(ver_ejercitos)
  async function añadir_ejercitos() {
    /* ya me da peresa ponerle nombres de personajes de franquicias espaciales,
    a este paso voy a soñar con una js en amarillo persiguiendome y haciendome miserable
    */
   //nota de developer 22:44 6 del 10
   //que dia de mierda a este paso voy a terminar a como el sujeto al que se refiere la cancion atrevete 
   // la cancion se refiere a una persona rigida y cuadrada a la cual le dicen que se suelte un poco asi la pasa bien
   // lastima que soy un antisocial con pocos frenos en la violencia
   //volviendo al codigo hoy descanse la mayor parte del dia pero estoy intentando revisar si el agregar funciona luego lo voy a probar y depurar espero no perder el sueño 

    const datos = {
      nombre: form.querySelector(".nombre").value,
      cantidad: Number(form.querySelector(".numero").value),
      espec: form.querySelector(".espec").value,
      imagen: form.querySelector(".imagen").value,
      precio: Number(form.querySelector(".precio").value),
    };
    try{
      const gnoquis = await fetch(eae ,{
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify(datos)
      });
      form.reset()
    }catch(error){
      console.error("no se pudo enviar",error)
    }
  }
async function verne() { // carrito
  carrito1.replaceChildren();
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.append(item.nombre, " - ", item.cantidad, " efectivos - ", item.precio);
    carrito1.append(li);
  });
}
//hace falta explicar que hace. espero que si se lo doy al coyote no explote. XD
// escribir estos comentarios me ayuda a sobrellevar este leguaje de basura aguante php
//al final en el github van a salir 40% ccomentarios, 30%js y 20%html y  10%css jajajajajajajajasjajajjjajajjajajajajajjajaj
  function renderuniversalmarcaACME(){
  ver_ejercitos(); // lista
  buscar_ejercitos(); // buscador
  enviar_ejercitos(); // formulario de agregar
  verne(); // carrito
}
function buscar_ejercitos(){
  const buscador = document.querySelector('.buscador')
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();
    Array.from(lista.children).forEach(item => {
      item.hidden = !item.dataset.nombre.includes(texto);
    });
  });
}
renderuniversalmarcaACME();
}
