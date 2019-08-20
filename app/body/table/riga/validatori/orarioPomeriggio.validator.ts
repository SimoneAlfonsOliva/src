import { AbstractControl } from '@angular/forms';

export function OrarioPomeriggioValidator(control: AbstractControl) : {[key:string]: boolean } | null {
  const inizioPomeriggio= control.get('inizioPomeriggio');
  const finePomeriggio= control.get('finePomeriggio');
  return (inizioPomeriggio.value!=='' || finePomeriggio.value!=='') ? {'obbligatorioPomeriggio':true} : null ;
}

export function OrarioPomeriggioSecondarioValidator(control: AbstractControl) : {[key:string]: boolean } | null {
  const inizioPomeriggioSecondario= control.get('inizioPomeriggioSecondario');
  const finePomeriggioSecondario= control.get('finePomeriggioSecondario');
  return (inizioPomeriggioSecondario.value!=='' || finePomeriggioSecondario.value!=='') ? {'obbligatorioPomeriggio':true} : null ;
}