import { Pipe, PipeTransform } from '@angular/core';
import Color from 'color';
@Pipe({
  name: 'categoryTextColor',
})
export class CategoryTextColorPipe implements PipeTransform {
  transform(color: string): string {
    const rgbaColor = Color(color).string();
    return rgbaColor;
  }
}