// ...existing code...
import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseService } from '../../firebase/firebase.service';
import { Book } from '../entities/book.schema';
import { UploadBookDto } from '../dtos/bookUpload.dto';
import { StatusLivro } from '../enums/book.enums';
import { v4 as uuidv4 } from 'uuid';
import type { Express } from 'express';
import converterDataString from '../../middleware/converterDataString';
import calcularChecksum from '../../middleware/calcularChecksum';
import obterExtensao from '../../middleware/obterExtensao';
import sanitizarNomeArquivo from '../../middleware/sanitizarNomeArquivo';
const pdfParse = require('pdf-parse');
const Epub = require('epub-gen');
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { promisify } from 'util';
import { converterPdfParaEpub } from '../../middleware/converterPdfParaEpub';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class UploadBookService {

    /**
     * Lista livros pendentes para análise de admins
     */
    async listarLivrosPendentes() {
      const livros = await this.bookModel.find({ status: StatusLivro.PENDENTE })
        .select('title author category description releaseDate uploadedBy status book')
        .populate('uploadedBy', 'firstName lastName mail')
        .sort({ createdAt: -1 })
        .lean();
      // Mapeia para incluir url da capa no topo do objeto e formatar dados do usuário
      return livros.map(livro => {
        const user = livro.uploadedBy as any;
        return {
          ...livro,
          coverUrl: livro.book?.cover?.url || '',
          uploadedByName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Desconhecido',
          uploadedByEmail: user?.mail || '',
        };
      });
    }
  /**
   * Lista livros ativos, ordenados por título, com paginação
   */
  async listarLivrosAtivos(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const query = { status: StatusLivro.APROVADO };
    const livros = await this.bookModel.find(query)
      .select('title author category')
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await this.bookModel.countDocuments(query);
    return {
      page,
      limit,
      total,
      livros,
    };
  }
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) { }

  /**
   * Configuração da capa padrão quando o usuário não enviar uma capa
   */
  private getCapaPadrao(): Express.Multer.File {
    // Retorna null para indicar que não há arquivo de capa, usaremos a URL padrão
    return null as any;
  }  

  /**
   * Faz o upload de um livro e sua capa para o Firebase Storage
   * e salva as informações no MongoDB.
   * Se o arquivo for PDF, converte para EPUB antes de salvar.
   * @param arquivoLivro - Arquivo do livro a ser enviado
   * @param arquivoCapa - Imagem da capa a ser enviada (opcional)
   * @param uploadBookDto - Dados do livro
   * @param userId - ID do usuário que está fazendo o upload
   * @param statusLivro - Status do livro baseado na role do usuário
   * @returns Informações do livro cadastrado
   */
  async uploadLivroComCapa(
    arquivoLivro: Express.Multer.File,
    arquivoCapa?: Express.Multer.File,
    uploadBookDto?: UploadBookDto,
    userId?: string,
    statusLivro?: string,
  ) {

    try {
      // Valida se já existe um livro com o mesmo título e autor
      const livroDuplicado = await this.bookModel.findOne({
        title: { $regex: new RegExp(`^${uploadBookDto.title}$`, 'i') },
        author: { $regex: new RegExp(`^${uploadBookDto.author}$`, 'i') },
      }).lean();

      if (livroDuplicado) {
        throw new BadRequestException('Não foi possível concluir o upload. Tente novamente.');
      }

  // Se não foi fornecida uma capa, usa a URL padrão do Firebase da variável de ambiente
  const capaParaUsar = arquivoCapa || null;
  const urlCapaPadrao = process.env.FIREBASE_DEFAULT_COVER_URL;
      
      const useLocalStorage = process.env.USE_LOCAL_STORAGE === 'true';

      // Sanitiza o título do livro para usar como nome de pasta
      const nomePastaSanitizado = sanitizarNomeArquivo(uploadBookDto.title);

      // Define o caminho base no Storage
      const caminhoBase = `oraculo/livros/${nomePastaSanitizado}`;

      let bufferParaSalvar = arquivoLivro.buffer;
      let mimeTypeFinal = arquivoLivro.mimetype;
      let extensaoFinal = obterExtensao(arquivoLivro.originalname);
      let nomeOriginalFinal = arquivoLivro.originalname;
      let foiConvertido = false;

      // Se for PDF, converte para EPUB
      if (arquivoLivro.mimetype === 'application/pdf') {
        
        try {
          bufferParaSalvar = await converterPdfParaEpub(
            arquivoLivro.buffer,
            uploadBookDto.title,
            uploadBookDto.author,
          );
          
          mimeTypeFinal = 'application/epub+zip';
          extensaoFinal = '.epub';
          nomeOriginalFinal = arquivoLivro.originalname.replace(/\.pdf$/i, '.epub');
          foiConvertido = true;

          // Força garbage collection se disponível
          if (global.gc) {
            global.gc();
            
          }

        } catch (erroConversao) {
          console.error('❌ Erro na conversão PDF->EPUB:', erroConversao);
          
          // Se a conversão falhar, lança o erro para o usuário
          if (erroConversao instanceof BadRequestException) {
            throw erroConversao;
          }
          
          throw new InternalServerErrorException(
            `Falha ao converter PDF para EPUB: ${erroConversao.message}`
          );
        }
      }

      // Gera um nome único para o livro mantendo a extensão (EPUB se foi convertido)
      const nomeUnicoLivro = `${uuidv4()}${extensaoFinal}`;
      const caminhoLivro = `${caminhoBase}/${nomeUnicoLivro}`;

      // Gera um nome único para a capa mantendo a extensão original
      let extensaoCapa: string;
      let nomeUnicoCapa: string;
      let caminhoCapa: string;
      if (capaParaUsar) {
        extensaoCapa = obterExtensao(capaParaUsar.originalname);
        nomeUnicoCapa = `capa-${uuidv4()}${extensaoCapa}`;
        caminhoCapa = `${caminhoBase}/${nomeUnicoCapa}`;
      } else {
        extensaoCapa = '.png';
        nomeUnicoCapa = '';
        caminhoCapa = '';
      }

      // Calcula o checksum SHA256 do arquivo final (EPUB ou original)
      const checksum = calcularChecksum(bufferParaSalvar);

      const dataUpload = new Date();

      let urlLivro: string;
      let urlCapa: string;

      if (useLocalStorage) {
        
        // Salva os arquivos em disco local para testes
        const storageRoot = path.join(process.cwd(), 'local-storage');
        const caminhoLivroLocal = path.join(storageRoot, caminhoLivro);
        const caminhoCapaLocal = path.join(storageRoot, caminhoCapa);

        // Garante diretórios
        await fs.promises.mkdir(path.dirname(caminhoLivroLocal), { recursive: true });
        await fs.promises.mkdir(path.dirname(caminhoCapaLocal), { recursive: true });

        // Escreve arquivos
        await fs.promises.writeFile(caminhoLivroLocal, bufferParaSalvar);
        if (capaParaUsar) {
          await fs.promises.writeFile(caminhoCapaLocal, capaParaUsar.buffer);
          urlCapa = `file://${caminhoCapaLocal}`;
        } else {
          urlCapa = urlCapaPadrao;
        }
        urlLivro = `file://${caminhoLivroLocal}`;

      } else {
        const bucket = this.firebaseService.getBucket();

        // Upload do livro (EPUB se foi convertido, ou arquivo original)
        const livroRef = bucket.file(caminhoLivro);
        await livroRef.save(bufferParaSalvar, {
          metadata: {
            contentType: mimeTypeFinal,
            metadata: {
              originalName: nomeOriginalFinal,
              originalNameUpload: arquivoLivro.originalname,
              size: bufferParaSalvar.length.toString(),
              dateUpload: dataUpload.toISOString(),
              type: 'book',
              title: uploadBookDto.title,
              checksum: checksum,
              convertidoDePdf: foiConvertido ? 'true' : 'false',
            },
          },
        });

        if (capaParaUsar) {
          // Upload da capa
          const capaRef = bucket.file(caminhoCapa);
          await capaRef.save(capaParaUsar.buffer, {
            metadata: {
              contentType: capaParaUsar.mimetype,
              metadata: {
                originalName: capaParaUsar.originalname,
                size: capaParaUsar.size.toString(),
                dateUpload: dataUpload.toISOString(),
                type: 'cover',
                title: uploadBookDto.title,
              },
            },
          });
          await capaRef.makePublic();
          urlCapa = `https://storage.googleapis.com/${bucket.name}/${caminhoCapa}`;
        } else {
          urlCapa = urlCapaPadrao;
        }
        await livroRef.makePublic();
        urlLivro = `https://storage.googleapis.com/${bucket.name}/${caminhoLivro}`;
      }

      // Libera buffers da memória
      bufferParaSalvar = null as any;
      arquivoLivro.buffer = null as any;
      if (arquivoCapa) {
        arquivoCapa.buffer = null as any;
      }

      // Converte a data de lançamento de dd/MM/yyyy para Date
      const dataLancamento = converterDataString(uploadBookDto.releaseDate);

      // Cria o documento no MongoDB, incluindo a URL da capa
      const novoLivro = new this.bookModel({
        title: uploadBookDto.title,
        author: uploadBookDto.author,
        category: uploadBookDto.category,
        description: uploadBookDto.description,
        releaseDate: dataLancamento,
        uploadedBy: userId,
        status: statusLivro as StatusLivro,
        book: { 
          originalName: nomeOriginalFinal,
          storagePath: caminhoLivro,
          storageFileName: nomeUnicoLivro,
          mimeType: mimeTypeFinal,
          size: bufferParaSalvar ? bufferParaSalvar.length : 0,
          checksum: checksum,
          uploadAt: dataUpload,
          cover: capaParaUsar ? {
            originalName: capaParaUsar.originalname,
            storagePath: caminhoCapa,
            storageFileName: nomeUnicoCapa,
            mimeType: capaParaUsar.mimetype,
            size: capaParaUsar.size,
            uploadAt: dataUpload,
            url: urlCapa,
          } : {
            originalName: 'default_cover.png',
            storagePath: 'oraculo/capa/book-case.png',
            storageFileName: 'book-case.png',
            mimeType: 'image/png',
            size: 0,
            uploadAt: dataUpload,
            url: urlCapaPadrao,
          },
        },
      });

      const livroSalvo = await novoLivro.save();

      return {
        id: livroSalvo._id,
        title: livroSalvo.title,
        author: livroSalvo.author,
        category: livroSalvo.category,
        description: livroSalvo.description,
        releaseDate: livroSalvo.releaseDate,
        status: livroSalvo.status,
        book: {
          url: urlLivro,
          originalName: nomeOriginalFinal,
          originalNameUpload: arquivoLivro.originalname,
          size: bufferParaSalvar ? bufferParaSalvar.length : 0,
          type: mimeTypeFinal,
          convertidoDePdf: foiConvertido,
        },
        cover: {
          url: urlCapa,
          originalName: capaParaUsar ? capaParaUsar.originalname : 'default_cover.png',
          size: capaParaUsar ? capaParaUsar.size : 0,
          type: capaParaUsar ? capaParaUsar.mimetype : 'image/png',
        },
        uploadAt: dataUpload,
      };

    } catch (erro) {
      console.error('=== ERRO NO UPLOAD ===');
      console.error('Erro:', erro);
      console.error(`Memory usage no erro: ${JSON.stringify(process.memoryUsage())}`);
      
      if (erro instanceof BadRequestException || erro instanceof InternalServerErrorException) {
        throw erro;
      }
      
      throw new InternalServerErrorException(
        `Erro ao fazer upload: ${erro.message || 'Erro desconhecido'}`
      );
    }
  }

  /**
   * Busca livros por título ou autor (case-insensitive)
   */
  async buscarLivros(query: string) {
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return [];
    }
    const regex = new RegExp(query.trim(), 'i');
    return this.bookModel.find({
      $or: [
        { title: regex },
        { author: regex }
      ],
      status: StatusLivro.APROVADO
    })
    .select('title author category')
    .sort({ title: 1 })
    .lean();
  }
}