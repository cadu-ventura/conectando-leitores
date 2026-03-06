import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import { Book } from "../entities/book.schema";
import { FirebaseService } from "../../firebase/firebase.service";

@Injectable()
export class GetBookService {
    constructor(
        @InjectModel(Book.name) private readonly bookModel: Model<Book>,
        private readonly firebaseService: FirebaseService
    ) {}

    async findById(id: string): Promise<{title: string; author: string; bookFile: Buffer; contentType: string}> {
        // Validate if the ID is a valid MongoDB ObjectId
        if (!isValidObjectId(id)) {
            throw new NotFoundException('ID do livro inválido');
        }

        // Find the book in the database
        const book = await this.bookModel.findById(id);
        if (!book) {
            throw new NotFoundException('Livro não encontrado');
        }

        try {
            // Get the file from Firebase Storage
            const bucket = this.firebaseService.getBucket();
            const file = bucket.file(book.book.storagePath);
            
            // Para debug
            console.log('Tentando buscar arquivo:', {
                storagePath: book.book.storagePath,
                fileName: book.book.storageFileName
            });
            
            // Download the file
            const [fileContent] = await file.download();
            
            // Determine content type based on file extension
            const contentType = book.book.storagePath.toLowerCase().endsWith('.epub') 
                ? 'application/epub'  // Correto MIME type para EPUB
                : 'application/pdf';

            // Return only the required fields
            return {
                title: book.title,
                author: book.author,
                bookFile: fileContent,
                contentType
            };
        } catch (error) {
            console.error('Erro ao buscar arquivo no Firebase:', error);
            throw new NotFoundException(`Arquivo do livro não encontrado no storage. Path: ${book.book.storagePath}`);
        }
    }
}