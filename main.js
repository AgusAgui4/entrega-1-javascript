// Lista de productos)
const productos = [
  { nombre: "Camisa", precio: 8000 },
  { nombre: "Pantalón", precio: 12000 },
  { nombre: "Zapatillas", precio: 25000 },
  { nombre: "Gorra", precio: 5000 },
];

// Carrito de compras
let carrito = [];

// Función para sumar
function sumar(a, b) {
  return a + b;
}

// mostrar los productos
function mostrarProductos() {
  let lista = "PRODUCTOS DISPONIBLES:\n\n";
  for (let i = 0; i < productos.length; i++) {
    lista += `${i + 1}. ${productos[i].nombre} - $${productos[i].precio}\n`;
  }
  alert(lista);
  console.log(lista);
}

// calcular el total
function calcularTotal(carrito) {
  let total = 0;
  for (let item of carrito) {
    total = sumar(total, item.precio);
  }
  return total;
}

alert("Bienvenido a la Tienda");

let opcion;

// funcion principal (mostrar productos- agregar producto- calcular total- salir)
do {
  opcion = prompt(
    "Elegí una opción:\n1 - Ver productos\n2 - Agregar producto al carrito\n3 - Ver total\n4 - Salir"
  );

  if (opcion === "1") {
    mostrarProductos();
  } else if (opcion === "2") {
    mostrarProductos();
    const eleccion = Number(prompt("Ingresá el número del producto que querés comprar:")
    );
    if (eleccion >= 1 && eleccion <= productos.length) {
      carrito.push(productos[eleccion - 1]);
      alert("Producto agregado al carrito");
    } else {
      alert("Opción inválida");
    }
  } else if (opcion === "3") {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
    } else {
      const total = calcularTotal(carrito);
      alert("El total de tu compra es: $" + total);
      console.log("Resumen de compra:", carrito);
    }
  } else if (opcion !== "4") {
    alert("Opción no válida. Intentá de nuevo.");
  }
} while (opcion !== "4");

alert("Gracias por visitar la tienda ¡Hasta pronto!");
