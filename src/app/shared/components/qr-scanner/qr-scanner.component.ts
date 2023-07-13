import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import jsQR from 'jsqr'
import { MatDialogRef } from '@angular/material/dialog'
import { CookieService } from 'ngx-cookie-service'
import { AuthService } from '@pa/auth/services'

@Component({
  selector: 'pa-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements AfterViewInit {
  @ViewChild('video', { static: false }) videoElement!: ElementRef
  private video!: HTMLVideoElement
  private canvasElement!: HTMLCanvasElement
  private canvasContext!: CanvasRenderingContext2D | null

  constructor(
    public dialogRef: MatDialogRef<QrScannerComponent>,
    private _cookieService: CookieService,
    private _authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.video = this.videoElement.nativeElement
    this.canvasElement = document.createElement('canvas')
    this.canvasContext = this.canvasElement.getContext('2d')

    const camara = { video: { width: 300, height: 300 } }
    navigator.mediaDevices
      .getUserMedia(camara)
      .then((stream) => {
        this.video.srcObject = stream
        this.video.play()
        this.scanQRCode()
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error)
      })
  }

  scanQRCode() {
    requestAnimationFrame(() => {
      this.canvasContext?.drawImage(
        this.video,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      )

      const imageData = this.canvasContext?.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      ) as ImageData

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      })

      if (code) {
        this.onQRCodeScanned(code.data)
      } else {
        this.scanQRCode()
      }
    })
  }

  // El content es el string que contiene como información el código QR -> `ID de Mesa: ${id_mesa}`
  onQRCodeScanned(content: string) {
    const usuario = this._authService.getCurrentUserId()
    const mesa = content.slice(12)
    console.log('Código QR escaneado:', content)
    this._cookieService.set('ClienteMesa', `${usuario}:${mesa}`) // ClienteMesa = nombre de la cookie, clickear en mostrar decoficado por URL en 'Aplicacion' en Google Chrome
    this.dialogRef.close({ data: content })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
