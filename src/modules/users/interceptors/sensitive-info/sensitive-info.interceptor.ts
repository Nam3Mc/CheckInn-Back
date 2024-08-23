import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable,map } from 'rxjs';


@Injectable()
export class sensitiveInfoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Función para excluir los campos password e isAdmin
        const excludeSensitiveFields = (obj: any) => {
          if (obj && typeof obj === 'object') {
            const { password,passwordConfirmation,roll, ...result } = obj;
            return result;
          }
          return obj;
        };

        // Si data es un array, excluye los campos de cada objeto en el array
        if (Array.isArray(data)) {
          return data.map(item => excludeSensitiveFields(item));
        }

        // Si data no es un array, excluye los campos del objeto
        return excludeSensitiveFields(data);
      }),
    );
  }
}
