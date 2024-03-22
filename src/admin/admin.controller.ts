import { Controller, Get, Query, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    @Get('create-product')
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.Admin)
    @Render('admin/create-product')
    async getViewCreateProduct(@Query() qr) {
        return await this.adminService.getProducts(qr)
    }
    @Get('order')
    @UseGuards(AuthGuard('jwt'))
    @Roles(Role.Admin)
    @Render('admin/orders')
    async getViewOrders(@Query() qr) {
        // console.log(await this.adminService.getOrders(qr));
        return await this.adminService.getOrders(qr)
    }
}
