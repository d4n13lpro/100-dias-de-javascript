// Selecciona los elementos del DOM necesarios para interactuar con el documento HTML
let container = document.querySelector(".container"); // Contenedor principal de la cuadrícula
let gridButton = document.getElementById("submit-grid"); // Botón para crear la cuadrícula
let clearGridButton = document.getElementById("clear-grid"); // Botón para limpiar la cuadrícula
let gridWidth = document.getElementById("width-range"); // Selector de rango para el ancho de la cuadrícula
let gridHeight = document.getElementById("height-range"); // Selector de rango para la altura de la cuadrícula
let colorButton = document.getElementById("color-input"); // Selector de color
let eraseBtn = document.getElementById("erase-btn"); // Botón para activar el modo borrar
let paintBtn = document.getElementById("paint-btn"); // Botón para activar el modo pintar
let widthValue = document.getElementById("width-value"); // Elemento para mostrar el valor del ancho seleccionado
let heightValue = document.getElementById("height-value"); // Elemento para mostrar el valor de la altura seleccionada

// Define los eventos para los diferentes tipos de dispositivos (mouse y touch)
let events = {
    mouse: {
        down: "mousedown", // Evento para cuando el botón del mouse se presiona
        move: "mousemove", // Evento para cuando el mouse se mueve
        up: "mouseup" // Evento para cuando el botón del mouse se libera
    },
    touch: {
        down: "touchstart", // Evento para cuando se inicia un toque
        move: "touchmove", // Evento para cuando el toque se mueve
        up: "touchend", // Evento para cuando se finaliza un toque
    },
};

let deviceType = ""; // Variable para almacenar el tipo de dispositivo (mouse o touch)
let draw = false; // Variable para controlar si se está dibujando
let erase = false; // Variable para controlar si se está borrando

// Función para detectar si el dispositivo es táctil
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent"); // Intenta crear un evento de toque
        deviceType = "touch"; // Si tiene éxito, el dispositivo es táctil
        return true;
    } catch (e) {
        deviceType = "mouse"; // Si falla, el dispositivo usa mouse
        return false;
    }
};

// Ejecuta la función para detectar el tipo de dispositivo
isTouchDevice();

// Añade un event listener para crear la cuadrícula al hacer clic en el botón
gridButton.addEventListener("click", () => {
    container.innerHTML = ""; // Limpia el contenedor de la cuadrícula existente
    let count = 0; // Contador para asignar IDs únicos a las celdas

    // Itera sobre el rango de la altura seleccionada para crear filas
    for (let i = 0; i < gridHeight.value; i++) {
        count += 2; // Incrementa el contador
        let div = document.createElement("div"); // Crea un nuevo elemento div para la fila
        div.classList.add("gridRow"); // Añade la clase "gridRow" a la fila

        // Itera sobre el rango del ancho seleccionado para crear columnas
        for (let j = 0; j < gridWidth.value; j++) {
            count += 2; // Incrementa el contador
            let col = document.createElement("div"); // Crea un nuevo elemento div para la columna
            col.classList.add("gridCol"); // Añade la clase "gridCol" a la columna
            col.setAttribute("id", `gridCol${count}`); // Asigna un ID único a la columna

            // Añade un event listener para iniciar el dibujo o borrado al presionar
            col.addEventListener(events[deviceType].down, () => {
                draw = true; // Establece la variable draw a true
                if (erase) {
                    col.style.backgroundColor = "transparent"; // Borra el color si está en modo borrar
                } else {
                    col.style.backgroundColor = colorButton.value; // Pinta con el color seleccionado si está en modo pintar
                }
            });

            // Añade un event listener para el movimiento del mouse o toque
            col.addEventListener(events[deviceType].move, (e) => {
                // Obtiene el ID del elemento en la posición actual del mouse o toque
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                ).id;
                checker(elementId); // Llama a la función checker para verificar si se debe dibujar o borrar
            });

            // Añade un event listener para detener el dibujo o borrado al soltar
            col.addEventListener(events[deviceType].up, () => {
                draw = false; // Establece la variable draw a false
            });

            div.appendChild(col); // Añade la columna a la fila
        }

        container.appendChild(div); // Añade la fila al contenedor principal
    }
});

// Función para verificar si se debe dibujar o borrar una celda específica
function checker(elementId) {
    let gridColumns = document.querySelectorAll(".gridCol"); // Selecciona todas las celdas de la cuadrícula
    gridColumns.forEach((element) => {
        if (elementId == element.id) { // Si el ID del elemento coincide
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value; // Dibuja con el color seleccionado
            } else if (draw && erase) {
                element.style.backgroundColor = "transparent"; // Borra el color
            }
        }
    });
}

// Añade un event listener para limpiar la cuadrícula al hacer clic en el botón
clearGridButton.addEventListener("click", () => {
    container.innerHTML = ""; // Limpia el contenedor de la cuadrícula existente
});

// Añade un event listener para activar el modo borrar
eraseBtn.addEventListener("click", () => {
    erase = true; // Establece la variable erase a true
});

// Añade un event listener para activar el modo pintar
paintBtn.addEventListener("click", () => {
    erase = false; // Establece la variable erase a false
});

// Añade un event listener para actualizar el valor del ancho en el DOM
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value; // Muestra el valor del ancho seleccionado
});

// Añade un event listener para actualizar el valor de la altura en el DOM
gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value; // Muestra el valor de la altura seleccionada
});

// Inicializa los valores de ancho y altura de la cuadrícula al cargar la página
window.onload = () => {
    gridHeight.value = 0; // Establece el valor de la altura a 0
    gridWidth.value = 0; // Establece el valor del ancho a 0
};
