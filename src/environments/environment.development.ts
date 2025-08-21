export const environment = {
  production: false,
  // apiUrl: 'http://localhost:3000' // El backend solo funciona en la computadora que lo está corriendo
  apiUrl: 'http://' + window.location.hostname + ':3000' // Permite el funcionamiento del backend desde localhost y cualquier dispositivo en red
}
