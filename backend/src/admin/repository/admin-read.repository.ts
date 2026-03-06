import { Injectable } from '@nestjs/common';
import { Admin } from '../entities/Admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { searchQueries } from 'common/querys/QuerySearch';

@Injectable()
export class AdminQueryRepository {
	@InjectModel(Admin.name) private readonly adminModel: Model<Admin>;

	public async findAdminById(adminId: string) {
	    const admin = await this.adminModel.findById(adminId);
	    return admin;
	}

	public async searchAdminsByName(searchFields: string[], searchTerm: string) {
	    const searchCriteria = searchQueries(searchFields, searchTerm);
	    const matchingAdmin = await this.adminModel.find(searchCriteria);
	    return matchingAdmin;
	}

	public async findByEmail(email: string): Promise<Admin | null> {
		return this.adminModel.findOne({ mail: email }).exec();
	}

	public async findAdminByEmail(mail: string) {
	    const admin = await this.adminModel.findOne({ mail }).exec();
	    return admin;
	}
}
