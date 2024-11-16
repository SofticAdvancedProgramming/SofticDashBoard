import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToString',
  standalone: true
})
export class EnumToStringPipe implements PipeTransform {

  transform(value: any, enumType: any): string {
    // If the value is a valid enum key, return its corresponding name (string)
    const enumKey = Object.keys(enumType).find(key => enumType[key] === value);
    return enumKey || value; // Return the string enum key or original value if not found
  }

}
