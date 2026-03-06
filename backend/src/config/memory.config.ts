/**
 * Configurações de otimização de memória para produção
 * Este arquivo contém configurações específicas para ambientes com limitações de RAM
 */

export const MemoryConfig = {
  /**
   * Configurações de garbage collection
   */
  gc: {
    // Força garbage collection mais frequente em produção
    forceGC: process.env.NODE_ENV === 'production',
    // Intervalo para forçar GC (em ms)
    gcInterval: 30000,
  },

  /**
   * Configurações do Mongoose para otimização de memória
   */
  mongoose: {
    maxPoolSize: process.env.NODE_ENV === 'production' ? 5 : 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: process.env.NODE_ENV !== 'production',
  },

  /**
   * Configurações de logging otimizadas
   */
  logging: {
    // Em produção, log apenas erros e warnings
    levels: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['debug', 'error', 'log', 'warn'],
    bufferLogs: true,
  },

  /**
   * Configurações de processamento de arquivos
   */
  fileProcessing: {
    // Limite de tamanho de arquivo em MB
    maxFileSize: process.env.NODE_ENV === 'production' ? 10 : 50,
    // Timeout para processamento de arquivos (em ms)
    processingTimeout: 60000,
  },
};

/**
 * Função para forçar garbage collection em produção
 */
export function forceGarbageCollection(): void {
  if (process.env.NODE_ENV === 'production' && global.gc) {
    global.gc();
  }
}

/**
 * Função para configurar intervalos de GC em produção
 */
export function setupGarbageCollection(): void {
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      forceGarbageCollection();
    }, MemoryConfig.gc.gcInterval);
  }
}
