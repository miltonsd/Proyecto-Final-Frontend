import { Component, OnInit } from '@angular/core'
import { AuthService } from '@pa/shared/services/auth.service'

@Component({
  selector: 'pa-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  constructor(private _authService: AuthService) {}
  // Listado de preguntas y respuestas frecuentes
  manualUrl = ''
  faqs = [
    {
      q: '¿Existe algún requerimiento para visualizar la carta de productos?',
      a: `No, la carta puede ser visualizada sin necesidad de loguearse en el sistema. De todas formas, para poder realizar 
          pedidos desde la carta digital, se requiere estar logueado y haber escaneado el código QR de alguna de las mesas del 
          local.`
    },
    {
      q: '¿Cuáles son las utilidades de tener registrada una cuenta?',
      a: `Además de poder realizar pedidos, se pueden crear menús personalizados y acceder a un conjunto de beneficios por medio 
          de descuentos según la categoría del usuario.`
    },
    {
      q: '¿Cómo hago para reservar una mesa para más de 6 personas?',
      a: `El sistema solo permite reservar mesas de hasta 6 personas. Para reservas con una mayor cantidad de comensales, se 
          debe comunicar telefónicamente con el local.`
    },
    {
      q: '¿Cuáles son los beneficios de realizar pedidos de forma digital con respecto a la forma tradicional?',
      a: `Los beneficios son varios, entre ellos: Mayor agilidad y rapidez al momento de realizar el pedido, evitando la 
          presencia de un mozo para tomar la orden; cuanto más pedidos se realicen desde una misma cuenta, mayores 
          descuentos/promociones tendrá la misma; control en tiempo real de los platos pedidos y el total de gastos acumulados, 
          evitando llevarse una sorpresa al momento de pedir la cuenta; etc.`
    },
    {
      q: '¿Cuál sería la función de los mozos con esta forma de gestión del local?',
      a: `Los mozos estarán abocados a la gestión del estado de las mesas y a la gestión de los pedidos (tanto del estado como 
          de la entrega).`
    },
    {
      q: '¿Cómo se aplican las promociones sobre los precios de los productos?',
      a: `Cuando algún producto pertenece a una promoción que se encuentra vigente, el precio se verá reflejado en la carta, con 
          el descuento ya aplicado. Aclaración: Un producto puede estar a lo sumo en una sola promoción vigente.`
    },
    {
      q: '¿Cómo puedo realizar pedidos en el local?',
      a: `Para poder realizar pedidos, se debe haber iniciado sesión, tener una mesa asignada y mínimamente que haya un producto 
          en la carta con una cantidad seleccionada mayor que cero. La asignación de la mesa se realiza mediante el escaneo de 
          su código QR, sin embargo, el sistema al momento de que se realiza el escaneo validará si la misma está habilitada 
          para poder asignarla al cliente en cuestión.`
    },
    {
      q: '¿Cuando una mesa está habilitada?',
      a: `Una mesa está habilitada si no está asignada a ningún usuario, por lo tanto cuando sí está asignada a uno, la mesa se 
          encuentra en estado deshabilitada. Esta gestión del estado de las mesas se realiza de manera automática por parte del 
          sistema pero a su vez los mozos pueden gestionar dicho estado de manera manual por cualquier inconveniente que haya.`
    },
    {
      q: 'Necesito ayuda con el sistema.',
      a: ``
    }
  ]

  ngOnInit(): void {
    let rolUsuario: number // Almacena el rol del usuario logueado para mostrar el manual correspondiente
    if (this._authService.loggedIn()) {
      rolUsuario = this._authService.getRol() // Asigna rol de usuario
    } else {
      rolUsuario = 2 // Por defecto si no hay rol pone el de cliente (Id = 2)
    }
    switch (rolUsuario) {
      case 1: // Administrador
        this.manualUrl =
          'https://drive.google.com/file/d/1dVjn4zJqBRzI6T_Bo4ClHDkwIlt2OMxR/view?usp=drive_link'
        break
      case 3: // Mozo
        this.manualUrl =
          'https://drive.google.com/file/d/17rb9za1wPz5FBUiEPRsUvm2pB1PEOwT3/view?usp=drive_link'
        break
      case 4: // Cocina
        this.manualUrl =
          'https://drive.google.com/file/d/1oZ5MH0PRyafhe6I7bmX2cwGTVcrEZH_0/view?usp=drive_link'
        break
      default: // Cliente o Usuario no logueado
        this.manualUrl =
          'https://drive.google.com/file/d/1nFZxX9zUFetkvnMi4JF-U6qeoQnJOkYT/view?usp=drive_link'
        break
    }

    this.faqs[8].a = `Revisa el manual de usuario. <a href="${this.manualUrl}" target="_blank">Ver manual</a>`
  }
}
