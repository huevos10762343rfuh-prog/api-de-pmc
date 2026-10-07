const apigeneral = "http://127.0.0.1:8000";
const eae = `${apigeneral}/agregar%20ejercito`; /*api del endpoint de agregar_ejercito*/
const ede = (id) =>`${apigeneral}/delete_ejecito/${id}`;/* endpoint de eliminar */
const eve = `${apigeneral}/ver_ejercitos`; /* endpoint para la lista*/
const eupd =(id) =>`${apigeneral}/actualizar_ejercito/${id}`; /* endpoint de update*/
/* porque pongo los endpoints separados de la api, es por que soy paranoico, me quiero revisar que el endpoint sea el correcto 
asi ahorro errores y lo hago mas eficiente. y es por que no me gusta los metodos con http los veo poco descriptivos y bastante 
especulativos ejemplo es como un gps y un mapa, el metodo que aplico es el mapa te muestra todo el trayecto y si me equivoco es mi culpa
lo cual lo hace mas facil de resolver en vez de simplemente confiar que el fetch esta bien escrito. me gusta complicarme la vida : ) 
*/
const section = document.querySelector('.section');
const form = document.querySelector('form');
const lista = document.querySelector('.lista');
const btn = document.querySelector('.enviar');
const carrito1 = document.querySelector('.carrito');
const btncarrito = document.querySelector('.carritomexa');
const ventanacarrito = document.querySelector('.ventanacarrito');
const cerrarcarrito = document.querySelector('.cerrarcarrito');

let carrito = [];
let ejercitos = [];

/* render: se carga primero y llama a cada funcion para ir mostrando todo en la pagina */
function renderuniversalmarcaACME(){
  ver_ejercitos(); // lista
  enviar_ejercitos(); // formulario de agregar
  verne(); // carrito
  abrir_carrito(); // boton del carrito
}
renderuniversalmarcaACME();

/*aca va el fetch para poder ver los elementos de la api*/
async function ver_ejercitos(){
  const respuesta = await fetch(eve);
  ejercitos = await respuesta.json();

  lista.replaceChildren();

  ejercitos.forEach(crear_item);
}

/* crear_item: arma la tarjeta de UN pmc y la agrega a la lista.
   la usan ver_ejercitos (para toda la lista) y añadir_ejercitos (para el que se acaba de agregar) */
function crear_item(abc){
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
    sicarius.type = "button";
    titus.type = "button";
    marneus.type = "button";
    sicarius.append("eliminar");
    titus.append("contratar");
    marneus.append("actualizar");

    sicarius.addEventListener("click", async () => {
      try{
        const respuesta = await fetch(ede(abc.id), {method : "DELETE"});
        if(!respuesta.ok){
          throw new Error("error " + respuesta.status);
        }
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
        carrito.push(abc);
        verne();
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
      anakin.value = abc.nombre;

      const boba = document.createElement('input'); // cambiar img
      boba.name = "imagen";
      boba.placeholder = "imagen";
      boba.value = abc.imagen;

      const obiwan = document.createElement('input'); // especificaciones
      obiwan.name = "espec";
      obiwan.placeholder = "espec";
      obiwan.value = abc.espec;

      const luke = document.createElement('input'); // cantidad
      luke.name = "cantidad";
      luke.type = "number";
      luke.placeholder = "cantidad";
      luke.value = abc.cantidad;

      const cody = document.createElement('input'); // precio
      cody.name = "precio";
      cody.type = "number";
      cody.placeholder = "precio";
      cody.value = abc.precio;

      const rex = document.createElement('button'); // enviar
      rex.type = "submit";
      rex.append("enviar");

      rex.addEventListener("click", async (e) => {
        e.preventDefault();
        // datos encapsulados, con las claves del modelo de la API
        const datos = {
          nombre: anakin.value,
          imagen: boba.value,
          espec: obiwan.value,
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
          guilliman.dataset.nombre = datos.nombre.toLowerCase();

          // y guardamos los valores nuevos para la próxima vez que se abra el formulario
          abc.nombre = datos.nombre;
          abc.imagen = datos.imagen;
          abc.espec = datos.espec;
          abc.cantidad = datos.cantidad;
          abc.precio = datos.precio;

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
    horus.src = abc.imagen;
    horus.alt = abc.nombre;
    perturabo.append(abc.nombre);
    sanguinius.append(abc.espec);
    vulkan.append("cantidad de efectivos por el contrato : ", abc.cantidad);
    dorn.append("precio del contrato : ", abc.precio);
    guilliman.dataset.nombre = abc.nombre.toLowerCase();

    guilliman.append(horus, perturabo, sanguinius, vulkan, dorn, sicarius, marneus, titus);
    lista.append(guilliman);
}
  async function añadir_ejercitos() {
    /* ya me da peresa ponerle nombres de personajes de franquicias espaciales,
    a este paso voy a soñar con una js en amarillo persiguiendome y haciendome miserable
    */
   //nota de developer 22:44 6 del 10
   //que dia de mierda a este paso voy a terminar a como el sujeto al que se refiere la cancion atrevete 
   // la cancion se refiere a una persona rigida y cuadrada a la cual le dicen que se suelte un poco asi la pasa bien
   //volviendo al codigo hoy descanse la mayor parte del dia pero estoy intentando revisar si el agregar funciona luego lo voy a probar y depurar espero no perder el sueño 
    try{
      const datos = {
        nombre: form.querySelector(".nombre").value,
        cantidad: Number(form.querySelector(".numero").value),
        espec: form.querySelector(".espec").value,
        imagen: form.querySelector(".imagen").value,
        precio: Number(form.querySelector(".precio").value),
      };
      const gnoquis = await fetch(eae ,{
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify(datos)
      });
      if(!gnoquis.ok){
        throw new Error("error " + gnoquis.status);
      }
      form.reset();
      await ver_ejercitos();
      alert("se agrego exitosamente");
    }catch(error){
      console.error("no se pudo enviar",error);
      alert("no se pudo agregar, revisa la consola");
    }
  }
function enviar_ejercitos(){ // activa el boton enviar del formulario
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    añadir_ejercitos();
  });
}
function buscar_ejercitos(){
  buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();
    Array.from(lista.children).forEach(item => {
      item.hidden = !item.dataset.nombre.includes(texto);
    });
  });
}
function abrir_carrito(){  // ver el carrito
  btncarrito.addEventListener("click", () => {
    ventanacarrito.showModal();
  });
  cerrarcarrito.addEventListener("click", () => {
    ventanacarrito.close();
  });
}
async function verne() {  // agregar al carrito
  carrito1.replaceChildren();
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.append(item.nombre, " - ", item.cantidad, " efectivos - ", item.precio);
    carrito1.append(li);
  });
}
