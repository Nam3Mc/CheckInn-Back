import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Decorador personalizado que valida que las contraseñas coincidan
@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  // Método de validación que compara la contraseña con la confirmación
  validate(password: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints; // Obtiene el nombre de la propiedad a comparar
    const relatedValue = (args.object as any)[relatedPropertyName]; // Obtiene el valor de la propiedad relacionada
    return password === relatedValue; // Retorna true si las contraseñas coinciden, false en caso contrario
  }

  // Mensaje de error por defecto en caso de que las contraseñas no coincidan
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Passwords do not match';
  }
}
