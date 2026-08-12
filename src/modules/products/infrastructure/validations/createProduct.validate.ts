import { BadRequestException } from "@nestjs/common";
import { CreateProductDto } from "../../presentation/dtos/createProduct.dto";


export class CreateProductValidation  {
    static validate(dto: CreateProductDto) {
        if (!dto.metadata) {
            throw new BadRequestException('Metadata is required');
        }
        const metadata = dto.metadata;
        console.log(metadata);
        if (!metadata.length ||metadata.length < 0) {
            throw new BadRequestException('Metadata.length must be greater than 0');
        }
        if (!metadata.height || metadata.height < 0) {
            throw new BadRequestException('Metadata.height must be greater than 0');
        }
        if (!metadata.width || metadata.width < 0) {
            throw new BadRequestException('Metadata.width must be greater than 0');
        }
        if (!metadata.weight || metadata.weight < 0) {
            throw new BadRequestException('Metadata.weight must be greater than 0');
        }
    }
}