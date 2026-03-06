import { Injectable } from "@nestjs/common";
import { UserMetricsRepository } from "../repository/user-count.repository";
import { PaginatedResult } from "common/interfaces/paginated-result.interface";
import { User } from "../entities/User.schema";

@Injectable()
export class ListAllUsersService {
    constructor(
        private readonly userMetricsRepository: UserMetricsRepository
    ) { }

    async listAllUsers(page: number = 1, limit: number = 10): Promise<PaginatedResult<User>> {
        const skip = (page - 1) * limit;
        
        // Buscar o total de usuários e os usuários da página atual
        const [total, users] = await Promise.all([
            this.userMetricsRepository.countUsers(),
            this.userMetricsRepository.getUsersWithPagination(skip, limit)
        ]);

        const lastPage = Math.ceil(total / limit);

        if (!users || users.length === 0) {
            return {
                data: [],
                meta: {
                    total,
                    page,
                    lastPage,
                    itemsPerPage: limit
                },
                message: "Nenhum usuário encontrado.",
            };
        }

        return {
            data: users,
            meta: {
                total,
                page,
                lastPage,
                itemsPerPage: limit
            },
            message: "Usuários listados com sucesso.",
        };
    }
}
