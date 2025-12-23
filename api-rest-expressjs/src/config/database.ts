import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe pour gérer la connexion à MongoDB
 * Utilisation du pattern Singleton pour garantir une seule instance
 */
export class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  /**
   * Récupère l'instance unique de Database (Singleton)
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Établit la connexion à MongoDB
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Déjà connecté à MongoDB');
      return;
    }

    try {
      // 1. Récupération des variables depuis le fichier .env
      const dbUsername = process.env.DB_USERNAME;
      const dbPassword = process.env.DB_PASSWORD;
      const dbName = process.env.DB_NAME || 'api-rest-gsb';
      
      // Utilise la variable du .env, sinon utilise ton cluster par défaut
      const dbCluster = process.env.DB_CLUSTER || 'cluster0.8nrvosd.mongodb.net';

      // 2. Vérification que les identifiants sont bien présents
      if (!dbUsername || !dbPassword) {
        throw new Error('❌ Erreur : DB_USERNAME et DB_PASSWORD sont obligatoires dans le fichier .env');
      }

      // 3. Encodage du mot de passe (sécurité pour les caractères spéciaux)
      const encodedPassword = encodeURIComponent(dbPassword);

      // 4. Construction propre de l'URI de connexion
      const mongoUri = `mongodb+srv://${dbUsername}:${encodedPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority`;

      // 5. Connexion
      await mongoose.connect(mongoUri);
      
      this.isConnected = true;
      console.log(`✅ Connexion à MongoDB Atlas réussie sur la base : ${dbName}`);

    } catch (error) {
      console.error('❌ Erreur de connexion à MongoDB:', error);
      process.exit(1); // Arrête le serveur si la base de données ne fonctionne pas
    }
  }

  /**
   * Ferme la connexion à MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Déconnexion de MongoDB réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }
}