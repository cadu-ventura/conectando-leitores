import { Injectable } from '@nestjs/common';
import { User } from '../entities/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'

@Injectable()
export class UserMetricsRepository {
    @InjectModel(User.name) private readonly userModel: Model<User>;

    public async countUsers(): Promise<number> {
        return await this.userModel.countDocuments();
    }

    public async getUsersWithPagination(skip: number, limit: number): Promise<User[]> {
        return await this.userModel
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.userModel.find();
    }
}
