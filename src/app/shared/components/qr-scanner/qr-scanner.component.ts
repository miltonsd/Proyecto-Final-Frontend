import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import jsQR from 'jsqr'
import { CookieService } from 'ngx-cookie-service'

import { DialogComponent } from '@pa/shared/components/dialog/dialog.component'
import { Mesa } from '@pa/shared/interfaces/mesa/mesa.interface'
import { AuthService } from '@pa/shared/services/auth.service'
import { MesaService } from '@pa/shared/services/mesa.service'

@Component({
  selector: 'pa-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: false }) videoElement!: ElementRef
  private _video!: HTMLVideoElement
  private _canvasElement!: HTMLCanvasElement
  private _canvasContext!: CanvasRenderingContext2D | null
  private _timeoutId: ReturnType<typeof setTimeout> | undefined // Almacena la identificación única del temporizador
  private _mediaStream: MediaStream | null = null // Referemcia al flujo de video de la cámara

  constructor(
    public dialogRef: MatDialogRef<QrScannerComponent>,
    public dialog: MatDialog,
    private _cookieService: CookieService,
    private _authService: AuthService,
    private _mesaService: MesaService
  ) {}

  ngAfterViewInit() {
    this._video = this.videoElement.nativeElement
    this._canvasElement = document.createElement('canvas')
    this._canvasContext = this._canvasElement.getContext('2d')

    const camara = { video: { width: 300, height: 300 } }
    navigator.mediaDevices
      .getUserMedia(camara)
      .then((stream) => {
        this._mediaStream = stream
        this._video.srcObject = this._mediaStream
        this._video.play()
        this.startScanning()
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara: ', error)
        this._showErrorDialog(
          'Error al acceder a la cámara',
          'No se pudo acceder a la cámara del dispositivo.'
        )
        this.onNoClick()
      })
  }

  // Cuando se escanea el QR o el componente se destruye
  ngOnDestroy(): void {
    this._stopCamera()
    clearTimeout(this._timeoutId) // Cancela el temporizador
  }

  startScanning() {
    this.scanQRCode()
    // Temporizador de 30 segundos
    this._timeoutId = setTimeout(() => {
      this._showErrorDialog(
        'Tiempo límite excedido',
        'No se detectó un código QR en el tiempo esperado. Intente de nuevo.'
      )
      this.onNoClick()
    }, 30000)
  }

  scanQRCode() {
    // Verifica si el componente aún existe y si el contexto del canvas está disponible
    if (!this.dialogRef.componentInstance || !this._canvasContext) {
      return // Si el dialog está cerrado, se detiene la ejecución del método
    }

    // Comprueba si _video tiene suficiente datos para renderizar un fotograma
    if (this._video.readyState === this._video.HAVE_ENOUGH_DATA) {
      // Toma el fotograma actual del <video> y lo dibuja en un <canvas>
      this._canvasElement.width = this._video.videoWidth
      this._canvasElement.height = this._video.videoHeight
      this._canvasContext.drawImage(
        this._video,
        0,
        0,
        this._canvasElement.width,
        this._canvasElement.height
      )

      // Obtiene datos de la imagen
      const imageData = this._canvasContext.getImageData(
        0,
        0,
        this._canvasElement.width,
        this._canvasElement.height
      )
      // Detecta el QR (si lo detecta contiene su información, sino será null)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      })

      // Maneja el resultado
      if (code) {
        clearTimeout(this._timeoutId) // Cancela el temporizador
        this.onQRCodeScanned(code.data) // Procesa el contenido del QR
      } else {
        requestAnimationFrame(() => this.scanQRCode()) // Crea un bucle de escaneo
      }
    } else {
      requestAnimationFrame(() => this.scanQRCode()) // Crea un bucle de escaneo
    }
  }

  // El content es el string que contiene como información el código QR -> `ID de Mesa: ${id_mesa}`
  onQRCodeScanned(content: string) {
    const id_Mesa = Number(content.slice(12))
    this._mesaService.getOneMesa(id_Mesa).subscribe((mesa: Mesa) => {
      if (mesa.habilitada) {
        const id_Usuario = this._authService.getCurrentUserId()
        // ClienteMesa = nombre de la cookie, clickear en mostrar decoficado por URL en 'Aplicacion' en Google Chrome
        this._cookieService.set('ClienteMesa', `${id_Usuario}:${id_Mesa}`, {
          path: '/' // La cookie se almacenará en el path / de la web
        })
        this._mesaService.deshabilitarMesa(id_Mesa).subscribe({
          next: () => {
            this.dialogRef.close({ data: true })
          },
          error: (err) => {
            this._showErrorDialog(`Error ${err.status}`, err.error.msg)
          }
        })
      } else {
        this._showErrorDialog(
          'Error al escanear el código QR',
          'La mesa no está habilitada para el escaneo porque ya se encuentra ocupada.'
        )
        this.onNoClick() // Cierra el dialogo
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  // Detiene las pistas del flujo del video. Apaga la cámara, evitando agotar batería y recursos
  private _stopCamera() {
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach((track) => track.stop())
    }
  }

  // Muestra un dialog indicando el error correspondiente
  private _showErrorDialog(title: string, msg: string) {
    this.dialog.open(DialogComponent, {
      width: '375px',
      autoFocus: true,
      data: { title, msg }
    })
  }
}
