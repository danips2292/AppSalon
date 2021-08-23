let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

const iniciarApp = () => {
    mostrarServicios();

    // Resalta el div actual segun el tab al q se presiona
    mostrarSeccion();

    // oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    // cambiar a pagina siguiente
    paginaSiguiente();

    // devoler a pagina anterior
    paginaAnterior();

    //comprueba la pag actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //Muestra resumen de la cita o error en caso de no pasar la validacion
    mostrarResumen();

    //Almacenar el nombre de la cita en el objeto
    nonbreCita();

    //Almacenar la fecha de la cita en el objeto
    fechaCita();

    //Deshabilita dias pasados
    deshabilitarFechaAnterior();

    //Almacena la fecha de la cita en el objeto
    horaCita();


};

const mostrarSeccion = () => {

    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
};

const cambiarSeccion = () => {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // llamar la funcion de mostrar seccion
            mostrarSeccion();

            botonesPaginador();
        });
    });
};

const mostrarServicios = async () => {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        
        const {servicios} = db;

        // Generar el html
        servicios.forEach( servicio => {
            const {id, nombre, precio} = servicio;

            //DOM Scripting
            //Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Generar precio de servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor de Servicios
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecionar servicio para la cita
            servicioDiv.onclick = selecionarServicio;

            //Inyectar precio y nombre a div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectar en el html
            document.querySelector('#servicios').appendChild(servicioDiv);

        })

    } catch (error) {
        console.error(error);
    }
};

const selecionarServicio = e => {
    let elemento;
    //Forzar que el elemento al cual le damos click sea el DIV
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(servicioObj);

        agregarServicio(servicioObj);
    }
    
};

const eliminarServicio = (id) => {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);

    console.log(cita);

}

const agregarServicio = servicioObj => {
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

const paginaSiguiente = () => {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () =>{
        pagina++;
        
        botonesPaginador();
    });
}

const paginaAnterior = () => {
    const   paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () =>{
        pagina--;
       
        botonesPaginador();
    });
}

const botonesPaginador = () => {
    
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
    if(pagina === 1 ){
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    //Cambia la seccion q se muestra por la de la pagina
    mostrarSeccion();
}

const mostrarResumen = () => {
    //Destructuring
    const {nombre,fecha,hora,servicios} = cita;

    // Seleccionar Resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpia el html previo
    while (resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //Validacion de objeto
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan servicio, nombre, hora o fecha';

        noServicios.classList.add('invalidar-cita');

        //Agregar a resumenDiv

        resumenDiv.appendChild(noServicios);

    }else{
        const headingCita = document.createElement('H3');
        headingCita.textContent = 'Resumen de Cita';

        const nombreCita = document.createElement('P');
        nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

        const horaCita = document.createElement('P');
        horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de Servicios';

        serviciosCita.appendChild(headingServicios);

        let cantidad = 0;


        //Iterar sobre el arreglo de servicios
        servicios.forEach( servicio => {
            const {nombre,precio} = servicio;
            const contenedorServicio = document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');

            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;

            const precioServicio = document.createElement('P');
            precioServicio.textContent = precio;
            precioServicio.classList.add('precio');

            const totalServicio = precio.split('$');
            cantidad += parseInt(totalServicio[1].trim());


            //Colocar nombre y precio en el div
            contenedorServicio.appendChild(nombreServicio);
            contenedorServicio.appendChild(precioServicio);

            serviciosCita.appendChild(contenedorServicio);
        });

        

        resumenDiv.appendChild(headingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);

        resumenDiv.appendChild(serviciosCita);

        const cantidadPagar = document.createElement('P');
        cantidadPagar.classList.add('total');
        cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$ ${cantidad}`;

        resumenDiv.appendChild(cantidadPagar);
    }

}

const nonbreCita = () => {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e =>{
        const nombreTexto = e.target.value.trim(); // trim elimina los espacios en blanco al inicio y final.

        //Validacion nombreTExto debe tener algo
        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no valido','error');
        } else{
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje,tipo){

    //Si hay alerta previa no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if( tipo === 'error'){
        alerta.classList.add('error');
    }

    //Insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar la alerta despues de 3 seg
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

const fechaCita = () => {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if ([0].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
           mostrarAlerta('Fines de Semana no permitidos','error');
        }else
        cita.fecha = fechaInput.value;
        console.log(cita);
    })
}

const deshabilitarFechaAnterior = () => {
    const inputFecha = document.querySelector('#fecha');

    inputFecha.min = new Date().toISOString().split("T")[0];

}

const horaCita = () => {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 8 || hora[0] > 20) {
            mostrarAlerta('Hora no valida','error');
            setTimeout(() => {
                inputHora.value='';
            }, 3000);
        }else{
            cita.hora = horaCita;
            console.log(cita);
        }
    })
}