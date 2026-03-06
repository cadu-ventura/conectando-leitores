import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { AdminSchema } from '../admin/entities/Admin.schema';
import { MemoryConfig, forceGarbageCollection } from '../config/memory.config';

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;

// Configurações de otimização de memória para produção
if (process.env.NODE_ENV === 'production') {
  forceGarbageCollection();
}

const sysadminData = {
  firstName: 'SYSADMIN',
  lastName: 'SYSADMIN',
  mail: 'admin@conectando-leitores.com',
  password: '1234@Test',
  confirmPassword: '1234@Test',
  birthDate: new Date('02-06-1999'),
  roles: "sysadmin",
  createdAt: new Date(),
  updatedAt: new Date(),
}

async function bootstrap() {
  let connection: typeof mongoose | null = null;
  
  try {
    // Conecta com configurações otimizadas para produção
    connection = await mongoose.connect(DATABASE_URL, MemoryConfig.mongoose);
    
    console.log('Database Connected');

    const userModel = mongoose.model('admins', AdminSchema);

    // Verifica se já existe antes de deletar (otimização)
    const existingAdmin = await userModel.findOne({ mail: sysadminData.mail }).lean();
    
    if (existingAdmin) {
      const deleteResult = await userModel.deleteOne({ 
        mail: sysadminData.mail 
      });
      console.log(`Deletado 1 SYSADMIN existente com email ${sysadminData.mail}`);
    }

    // Hash da senha com salt reduzido para economizar memória
    const hashPassword = await bcrypt.hash(sysadminData.password, 8);

    // Criar novo admin sem spread operator para economizar memória
    const newSYSAdmin = new userModel({
      firstName: sysadminData.firstName,
      lastName: sysadminData.lastName,
      mail: sysadminData.mail,
      password: hashPassword,
      confirmPassword: sysadminData.confirmPassword,
      birthDate: sysadminData.birthDate,
      roles: sysadminData.roles,
      createdAt: sysadminData.createdAt,
      updatedAt: sysadminData.updatedAt,
    });

    await newSYSAdmin.save();

    console.log('SYSADMIN criado com sucesso');

    // Limpa variáveis para liberar memória
    delete (newSYSAdmin as any)._doc;
    
    // Força garbage collection se disponível
    forceGarbageCollection();

  } catch (error) {
    console.error('Error during bootstrapping:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.disconnect();
    }
    // Força saída do processo para liberar toda a memória
    process.exit(0);
  }
}

bootstrap();
