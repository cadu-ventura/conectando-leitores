import { Injectable } from '@nestjs/common';
import { User } from '../entities/User.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { searchQueries } from 'common/querys/QuerySearch';

@Injectable()
export class UserQueryRepository {
	@InjectModel(User.name) private readonly userModel: Model<User>;

	public async findUserById(userId: string) {
	    const user = await this.userModel.findById(userId);
	    return user;
	}

	public async searchUsersByName(searchFields: string[], searchTerm: string) {
	    const searchCriteria = searchQueries(searchFields, searchTerm);
	    const matchingUsers = await this.userModel.find(searchCriteria);
	    return matchingUsers;
	}

	public async findByEmail(email: string): Promise<User | null> {
		return this.userModel.findOne({ mail: email }).exec();
	}

	public async findUserByEmail(mail: string) {
	    const user = await this.userModel.findOne({ mail }).exec();
	    return user;
	}
}
