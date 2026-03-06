import { SetMetadata } from '@nestjs/common'
import { Role } from '../util/Role';


export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
