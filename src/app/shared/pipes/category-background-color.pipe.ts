import { Pipe, PipeTransform } from '@angular/core';
import Color from 'color';

@Pipe({
  name: 'categoryBackgroundColor',
})
export class CategoryBackgroundColorPipe implements PipeTransform {
  transform(color: string): string {
    const rgbaColor = Color(color).alpha(0.3).string();
    return rgbaColor;
  }
}