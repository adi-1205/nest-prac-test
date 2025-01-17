
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.redirect('/auth/signin'); // Redirect to login page
    }
}
