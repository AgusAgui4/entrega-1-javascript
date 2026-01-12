// PRODUCTOS
const productos = [
  { nombre: "Camisa", precio: 8000 },
  { nombre: "Pantalón", precio: 12000 },
  { nombre: "Zapatillas", precio: 25000 },
  { nombre: "Gorra", precio: 5000 },
];

//CARRITO
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
      0
    );
  },

  guardar() {
    localStorage.setItem("carrito", JSON.stringify(this.items));
  },
};

// DOM
const listaProductos = document.getElementById("listaProductos");
const listaCarrito = document.getElementById("listaCarrito");
const totalHTML = document.getElementById("total");

const btnProductos = document.getElementById("btnProductos");
const btnTotal = document.getElementById("btnTotal");
const btnVaciar = document.getElementById("btnVaciar");
const btnFinalizar = document.getElementById("btnFinalizar");

// FUNCIONES
function mostrarProductos() {
  listaProductos.innerHTML = "";

  productos.forEach((producto, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${producto.nombre} - $${producto.precio}</span>
      <button>Agregar</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      carritoCompra.agregar(productos[index]);
      mostrarCarrito();
    });

    listaProductos.appendChild(li);
  });
}

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

function calcularTotal() {
  totalHTML.textContent = "Total: $" + carritoCompra.calcularTotal();
}

function vaciarCarrito() {
  carritoCompra.vaciar();
  mostrarCarrito();
  totalHTML.textContent = "";
}

function finalizarCompra() {
  if (carritoCompra.items.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  alert("Gracias por tu compra 😊");
  carritoCompra.vaciar();
  mostrarCarrito();
  totalHTML.textContent = "";
}

// EVENTOS
btnProductos.addEventListener("click", mostrarProductos);
btnTotal.addEventListener("click", calcularTotal);
btnVaciar.addEventListener("click", vaciarCarrito);
btnFinalizar.addEventListener("click", finalizarCompra);

mostrarCarrito();
