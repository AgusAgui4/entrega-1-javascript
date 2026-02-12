// CARGA DE PRODUCTOS JSON //
let productos = [];
let productosCargados = false;

async function cargarProductos() {
  try {
    const response = await fetch("./data/productos.json");
    const data = await response.json();

    productos = data;
    productosCargados = true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error cargando productos",
    });
  }
}

cargarProductos();

// CARRITO //
const carritoCompra = {
  items: JSON.parse(localStorage.getItem("carrito")) || [],

  agregar(producto) {
    const item = this.items.find((p) => p.nombre === producto.nombre);

    if (item) {
      item.cantidad++;
    } else {
      this.items.push({ ...producto, cantidad: 1 });
    }
    this.guardar();
  },

  aumentar(nombre) {
    const item = this.items.find((p) => p.nombre === nombre);
    if (item) item.cantidad++;
    this.guardar();
  },

  disminuir(nombre) {
    const item = this.items.find((p) => p.nombre === nombre);
    if (item) {
      item.cantidad--;
      if (item.cantidad === 0) {
        this.eliminar(nombre);
      }
    }
    this.guardar();
  },

  eliminar(nombre) {
    this.items = this.items.filter((p) => p.nombre !== nombre);
    this.guardar();
  },

  vaciar() {
    this.items = [];
    localStorage.removeItem("carrito");
  },

  calcularTotal() {
    return this.items.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0,
    );
  },

  guardar() {
    localStorage.setItem("carrito", JSON.stringify(this.items));
  },
};

// DOM //
const listaProductos = document.getElementById("listaProductos");
const listaCarrito = document.getElementById("listaCarrito");
const totalHTML = document.getElementById("total");

const btnProductos = document.getElementById("btnProductos");
const btnTotal = document.getElementById("btnTotal");
const btnVaciar = document.getElementById("btnVaciar");
const btnFinalizar = document.getElementById("btnFinalizar");

// Inputs del cliente //
const nombreCliente = document.getElementById("nombreCliente");
const emailCliente = document.getElementById("emailCliente");
const direccionCliente = document.getElementById("direccionCliente");

window.addEventListener("DOMContentLoaded", () => {
  nombreCliente.value = localStorage.getItem("nombreCliente") || "";
  emailCliente.value = localStorage.getItem("emailCliente") || "";
  direccionCliente.value = localStorage.getItem("direccionCliente") || "";
});

// GUARDADO AUTOMATICO AL ESCRIBIR //
[nombreCliente, emailCliente, direccionCliente].forEach((input) => {
  input.addEventListener("input", () => {
    localStorage.setItem("nombreCliente", nombreCliente.value);
    localStorage.setItem("emailCliente", emailCliente.value);
    localStorage.setItem("direccionCliente", direccionCliente.value);
  });
});

// MOSTRAR PRODUCTOS //
function mostrarProductos() {
  listaProductos.innerHTML = "";

  productos.forEach((producto, index) => {
    const card = document.createElement("div");
    card.className = "productoCard";

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="infoProducto">
        <h3>${producto.nombre}</h3>
        <p class="precio">$${producto.precio}</p>
        <button class="btnAgregar">Agregar</button>
      </div>
    `;

    card.querySelector(".btnAgregar").addEventListener("click", () => {
      carritoCompra.agregar(productos[index]);

      Swal.fire({
        icon: "success",
        title: "Agregado al carrito",
        timer: 900,
        showConfirmButton: false,
      });

      mostrarCarrito();
    });

    listaProductos.appendChild(card);
  });
}

// CARRITO //
function mostrarCarrito() {
  listaCarrito.innerHTML = "";

  carritoCompra.items.forEach((item) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        ${item.nombre} | $${item.precio} x ${item.cantidad}
        = $${item.precio * item.cantidad}
      </span>
      <div class="acciones">
        <button>+</button>
        <button>-</button>
        <button class="eliminar">X</button>
      </div>
    `;

    const [btnMas, btnMenos, btnEliminar] = li.querySelectorAll("button");

    btnMas.addEventListener("click", () => {
      carritoCompra.aumentar(item.nombre);
      mostrarCarrito();
    });

    btnMenos.addEventListener("click", () => {
      carritoCompra.disminuir(item.nombre);
      mostrarCarrito();
    });

    btnEliminar.addEventListener("click", () => {
      carritoCompra.eliminar(item.nombre);
      mostrarCarrito();
    });

    listaCarrito.appendChild(li);
  });
}

// TOTAL //
function calcularTotal() {
  totalHTML.textContent = "Total: $" + carritoCompra.calcularTotal();
}

// VACIAR //
function vaciarCarrito() {
  carritoCompra.vaciar();
  mostrarCarrito();
  totalHTML.textContent = "";
}

// FINALIZAR COMPRA //
function finalizarCompra() {
  const nombre = nombreCliente.value;
  const email = emailCliente.value;
  const direccion = direccionCliente.value;

  if (carritoCompra.items.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "Agrega productos antes de finalizar",
    });
    return;
  }

  if (!nombre || !email || !direccion) {
    Swal.fire({
      icon: "error",
      title: "Faltan datos",
      text: "Completá todos los campos",
    });
    return;
  }

  // Guardar datos del cliente
  localStorage.setItem("nombreCliente", nombre);
  localStorage.setItem("emailCliente", email);
  localStorage.setItem("direccionCliente", direccion);

  Swal.fire({
    title: "Compra confirmada",
    html: `<p><b>Cliente:</b> ${nombre}</p>
          <p><b>Total:</b> $${carritoCompra.calcularTotal()}</p>`,
    icon: "success",
  });

  carritoCompra.vaciar();
  mostrarCarrito();
  totalHTML.textContent = "";
}

btnProductos.addEventListener("click", mostrarProductos);
btnTotal.addEventListener("click", calcularTotal);
btnVaciar.addEventListener("click", vaciarCarrito);
btnFinalizar.addEventListener("click", finalizarCompra);

mostrarCarrito();
