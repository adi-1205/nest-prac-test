import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enums/roles.enum'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<Role>('role', [
            context.getHandler(),
        ]);
        
        if (!requiredRole) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        
        return requiredRole == req.session?.user?.role;
    }
}