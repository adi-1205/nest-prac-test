import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Req, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query, Render, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { } from 'multer';
import { ReqQuery } from 'src/interfaces/query.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('view')
  @Render('user/view-products')
  async getViewProducts(@Query() qr) {

    let { rows: _products, count } = await this.productsService.findAll(qr)

    let products = _products.map(p => {
      return {
        ...p.toJSON(),
        json: JSON.stringify(p),
        image: JSON.parse(p.images)[0]
      }
    })

    return { products, count, productPage:true}
  }
  @Get('view/:id')
  @Render('user/product')
  async getViewProduct(@Param('id', ParseIntPipe) id) {

    let product= await this.productsService.findOne(id)
    console.log(product);
    
    return {product, productPage:true}
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.Admin)
  @UseInterceptors(FilesInterceptor('image', 10, { dest: './uploads/' }))
  @UsePipes(ValidationPipe)
  create(@UploadedFiles(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 8, message: 'Max file size 8MB' }),
      new FileTypeValidator({ fileType: /image\/(jpeg|png)/i }),
    ],
  }),) files: Array<Express.Multer.File>,
    @Body() createProductDto: CreateProductDto,) {
    return this.productsService.create(createProductDto, files);
  }

  @Get()
  findAll(@Query() qr: ReqQuery) {
    return this.productsService.findAll(qr);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

}
