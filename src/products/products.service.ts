import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from 'src/database/models/product.model';
import { ReqQuery } from 'src/interfaces/query.interface';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {

  constructor(@InjectModel(Product) private ProductModel: typeof Product) {
  }

  async create(createProductDto: CreateProductDto, files: Array<Express.Multer.File>) {
    if (files.length == 0)
      throw new BadRequestException('Image shoulg not be empty')
    let images = []
    files.forEach(file => {
      images.push(file.filename)
    });
    return this.ProductModel.create({ ...createProductDto, images: JSON.stringify(images) });
  }

  async findAll(qr) {
    const where = {}
    const page = parseInt(qr.page, 10) || 1;
    const limit = page == 1 ? 12 : (parseInt(qr.limit, 10) || 10);
    const offset = (page - 1) * limit;
    const sortOrder = ['DESC', 'ASC'].includes(qr.sortOrder) ? qr.sortOrder : 'DESC'
    const sortBy = ['createdAt', 'price', 'name'].includes(qr.sortBy) ? qr.sortBy : 'createdAt'
    const search = qr.search
    if (search) {
      where['name'] = {
        [Op.like]: `%${search}%`
      };
    }

    let { rows, count } = await this.ProductModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]]
    })
    return { count, rows };
  }

  async findOne(id: number) {
    const _product = await this.ProductModel.findByPk(id);
    if (!_product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    let product = {
      ..._product.dataValues,
      image: JSON.parse(_product.images)[0],
      images: JSON.parse(_product.images).length > 1 ? JSON.parse(_product.images).slice(1) : []
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    console.log('DTO', updateProductDto);

    const product = await this.ProductModel.findByPk(id);
    await product.update(updateProductDto);
    await product.save()
    return updateProductDto;
  }

  async remove(id: number) {
    const product = await this.ProductModel.findByPk(id);
    await product.destroy();
  }
}
