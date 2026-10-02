const api = "http://127.0.0.1:8000/docs"
const form = document.querySelector(".form form");
const pista = document.getElementById("pista");
const btnAnt = document.getElementById("ant");
const btnSig = document.getElementById("sig");
const lista = document.querySelector(".lista ul");

const inputNombre = form.querySelector('input[placeholder="nombre"]');
const inputCantidad = form.querySelector('input[placeholder="cantidad"]');
const inputEspec = form.querySelector('input[placeholder="espec"]');
const inputImagen = form.querySelector('input[placeholder="imagen por url"]');
const inputPrecio = form.querySelector('input[placeholder="precio"]');

let ejercitos = [];
let indice = 0;

const aviso = document.createElement("p");
aviso.style.textAlign = "center";
aviso.style.minHeight = "1.2em";
document.body.insertBefore(aviso, document.getElementById("carrusel"));

pista.style.flexDirection = "row";

function mostrarMensaje(texto, esError) {
  if (esError) {
    aviso.style.color = "#ff4d4d";
  } else {
    aviso.style.color = "#41FF00";
  }
  aviso.textContent = texto;
}

function urlSegura(url) {
  try {
    let u = new URL(url);
    if (u.protocol == "http:" || u.protocol == "https:") {
      return u.href;
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
}

function enteroValido(valor) {
  let n = Number(valor);
  if (Number.isInteger(n) && n >= 0) {
    return n;
  } else {
    return null;
  }
}

function crearImagen(e) {
  let img = document.createElement("img");
  img.alt = e.nombre;
  let src = urlSegura(e.imagen);
  if (src != "") {
    img.src = src;
  }
  img.addEventListener("error", function () {
    img.removeAttribute("src");
  });
  return img;
}

function cuerpo(e) {
  return JSON.stringify({
    nombre: e.nombre,
    cantidad: e.cantidad,
    espec: e.espec,
    imagen: e.imagen,
    precio: e.precio,
  });
}

async function api(ruta, metodo, cuerpoPedido) {
  let opciones = {
    method: metodo,
    headers: { "Content-Type": "application/json" },
  };
  if (cuerpoPedido) {
    opciones.body = cuerpoPedido;
  }
  let res = await fetch(API + ruta, opciones);
  if (!res.ok) {
    throw new Error("Error " + res.status);
  }
  return res.json();
}

async function cargar() {
  try {
    ejercitos = await api("/ver_ejercitos", "GET");
    render();
  } catch (error) {
    console.log(error);
    mostrarMensaje("No se pudo conectar con la API", true);
  }
}

async function agregar(e) {
  let msg = await api("/agregar%20ejercito", "POST", cuerpo(e));
  mostrarMensaje(msg);
  await cargar();
}

async function eliminar(e) {
  if (!confirm("¿Eliminar \"" + e.nombre + "\"?")) {
    return;
  }
  try {
    let msg = await api("/delete_ejecito/" + encodeURIComponent(e.id), "DELETE");
    mostrarMensaje(msg);
    await cargar();
  } catch (error) {
    console.log(error);
    mostrarMensaje("No se pudo eliminar", true);
  }
}

async function contratar(e) {
  if (e.cantidad <= 0) {
    mostrarMensaje("No hay unidades disponibles de " + e.nombre, true);
    return;
  }
  let texto = prompt("¿Cuántas unidades de \"" + e.nombre + "\" querés contratar? (disponibles: " + e.cantidad + ")", "1");
  if (texto === null) {
    return;
  }
  let n = enteroValido(texto);
  if (n === null || n < 1 || n > e.cantidad) {
    mostrarMensaje("Cantidad inválida", true);
    return;
  }
  try {
    let nuevo = {
      nombre: e.nombre,
      cantidad: e.cantidad - n,
      espec: e.espec,
      imagen: e.imagen,
      precio: e.precio,
    };
    await api("/actualizar_ejercito/" + encodeURIComponent(e.id), "PUT", cuerpo(nuevo));
    mostrarMensaje("Contrataste " + n + " de " + e.nombre + " por $" + n * e.precio);
    await cargar();
  } catch (error) {
    console.log(error);
    mostrarMensaje("No se pudo contratar", true);
  }
}

function editar(e, contenedor) {
  contenedor.textContent = "";

  let titulo = document.createElement("p");
  titulo.textContent = "Editando: " + e.nombre;

  let iNombre = document.createElement("input");
  iNombre.type = "text";
  iNombre.placeholder = "nombre";
  iNombre.value = e.nombre;

  let iCantidad = document.createElement("input");
  iCantidad.type = "number";
  iCantidad.placeholder = "cantidad";
  iCantidad.value = e.cantidad;

  let iEspec = document.createElement("input");
  iEspec.type = "text";
  iEspec.placeholder = "espec";
  iEspec.value = e.espec;

  let iImagen = document.createElement("input");
  iImagen.type = "text";
  iImagen.placeholder = "imagen por url";
  iImagen.value = e.imagen;

  let iPrecio = document.createElement("input");
  iPrecio.type = "number";
  iPrecio.placeholder = "precio";
  iPrecio.value = e.precio;

  let bGuardar = document.createElement("button");
  bGuardar.type = "button";
  bGuardar.textContent = "guardar";

  let bCancelar = document.createElement("button");
  bCancelar.type = "button";
  bCancelar.textContent = "cancelar";

  bGuardar.addEventListener("click", async function () {
    let cantidad = enteroValido(iCantidad.value);
    let precio = enteroValido(iPrecio.value);
    let nombre = iNombre.value.trim();
    let espec = iEspec.value.trim();
    let imagen = iImagen.value.trim();

    if (nombre == "" || espec == "" || cantidad === null || precio === null || urlSegura(imagen) == "") {
      mostrarMensaje("Revisá los campos (la imagen debe ser una URL http/https)", true);
      return;
    }

    try {
      let actualizado = {
        nombre: nombre,
        cantidad: cantidad,
        espec: espec,
        imagen: imagen,
        precio: precio,
      };
      await api("/actualizar_ejercito/" + encodeURIComponent(e.id), "PUT", cuerpo(actualizado));
      mostrarMensaje("Actualizado: " + nombre);
      await cargar();
    } catch (error) {
      console.log(error);
      mostrarMensaje("No se pudo actualizar", true);
    }
  });

  bCancelar.addEventListener("click", render);

  contenedor.append(titulo, iNombre, iCantidad, iEspec, iImagen, iPrecio, bGuardar, bCancelar);
}

function crearAcciones(e, contenedor) {
  let div = document.createElement("div");
  div.className = "acciones";

  let bActualizar = document.createElement("button");
  bActualizar.type = "button";
  bActualizar.textContent = "actualizar";
  bActualizar.addEventListener("click", function () {
    editar(e, contenedor);
  });

  let bContratar = document.createElement("button");
  bContratar.type = "button";
  bContratar.textContent = "contratar";
  bContratar.addEventListener("click", function () {
    contratar(e);
  });

  let bEliminar = document.createElement("button");
  bEliminar.type = "button";
  bEliminar.textContent = "eliminar";
  bEliminar.addEventListener("click", function () {
    eliminar(e);
  });

  div.append(bActualizar, bContratar, bEliminar);
  return div;
}

function crearDatos(e) {
  let datos = [];

  let pEspec = document.createElement("p");
  pEspec.textContent = "Especialidad: " + e.espec;

  let pCantidad = document.createElement("p");
  pCantidad.textContent = "Disponibles: " + e.cantidad;

  let pPrecio = document.createElement("p");
  pPrecio.textContent = "Precio: $" + e.precio;

  datos.push(pEspec, pCantidad, pPrecio);
  return datos;
}

function renderCarrusel() {
  pista.textContent = "";

  if (ejercitos.length === 0) {
    let slide = document.createElement("div");
    slide.className = "slide";
    let p = document.createElement("p");
    p.textContent = "No hay pmc en el catálogo";
    slide.append(p);
    pista.append(slide);
    return;
  }

  for (let i = 0; i < ejercitos.length; i++) {
    let e = ejercitos[i];
    let slide = document.createElement("div");
    slide.className = "slide";

    slide.append(crearImagen(e));

    let h2 = document.createElement("h2");
    h2.textContent = e.nombre;
    slide.append(h2);

    let datos = crearDatos(e);
    for (let j = 0; j < datos.length; j++) {
      slide.append(datos[j]);
    }

    slide.append(crearAcciones(e, slide));
    pista.append(slide);
  }
}

function renderLista() {
  lista.textContent = "";

  if (ejercitos.length === 0) {
    let li = document.createElement("li");
    li.textContent = "No hay pmc en el catálogo";
    lista.append(li);
    return;
  }

  for (let i = 0; i < ejercitos.length; i++) {
    let e = ejercitos[i];
    let li = document.createElement("li");
    li.className = "item";

    let img = crearImagen(e);
    img.style.width = "100px";
    img.style.height = "70px";
    img.style.objectFit = "cover";
    li.append(img);

    let nombre = document.createElement("strong");
    nombre.textContent = e.nombre;
    li.append(nombre);

    let datos = crearDatos(e);
    for (let j = 0; j < datos.length; j++) {
      li.append(datos[j]);
    }

    li.append(crearAcciones(e, li));
    lista.append(li);
  }
}

function moverCarrusel() {
  if (ejercitos.length === 0) {
    indice = 0;
  } else {
    if (indice < 0) {
      indice = ejercitos.length - 1;
    }
    if (indice >= ejercitos.length) {
      indice = 0;
    }
  }
  pista.style.transform = "translateX(" + indice * -100 + "%)";
}

function render() {
  renderCarrusel();
  renderLista();
  moverCarrusel();
}

btnAnt.addEventListener("click", function () {
  indice--;
  moverCarrusel();
});

btnSig.addEventListener("click", function () {
  indice++;
  moverCarrusel();
});

form.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  let nombre = inputNombre.value.trim();
  let espec = inputEspec.value.trim();
  let imagen = inputImagen.value.trim();
  let cantidad = enteroValido(inputCantidad.value);
  let precio = enteroValido(inputPrecio.value);

  if (nombre == "" || espec == "" || cantidad === null || precio === null || urlSegura(imagen) == "") {
    mostrarMensaje("Completá todos los campos (la imagen debe ser una URL http/https)", true);
    return;
  }

  let nueva = {
    nombre: nombre,
    cantidad: cantidad,
    espec: espec,
    imagen: imagen,
    precio: precio,
  };

  try {
    await agregar(nueva);
    form.reset();
  } catch (error) {
    console.log(error);
    mostrarMensaje("No se pudo agregar la pmc", true);
  }
});

cargar();
