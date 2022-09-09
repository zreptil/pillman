import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ColorData} from '@/_model/color-data';
import {ColorUtils} from '@/controls/color-picker/color-utils';
import {Log} from '@/_services/log.service';
import {ColorPickerBaseComponent} from '@/controls/color-picker/color-picker-base.component';

@Component({
  selector: 'app-color-picker-image',
  templateUrl: './color-picker-image.component.html',
  styleUrls: ['./color-picker-image.component.scss']
})
export class ColorPickerImageComponent extends ColorPickerBaseComponent implements AfterViewInit {
  @ViewChild('canvasImage')
  canvasImage: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasLens')
  canvasLens: ElementRef<HTMLCanvasElement>;
  @ViewChild('img')
  img: ElementRef<HTMLImageElement>;
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
    super();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.data.imageDataUrl != null) {
      setTimeout(() => {
        this.init();
      }, 100);
    }
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
    this.cr = this.canvasImage.nativeElement.getBoundingClientRect();
  }

  fileSelected(imageInput: any) {
    if (imageInput?.target?.files?.length > 0) {
      const reader = new FileReader();
      const file = imageInput.target.files[0];
      if (file.size < this.data.maxFilesize) {
        reader.addEventListener('load', (event: any) => {
          this.data.imageDataUrl = event.target.result;
          this.data.onDataChanged?.emit(this.data);
          setTimeout(() => {
            this.init();
          }, 100);
        });
        reader.readAsDataURL(file);
      } else {
        Log.error($localize`Die Datei hat ${file.size} Bytes, darf aber maximal ${this.data.maxFilesize} Bytes haben.`);
        Log.debug(file);
      }
    } else {
      console.error(imageInput);
      Log.error(imageInput);
    }
  }

  fillCanvas(ctx: CanvasRenderingContext2D, xbeg: number, src: number[], xdiff: number[]): number[] {
    for (let x = xbeg; x < xbeg + 256; x++) {
      const xsrc = [...src];
      for (let y = 0; y < 256; y++) {
        const rgb = [...xsrc];
        for (let i = 0; i < rgb.length; i++) {
          rgb[i] = 255 - (255 - y) * (255 - rgb[i]) / 255;
        }
        ctx.fillStyle = ColorUtils.display_rgb(rgb);
        ctx.fillRect(x, 256 - y, 1, 1);
      }
      for (let y = 0; y < 256; y++) {
        const rgb = [...xsrc];
        for (let i = 0; i < rgb.length; i++) {
          rgb[i] = (255 - y) * rgb[i] / 255;
        }
        ctx.fillStyle = ColorUtils.display_rgb(rgb);
        ctx.fillRect(x, 256 + y, 1, 1);
      }
      if (x < xbeg + 255) {
        for (let i = 0; i < src.length; i++) {
          src[i] += xdiff[i];
        }
      }
    }
    return src;
  }

  mousePos(event: MouseEvent): any {
    return {
      x: Math.round(event.clientX - (this.cr?.left ?? 0)),
      y: Math.round(event.clientY - (this.cr?.top ?? 0))
    };
  }

  getPixelAt(x: number, y: number): number[] {
    const i = (x + y * this.cw) * 4;
    let R = this.pixels[i];
    let G = this.pixels[i + 1];
    let B = this.pixels[i + 2];
    if (this.pixels[i + 3] === 0) {
      R = 255;
      G = 255;
      B = 255;
    }
    return [R, G, B];
  }

  clickCanvas(event: MouseEvent) {
    const m = this.mousePos(event);
    this.colorClick?.emit(new ColorData(this.getPixelAt(m.x, m.y)));
  }

  canvasMouseMove(event: MouseEvent) {
    const m = this.mousePos(event);
    const thisRGBRy = this.getPixelAt(m.x, m.y);
    this.currentRGB = ColorUtils.display_rgb(thisRGBRy);
    const xl = Math.round(event.clientX - this.wl / 2);
    const yl = Math.round(event.clientY - this.hl / 2);
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
        const rgb = this.getPixelAt(Math.floor(m.x - x2 + x), Math.floor(m.y - y2 + y));
        this.ctxLens.fillStyle = ColorUtils.display_rgb(rgb);
        this.ctxLens.fillRect(x * size, y * size, size, size);
      }
    }
    this.colorChange?.emit(new ColorData(thisRGBRy));
    this.lens.style.borderColor = this.currentRGB;
  }

  canvasMouseOut(_: MouseEvent) {
    if (this.lens != null) {
      this.lens.style.display = 'none';
    }
  }

  canvasMouseEnter(_: MouseEvent) {
    if (this.lens != null) {
      this.lens.style.display = 'block';
    }
  }

  parentFiredFile() {
    this.imgSelect.nativeElement.click();
  }

  parentFiredPalette() {
    if (this.cw === 256 * 6) {
      this.init();
      return;
    }
    this.cw = 256 * 6;
    this.ch = 256 * 2;
    this.canvas.width = this.cw;
    this.canvas.height = this.ch;
    const ctx = this.canvasImage.nativeElement.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, this.cw, this.ch);
    let rgb = [255, 0, 0];
    // noinspection PointlessArithmeticExpressionJS
    rgb = this.fillCanvas(ctx, 0 * 256, rgb, [0, 1, 0]);
    // noinspection PointlessArithmeticExpressionJS
    rgb = this.fillCanvas(ctx, 1 * 256, rgb, [-1, 0, 0]);
    rgb = this.fillCanvas(ctx, 2 * 256, rgb, [0, 0, 1]);
    rgb = this.fillCanvas(ctx, 3 * 256, rgb, [0, -1, 0]);
    rgb = this.fillCanvas(ctx, 4 * 256, rgb, [1, 0, 0]);
    this.fillCanvas(ctx, 5 * 256, rgb, [0, 0, -1]);
    this.pixels = ctx.getImageData(0, 0, this.cw, this.ch).data;
  }
}
