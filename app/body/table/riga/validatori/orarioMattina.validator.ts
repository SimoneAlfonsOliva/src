import { AbstractControl } from '@angular/forms';

export function OrarioMattinaValidator(control: AbstractControl) : {[key:string]: boolean } | null {
  const inizioMattina= control.get('inizioMattina');
  const fineMattina= control.get('fineMattina');
  return (inizioMattina.value!=='' || fineMattina.value!=='') ? {'obbligatorioMattina':true} : null ;
}

export function OrarioMattinaSecondarioValidator(control: AbstractControl) : {[key:string]: boolean } | null {
  const inizioMattinaSecondario= control.get('inizioMattinaSecondario');
  const fineMattinaSecondario= control.get('fineMattinaSecondario');
  return (inizioMattinaSecondario.value!=='' || fineMattinaSecondario.value!=='') ? {'obbligatorioMattina':true} : null ;
}