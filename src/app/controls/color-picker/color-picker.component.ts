import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Log} from '@/_services/log.service';
import {ColorUtils} from '@/controls/color-picker/color-utils';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements AfterViewInit {
  @Input()
  onFileLoaded: (content: string) => void;

  @Input()
  imageDataUrl: string;

  isActive = false;

  maxFilesize = 1000000;
  @ViewChild('canvasImage')
  canvasImage: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasLens')
  canvasLens: ElementRef<HTMLCanvasElement>;
  @ViewChild('img')
  img: ElementRef<HTMLImageElement>;
  @ViewChild('currentColor')
  currentColor: ElementRef<HTMLDivElement>;
  @ViewChild('imgSelect')
  imgSelect: ElementRef<HTMLInputElement>;
  cw: number;
  ch: number;
  pixels: Uint8ClampedArray;
  canvas: HTMLCanvasElement;
  lens: HTMLCanvasElement;
  ctxLens: CanvasRenderingContext2D;
  wl: number;
  hl: number;
  cr: DOMRect;
  currentRGB: string;

  constructor() {
  }

  ngAfterViewInit(): void {
  }

  init(): void {
    this.canvas = this.canvasImage.nativeElement;
    this.lens = this.canvasLens.nativeElement;
    const ctx = this.canvasImage.nativeElement.getContext('2d');
    this.ctxLens = this.canvasLens.nativeElement.getContext('2d');
    const img = this.img.nativeElement;
    this.cw = 400;
    this.ch = this.cw * img.height / img.width;
    this.canvas.width = this.cw;
    this.canvas.height = this.ch;
    ctx.drawImage(img, 0, 0, this.cw, this.ch);
    const imgData = ctx.getImageData(0, 0, this.cw, this.ch);
    this.pixels = imgData.data;
    // ctxLens.width = lens.clientWidth;
    this.ctxLens.fillStyle = '#ff000000';
    this.ctxLens.fillRect(0, 0, this.lens.clientWidth, this.lens.clientHeight);
    this.wl = this.ctxLens.canvas.width;
    this.hl = this.ctxLens.canvas.height;
    this.cr = this.canvas.getBoundingClientRect();
  }

  canvasMouseMove(event: MouseEvent) {
    var ClientRect = this.canvasImage.nativeElement.getBoundingClientRect();
    const m = {
      x: Math.round(event.clientX - ClientRect.left),
      y: Math.round(event.clientY - ClientRect.top)
    }
    const i = (m.x + m.y * this.cw) * 4;
    const R = this.pixels[i];
    const G = this.pixels[i + 1];
    const B = this.pixels[i + 2];
    const thisRGBRy = [R, G, B];
    this.currentRGB = ColorUtils.display_rgb(thisRGBRy);
    const xl = m.x + this.cr.left - this.wl / 2;
    const yl = m.y + this.cr.top - this.hl / 2;
    this.lens.style.left = xl + 'px';
    this.lens.style.top = yl + 'px';
    const size = 9;
    const xs = Math.floor((this.wl - 1) / size);
    const ys = Math.floor((this.hl - 1) / size);
    const x2 = Math.floor(xs / 2);
    const y2 = Math.floor(ys / 2);
    this.ctxLens.fillStyle = '#000';
    this.ctxLens.fillRect(0, 0, (xs + 1) * size, (ys + 1) * size);
    for (let y = 0; y <= ys; y++) {
      for (let x = 0; x <= xs; x++) {
        const src = (Math.floor(m.x - x2 + x) + Math.floor(m.y - y2 + y) * this.cw) * 4;
        const rs = this.pixels[src];
        const gs = this.pixels[src + 1];
        const bs = this.pixels[src + 2];
        this.ctxLens.fillStyle = ColorUtils.display_rgb([rs, gs, bs]);
        this.ctxLens.fillRect(x * size + 1, y * size + 1, size - 1, size - 1);
      }
    }
    this.currentColor.nativeElement.style.backgroundColor = this.currentRGB;
    this.currentColor.nativeElement.style.color = ColorUtils.getFontColor(thisRGBRy);
  }

  fileSelected(imageInput: any) {
    if (imageInput?.target?.files?.length > 0) {
      const reader = new FileReader();
      const file = imageInput.target.files[0];
      if (file.size < this.maxFilesize) {
        reader.addEventListener('load', (event: any) => {
          let content = event.target.result;
          this.imageDataUrl = content;
          if (this.onFileLoaded != null) {
            this.onFileLoaded(content);
          }
          const pos = content.indexOf(',');
          if (pos >= 0) {
            content = content.substring(pos + 1);
          }
          setTimeout(() => {
            this.init();
          }, 100);
        });
        reader.readAsDataURL(file);
      } else {
        Log.error($localize`Die Datei ist mit ${file.size} Bytes zu gross für den Upload.`);
      }
    } else {
      console.error(imageInput);
      Log.error(imageInput);
    }
  }

  canvasMouseOut(event: MouseEvent) {
    if (this.lens != null)
      this.lens.style.display = 'none';
  }

  canvasMouseEnter(event: MouseEvent) {
    if (this.lens != null)
      this.lens.style.display = 'block';
  }

  clickFile(event: MouseEvent) {
    event.stopPropagation();
    this.imgSelect.nativeElement.click();
  }

  clickActive(event: MouseEvent) {
    this.isActive = true;
    if (this.imageDataUrl != null && this.isActive) {
      setTimeout(() => {
        this.init();
      }, 100);
    }
  }
}
