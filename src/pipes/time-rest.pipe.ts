import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerest'
})
export class TimeRestPipe implements PipeTransform {
  transform(futureTime: string): string {

    const now = new Date().getTime()
    const d = new Date(futureTime).getTime()
    const diff = d - now

    if (diff < 0) {
      return '已过期'
    }
    const oneSecond = 1 * 1000
    const oneMinute = 60 * oneSecond
    const oneHour = 60 * oneMinute
    const oneDay = 24 * oneHour
  
    if (diff < oneMinute) {
      return `还有${Math.floor(diff / oneSecond)}秒`
    }
  
    if (diff < oneHour) {
      return `还有${Math.floor(diff / oneMinute)}分钟`
    }
  
    if (diff < oneDay) {
      const hours = Math.floor(diff / oneHour)
      const minutes = Math.floor((diff % oneHour) / oneMinute)
  
      return `还有${hours}小时${minutes}分钟`
    }

    const days = Math.floor(diff / oneDay)
    return `还有${days}天`
  }
}