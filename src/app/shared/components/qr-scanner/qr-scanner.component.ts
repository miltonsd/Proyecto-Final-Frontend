import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import jsQR from 'jsqr'
import { MatDialogRef } from '@angular/material/dialog'

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

  constructor(public dialogRef: MatDialogRef<QrScannerComponent>) {}

  ngAfterViewInit() {
    this.video = this.videoElement.nativeElement
    this.canvasElement = document.createElement('canvas')
    this.canvasContext = this.canvasElement.getContext('2d')

    navigator.mediaDevices
      .getUserMedia({ video: true })
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

  onQRCodeScanned(content: string) {
    console.log('Código QR escaneado:', content)
    this.dialogRef.close({ data: content })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
