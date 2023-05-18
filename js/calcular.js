//Crear variables para selectores

const formulario = document.querySelector('#agregar-gastos');
const listagasto = document.querySelector('#gastos ul');

//eventos
cargarpagina();//se esta llamando a la funcion principal
function cargarpagina()
{
  document.addEventListener('DOMContentLoaded',preguntar);
  formulario.addEventListener('submit',agregarGasto);
 listagasto.addEventListener('click', eliminarGasto);
}

//clases
class Presupuesto
{
	constructor(presupuesto)//inicia los atributos de la clase
	{
		this.presupuesto = Number(presupuesto);
		this.disponible  = Number(presupuesto);
		this.gastos = [];
	}
  nuevoGasto(gasto)
  {
    this.gastos=[...this.gastos,gasto];
    this.dinerorestante();
  }

  eliminargasto(id)
  {
    this.gastos = this.gastos.filter(gasto => gasto.id.toString() !== id );
    this.dinerorestante();
  }

  dinerorestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.Valor, 0);
        this.restante = this.presupuesto - gastado;
    }

}

class Interfaz
{
   insertardinero(valor)
   {
   	const {presupuesto,disponible}=valor;
   	//agregar al html;
   	document.querySelector('#total').textContent = presupuesto;
   	document.querySelector('#restante').textContent = disponible;
   }
   imprimiralerta(mensaje,tipo)
   {
   	//crear el div
   	const divMensaje = document.createElement('div');
   	divMensaje.classList.add('text-center','alert');

   	//de acuerdo al tipo de error se agrega la clase
    if(tipo === 'error')
    {
    	divMensaje.classList.add('alert-danger');
    }else
    {
    	divMensaje.classList.add('alert-succes');
    }
     //mensaje de error
    divMensaje.textContent = mensaje;

    //Se inserte en el DOM
    document.querySelector('.contenido1').insertBefore(divMensaje,formulario);
      
   }
   agregargastolistado(gastos)
   {
    this.limpiar();
    gastos.forEach(gasto=>{
      const{Nombre,Valor,id}=gasto;
      const nuevoGasto = document.createElement('li');
      nuevoGasto.className ='list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id=id;

      nuevoGasto.innerHTML= `${Nombre}<span class="badge badge-primary badge-pill">$ ${Valor}</span>
      `;

        // boton borrar gasto.
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';
            nuevoGasto.appendChild(btnBorrar);

            // Insertar al HTML
            listagasto.appendChild(nuevoGasto);
    });
   
}
// Comprueba el presupuesto restante
    actualizarRestante(restante) {
        document.querySelector('span#restante').textContent = restante; 
    }

     // Cambia de color el presupuesto restante
     comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('#restante');

         console.log(restante);
       console.log( presupuesto);

        // Comprobar el 25% 
        if( (presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si presupuesta es igual a 0 
        if(restante <= 0 ) {
            inte.imprimiralerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } 

        
    }

    limpiar() {
        while(listagasto.firstChild) {
            listagasto.removeChild(listagasto.firstChild);
        }
    }
}

//instanciar clases de forma global
let presupuesto;
const inte = new Interfaz();


//funciones

function preguntar()
{
  const presupuestousu = prompt("Ingrese su presupuesto");
  console.log(presupuestousu);

  //Validar el campo
  if(presupuestousu === '' || presupuestousu === null || isNaN(presupuestousu) || presupuestousu <=0)
  {
  	window.location.reload();
  }

  //insertar el presupuesto valido

  presupuesto = new Presupuesto(presupuestousu);
  inte.insertardinero(presupuesto);
}
function agregarGasto(e)
{
  e.preventDefault();

   //leer los datos del formulario
  const Nombre = document.querySelector('#gasto').value;
  const Valor = Number(document.querySelector('#cantidad').value);

  //validar que los campos no esten vacios
   if(Nombre === '' || Valor === '')
   {
      inte.imprimiralerta('los campos son obligatorios','error');
   }else if(Valor<=0 || isNaN(Valor))
   {
     inte.imprimiralerta('Cantidad no es valida');


   }else 
   {
     const gasto = {Nombre, Valor, id: Date.now() };

     presupuesto.nuevoGasto(gasto);

     inte.imprimiralerta('Correcto', 'correcto');

     const { gastos } = presupuesto;

     inte.agregargastolistado(gastos);
    // Cambiar la clase que nos avisa si se va terminando
            inte.comprobarPresupuesto(presupuesto);

            // Actualiza el presupuesto restante
            const { restante } = presupuesto;

            // Actualizar cuanto nos queda
            inte.actualizarRestante(restante)

            // Reiniciar el form
            formulario.reset();
     }
}

function eliminarGasto(e) {
    if(e.target.classList.contains('borrar-gasto')){
        const { id } = e.target.parentElement.dataset;
        presupuesto.eliminargasto(id);
        // Reembolsar
        inte.comprobarPresupuesto(presupuesto);

        // Pasar la cantidad restante para actualizar el DOM
        const { restante } = presupuesto;
        inte.actualizarRestante(restante);

        // Eliminar del DOM
        e.target.parentElement.remove();
    } 
}
