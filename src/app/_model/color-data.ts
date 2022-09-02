import {ColorUtils} from '@/controls/color-picker/color-utils';

export class ColorData {
  constructor(public value: number[]) {
    if (!Array.isArray(value)) {
      this.value = [255, 255, 255];
    }
  }

  get display(): string {
    return ColorUtils.display_rgb(this.value);
  }

  get fontDisplay(): string {
    return ColorUtils.getFontColor(this.value);
  }

  equals(value: ColorData): boolean {
    return value?.value.join(',') === this.value?.join(',');
  }
}

