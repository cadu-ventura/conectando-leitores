import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string> {
    transform(value: string) {
        if (!isValidObjectId(value)) {
            throw new BadRequestException('ID inválido');
        }
        return value;
    }
}