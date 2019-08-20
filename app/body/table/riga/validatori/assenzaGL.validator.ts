import { AbstractControl } from '@angular/forms';

export function AssenzaGLValidator(control: AbstractControl) : {[key:string]: boolean } | null {
    const motivoAssenza= control.get('motivoAssenza');
 return (motivoAssenza.value==='ferie' || motivoAssenza.value==='malattia' ) ? {'disabilita':true} : null ;
}