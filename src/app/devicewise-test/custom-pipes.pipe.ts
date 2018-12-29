import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subtriggers'
})
export class SubTriggerPipe implements PipeTransform {
  transform(value: any, context: string): any {
    if (value) {
      return value.filter(object => {
        return object.context.startsWith(context);
      });
    }
  }
}
