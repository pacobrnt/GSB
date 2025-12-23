import { Types } from "mongoose";

/**
 * Interface représentant le portefeuille d'un visiteur
 */
export interface IPortefeuille{
    _id?: string;
    dateDebutSuivi: Date;
    dateFinSuivi?: Date;
    praticien: Types.ObjectId;
    visiteur: Types.ObjectId;
}


/**
 * Interface pour ajouter un praticien dans le portefeuille
 */
