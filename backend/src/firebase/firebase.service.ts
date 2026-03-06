import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private storage: admin.storage.Storage;

  constructor() {}

  /**
   * Inicializa a conexão com o Firebase quando o módulo é carregado
   */
  onModuleInit() {
    // Se estivermos em modo de armazenamento local para testes, pula a inicialização do Firebase
    if (process.env.USE_LOCAL_STORAGE === 'true') {
      console.log('USE_LOCAL_STORAGE=true => pulando inicialização do Firebase (modo de testes)');
      return;
    }

    // Obtém as credenciais do Firebase das variáveis de ambiente
    const credenciaisBase64 = process.env.FIREBASE_CREDENTIALS;
    
    if (!credenciaisBase64) {
      throw new Error(
        'FIREBASE_CREDENTIALS não encontrado nas variáveis de ambiente',
      );
    }

    // Decodifica as credenciais de Base64 para JSON
    const credenciais = JSON.parse(
      Buffer.from(credenciaisBase64, 'base64').toString('utf-8'),
    );

    // Inicializa o Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(credenciais),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    // Obtém a instância do Storage
    this.storage = admin.storage();

    console.log('Firebase inicializado com sucesso');
  }

  /**
   * Retorna o bucket do Firebase Storage
   */
  getBucket() {
    return this.storage.bucket();
  }
}
