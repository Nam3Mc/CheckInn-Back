import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roll } from "src/modules/entities/users.entity";

@Injectable()
export class RollsGuard implements CanActivate {

    constructor (
        private readonly reflector: Reflector
    ){}

    canActivate(context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const requiredRolls = this.reflector.getAllAndOverride<Roll[]>("rolls", [
            context.getHandler(), 
            context.getClass()
        ])
        
        const request = context.switchToHttp().getRequest()
        const user = request.user
        const hasRoll = () => 
            requiredRolls.some(roll => user?.roll.includes(roll))
            const valid = user && user.roll && hasRoll()

            if (!valid ) {
                throw new ForbiddenException("You do not have permition and are not allow to access this route")
            } else {
                return valid
            }
    }
}