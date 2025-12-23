
import { Types } from 'mongoose';
import { VisiteurModel, IVisiteurDocument } from '../models/Visiteur';
import { ICreateVisiteur } from '../models/interfaces/IVisiteur';
/**VisiteurModel
 * Service pour gérer la logique métier des visiteurs
 */
export class VisiteurService {
  /**
   * Créer un nouveau visiteur
   */
  public async createVisiteur(visiteurData: ICreateVisiteur): Promise<IVisiteurDocument> {
    try {
      // Vérifier si l'email existe déjà
      const existingVisiteur = await VisiteurModel.findOne({ email: visiteurData.email });
     
      if (existingVisiteur) {
        throw new Error(`Un visiteur avec l'email ${visiteurData.email} existe déjà`);
      }
      // Créer et sauvegarder le visiteur
      const visiteur = new VisiteurModel(visiteurData);
      await visiteur.save();
      return visiteur;
    } catch (error: any) {
      // Gestion des erreurs de validation Mongoose
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        throw new Error(`Validation échouée: ${messages.join(', ')}`);
      }
      throw error;
    }
  }


  /**
   * Récupérer tous les visiteurs
   */
  public async getAllVisiteurs(): Promise<IVisiteurDocument[]> {
    try {
      const visiteurs = await VisiteurModel.find().populate('visites').populate({
        path: 'portefeuille',        
        populate: {
          path: 'praticien',       
          model: 'Praticien',        
          select: 'nom prenom ville' 
        }
      })
        .sort({ dateCreation: -1 })
        .exec();
      return visiteurs;
    } catch (error) {
      throw new Error('Erreur lors de la récupération des visiteurs');
    }
  }


  /**
   * Récupérer un visiteur par son ID
   */
  public async getVisiteurById(id: string): Promise<IVisiteurDocument | null> {
    try {
      const visiteur = await VisiteurModel.findById(id).exec();
     
      if (!visiteur) {
        throw new Error(`Visiteur avec l'ID ${id} introuvable`);
      }
      return visiteur;
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new Error(`ID invalide: ${id}`);
      }
      throw error;
    }
  }

  
}
