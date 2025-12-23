/**
 * Interface représentant un praticien
 */
export interface IPraticien{
    _id?: string;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    rue? : string;
    ville? : string;
    codePostal? : string;
    createdAt?: Date;
    updatedAt?: Date;
}


/**
 * Interface pour la création d'un praticien
 */
export interface ICreatePraticien {
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  rue? : string;
  ville? : string;
  codePostal? : string;
}
