import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Admin } from '../entities/Admin.schema'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpMessagesError } from 'common/messages/CommonMessagesHttp';
import { UpdateAdminProfileDto } from '../dtos/admin-update.dto';

interface DataPassword {
  id: string;
  password: string;
  changePassword: boolean;
}

@Injectable()
export class AdminAccountRepository {
	@InjectModel(Admin.name) private readonly adminModel: Model<Admin>;

	async createAccount(adminData: Object, hashedPassword: string) {
	  const newAdmin = new this.adminModel({
	    ...adminData,
	    password: hashedPassword,
	  });

	  if (!newAdmin) {
	    throw new HttpException(HttpMessagesError.INTERNAL_SERVER_ERROR_EXCEPTION, HttpStatus.INTERNAL_SERVER_ERROR);
	  }
	  return newAdmin.save();
	}

	async updateProfile(profileData: UpdateAdminProfileDto, adminId: string) {
	  await this.adminModel.findByIdAndUpdate(adminId, {
	    ...profileData,
	    lastUpdatedAt: new Date(),
	  });
	  const updatedAdmin = await this.adminModel.findById(adminId);
	  return updatedAdmin;
	}

	async updateCredentials(credentials: DataPassword) {
	  await this.adminModel.findByIdAndUpdate(credentials.id, {
	    ...credentials,
	    lastUpdatedAt: new Date(),
	  });
	}

	async updateAccountStatus(isActive: boolean, adminId: string) {
	  await this.adminModel.findByIdAndUpdate(adminId, {
	    status: isActive,
	    lastUpdatedAt: new Date(),
	  });
	}

	async deleteAccount(adminId: string) {
	  const deletedAdmin = await this.adminModel.findByIdAndDelete(adminId);
	  return deletedAdmin;
	}
}
