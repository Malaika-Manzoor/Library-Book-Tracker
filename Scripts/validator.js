export function ISBN_Validation(str){
      let regex = /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/
      return regex.test(str)

}