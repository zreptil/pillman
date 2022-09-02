import {Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild} from '@angular/core';
import {Log} from '@/_services/log.service';
import {ColorUtils} from '@/controls/color-picker/color-utils';
import {ColorData} from '@/_model/color-data';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  imageDataUrl: string;
  onFileLoaded: EventEmitter<any>;
  color: ColorData;
  colorChange: EventEmitter<ColorData>;
}

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Output()
  onFileLoaded = new EventEmitter<any>();

  @Input()
  imageDataUrl: string;

  @Input()
  color: ColorData;

  @Output()
  colorChange = new EventEmitter<ColorData>();

  constructor(public dialog: MatDialog) {
  }

  clickActivate(_: MouseEvent) {
    this.dialog.open(ColorPickerDialog, {
      data: {
        imageDataUrl: this.imageDataUrl,
        onFileLoaded: this.onFileLoaded,
        color: this.color || new ColorData([255, 255, 255]),
        colorChange: this.colorChange
      }
    })
  }
}

@Component({
  templateUrl: './color-picker-dialog.html',
  styleUrls: ['./color-picker-dialog.scss']
})
export class ColorPickerDialog {
  isActive = false;
  maxFilesize = 1000000;
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

  constructor(public dialogRef: MatDialogRef<ColorPickerDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.savedColors[0] = data.color;
    this.savedColors.push(new ColorData([0, 0, 0]));
    this.currColorIdx = 1;
    if (this.data.imageDataUrl != null) {
      setTimeout(() => {
        this.init();
      }, 100);
    }
  }

  _savedColors: ColorData[];

  get savedColors(): ColorData[] {
    if (this._savedColors == null) this._savedColors = [];
    if (this._savedColors.length < 0) this._savedColors.push(new ColorData([0, 0, 0]));
    return this._savedColors;
  }

  set savedColors(value: ColorData[]) {
    this._savedColors = value;
    if (this.savedColors.length < this.currColorIdx) {
      this.currColorIdx = this.savedColors.length - 1;
    }
  }

  _currColorIdx: number = 0;

  get currColorIdx(): number {
    return this._currColorIdx;
  }

  set currColorIdx(value: number) {
    if (value < 0) value = 0;
    if (value >= this.savedColors.length) {
      value = this._savedColors.length;
      if (this._currColorIdx < this._savedColors.length) {
        this._savedColors.push(this._savedColors[this._currColorIdx]);
      } else {
        this._savedColors.push(new ColorData([0, 0, 0]))
      }
    }
    this._currColorIdx = value;
  }

  get currentColor(): ColorData {
    if (this.savedColors == null) this.savedColors = [];
    if (this.savedColors.length < 0) this.savedColors.push(new ColorData([0, 0, 0]));
    return this.savedColors[this.savedColors.length - 1];
  }

  classForCurrColor(idx: number): string[] {
    const ret = ['color'];
    if (this.currColorIdx === idx) {
      ret.push('current');
    }
    return ret;
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

  mousePos(event: MouseEvent): any {
    return {
      x: Math.round(event.clientX - this.cr.left),
      y: Math.round(event.clientY - this.cr.top)
    };
  }

  canvasClick(event: MouseEvent) {
    const m = this.mousePos(event);
    const rgb = new ColorData(this.getPixelAt(m.x, m.y));
    const idx = this.savedColors.findIndex((c, i) => {
      return c.equals(rgb) && i !== this.currColorIdx;
    });
    if (idx >= 0) {
      if (this.currColorIdx < this.savedColors.length) {
        this._savedColors.splice(this.currColorIdx, 1);
      }
      this.currColorIdx = idx;
    } else {
      this.currColorIdx = this._savedColors.length;
    }
    while (this._savedColors.length > 10) {
      this._savedColors.splice(0, 1);
    }
    if (this._currColorIdx >= this._savedColors.length) {
      this._currColorIdx = this._savedColors.length - 1;
    }
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
        // const src = (Math.floor(m.x - x2 + x) + Math.floor(m.y - y2 + y) * this.cw) * 4;
        // const rs = this.pixels[src];
        // const gs = this.pixels[src + 1];
        // const bs = this.pixels[src + 2];
        const rgb = this.getPixelAt(Math.floor(m.x - x2 + x), Math.floor(m.y - y2 + y));
        this.ctxLens.fillStyle = ColorUtils.display_rgb(rgb);
        this.ctxLens.fillRect(x * size, y * size, size, size);
      }
    }
    this._savedColors[this.currColorIdx] = new ColorData(thisRGBRy);
    // this.currentColor.nativeElement.style.backgroundColor = this.currentRGB;
    // this.currentColor.nativeElement.style.color = ColorUtils.getFontColor(thisRGBRy);
    this.lens.style.borderColor = this.currentRGB;
  }

  fileSelected(imageInput: any) {
    if (imageInput?.target?.files?.length > 0) {
      const reader = new FileReader();
      const file = imageInput.target.files[0];
      if (file.size < this.maxFilesize) {
        reader.addEventListener('load', (event: any) => {
          let content = event.target.result;
          this.data.imageDataUrl = content;
          this.data.onFileLoaded?.emit(content);
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

  canvasMouseOut(_: MouseEvent) {
    if (this.lens != null)
      this.lens.style.display = 'none';
  }

  canvasMouseEnter(_: MouseEvent) {
    if (this.lens != null)
      this.lens.style.display = 'block';
  }

  clickFile(event: MouseEvent) {
    event.stopPropagation();
    this.imgSelect.nativeElement.click();
  }

  clickPalette(_: MouseEvent) {
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
        for (let i = 0; i < src.length; i++)
          src[i] += xdiff[i];
      }
    }
    return src;
  }

  colorClick(event: MouseEvent, color: ColorData) {
    event.stopPropagation();
    this.isActive = false;
    this.data.colorChange?.emit(color);
    this.dialogRef.close();
  }
}
