import { Injectable } from '@nestjs/common';
import { Admin } from '../entities/Admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'

@Injectable()
export class AdminMetricsRepository {
	@InjectModel(Admin.name) private readonly adminModel: Model<Admin>;

	public async getTotalAdminCount() {
	    const totalAdmin = await this.adminModel.count();
	    return totalAdmin;
	}

	
}
