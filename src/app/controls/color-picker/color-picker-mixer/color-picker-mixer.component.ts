import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ColorPickerBaseComponent} from '@/controls/color-picker/color-picker-base.component';
import {ColorData} from '@/_model/color-data';
import {ColorUtils} from '@/controls/color-picker/color-utils';

@Component({
  selector: 'app-color-picker-mixer',
  templateUrl: './color-picker-mixer.component.html',
  styleUrls: ['./color-picker-mixer.component.scss']
})
export class ColorPickerMixerComponent extends ColorPickerBaseComponent implements AfterViewInit {
  @ViewChild('canvasImage')
  canvasImage: ElementRef<HTMLCanvasElement>;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;
  color_tl = new ColorData([255, 0, 0]);
  color_tr = new ColorData([0, 255, 0]);
  color_bl = new ColorData([0, 0, 255]);
  color_br = new ColorData([0, 0, 255]);
  colorList = [
    {color: new ColorData([0, 0, 0])},
    {color: new ColorData([255, 255, 255])},
    {color: new ColorData([255, 0, 0])},
    {color: new ColorData([255, 255, 0])},
    {color: new ColorData([0, 255, 0])},
    {color: new ColorData([0, 255, 255])},
    {color: new ColorData([0, 0, 255])}
  ];

  constructor() {
    super();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.canvas = this.canvasImage.nativeElement;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvasImage.nativeElement.getContext('2d');
    this.paintCanvas();
  }

  paintCanvas(): void {
    const size = 1;
    const w = this.width / size;
    const h = this.height / size;
    const len = size;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.width, this.height);
    for (let yi = 0; yi < h; yi++) {
      const y = yi * size;
      for (let xi = 0; xi < w; xi++) {
        const x = xi * size;
        // const cx1 = this.calcColor(this.color_tl, this.color_tr, xi / w);
        // const cx2 = this.calcColor(this.color_bl, this.color_br, xi / w);
        // this.ctx.fillStyle = ColorUtils.display_rgb(this.calcColor(cx1, cx2, yi / h).value);
        this.ctx.fillStyle = ColorUtils.display_rgb(this.getColorAtPos(x, y).value);
        this.ctx.fillRect(x, y, len, len);
      }

    }
  }

  getColorAtPos(x: number, y: number): ColorData {
    const cx1 = this.calcColor(this.color_tl, this.color_tr, x / this.width);
    const cx2 = this.calcColor(this.color_bl, this.color_br, x / this.width);
    return this.calcColor(cx1, cx2, y / this.height);
  }

  mousePos(event: MouseEvent): any {
    return {
      x: Math.round(event.clientX - this.canvas.parentElement.parentElement.offsetLeft),
      y: Math.round(event.clientY - this.canvas.parentElement.parentElement.offsetTop)
    };
  }

  mouseMoveCanvas(event: MouseEvent) {
    const m = this.mousePos(event);
    this.colorChange?.next(this.getColorAtPos(m.x, m.y));
  }

  clickCanvas(event: MouseEvent) {
    const m = this.mousePos(event);
    if (this.colorList.length < 8) {
      this.colorList.splice(0, 0, {color: this.getColorAtPos(m.x, m.y)});
    } else {
      this.colorList[0].color = this.getColorAtPos(m.x, m.y);
    }
  }

  mixValue(v1: number, v2: number): number {
    return Math.max(v1, v2);
  }

  mixColor(c1: ColorData, c2: ColorData): ColorData {
    const ret = new ColorData(null);
    for (let i = 0; i < 3; i++) {
      ret.value[i] = this.mixValue(c1.value[i], c2.value[i]);
    }
    return ret;
  }

  calcColor(c1: ColorData, c2: ColorData, f: number): ColorData {
    const chk = this.mixColor(c1, c2);
    // if c1 is fully contained in the mix of the two colors
    // then c1 is faded and c2 is fully mixed in
    if (chk.equals(c1)) {
      c1 = this.fadeColor(c1, 1 - f);
      return this.mixColor(c1, c2);
    }
    // if c2 is fully contained in the mix of the two colors
    // then c2 is faded and c1 is fully mixed in
    if (chk.equals(c2)) {
      c2 = this.fadeColor(c2, f);
      return this.mixColor(c1, c2);
    }

    // up to 0.5 the first color is taken as it is
    if (f > 0.5) {
      // from 0.5 the first color will be faded
      // from 100% to 0 when reaching 1.0
      c1 = this.fadeColor(c1, (1 - f) * 2);
    }
    // from 0.5 the second color is taken as it is
    if (f < 0.5) {
      // up to 0.5 the second color will be faded
      // from 100% to 0 when reaching 1.0
      c2 = this.fadeColor(c2, f * 2);
    }
    return this.mixColor(c1, c2);
  }

  fadeColor(c: ColorData, f: number): ColorData {
    return new ColorData([Math.floor(f * c.value[0]),
      Math.floor(f * c.value[1]),
      Math.floor(f * c.value[2])]);
  }

  selectColor(color: ColorData) {
    return {backgroundColor: ColorUtils.display_rgb(color.value)};
  }

  clickColorSelect(color: ColorData, position: string) {
    (this as any)[`color_${position}`] = color;
    this.paintCanvas();
  }
}
