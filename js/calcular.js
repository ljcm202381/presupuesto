//Crear variables para selectores

const formulario = document.querySelector('#agregar-gastos');
const listagasto = document.querySelector('#gastos ul');

//eventos
cargarpagina();//se esta llamando a la funcion principal
function cargarpagina()
{
  document.addEventListener('DOMContentLoaded',preguntar);
  formulario.addEventListener('submit',agregarGasto);
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
    this.gastos = this.gastos.filter(gasto =>gasto.id.toString()!== id);
    this.dinerorestante();
  }

  dinerorestante()
  {
    const gastado = this.gastos.reduce((total,restante)=> total+gasto.Valor,0);
    this.disponible = this.presupuesto-gastado;
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
    gastos.forEach(gasto=>{
      const{Nombre,Valor,id}=gasto;
      const nuevogasto = document.createElement('li');
      nuevogasto.className ='list-group-item d-flex justify-content-between align-items-center';
      nuevogasto.dataset.id=id;

      nuevogasto.innerHTML= `${Nombre}<span class="badge badge-primary badge-pill">${Valor}</span>
      `;
    })
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
     const gasto = {Nombre, Valor,id:Date.now()};

     presupuesto.nuevoGasto(gasto);

     inte.imprimiralerta('correcto', 'Es valido');

     const {gastos}=presupuesto;
     inte.agregargastolistado(gastos);
   }



}

