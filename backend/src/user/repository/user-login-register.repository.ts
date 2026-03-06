import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entities/User.schema'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpMessagesError } from 'common/messages/CommonMessagesHttp';
import { UpdateUserProfileDto } from '../dtos/user-update.dto';

interface DataPassword {
  id: string;
  password: string;
  changePassword: boolean;
}

@Injectable()
export class UserAccountRepository {
	@InjectModel(User.name) private readonly userModel: Model<User>;

	async createAccount(userData: Object, hashedPassword: string) {
	  const newUser = new this.userModel({
	    ...userData,
	    password: hashedPassword,
	  });

	  if (!newUser) {
	    throw new HttpException(HttpMessagesError.INTERNAL_SERVER_ERROR_EXCEPTION, HttpStatus.INTERNAL_SERVER_ERROR);
	  }
	  return newUser.save();
	}

	async updateProfile(profileData: UpdateUserProfileDto, userId: string) {
	  await this.userModel.findByIdAndUpdate(userId, {
	    ...profileData,
	    lastUpdatedAt: new Date(),
	  });
	  const updatedUser = await this.userModel.findById(userId);
	  return updatedUser;
	}

	async updateCredentials(credentials: DataPassword) {
	  await this.userModel.findByIdAndUpdate(credentials.id, {
	    ...credentials,
	    lastUpdatedAt: new Date(),
	  });
	}

	async updateAccountStatus(isActive: boolean, userId: string) {
	  await this.userModel.findByIdAndUpdate(userId, {
	    status: isActive,
	    lastUpdatedAt: new Date(),
	  });
	}

	async deleteAccount(userId: string) {
	  const deletedUser = await this.userModel.findByIdAndDelete(userId);
	  return deletedUser;
	}
}
