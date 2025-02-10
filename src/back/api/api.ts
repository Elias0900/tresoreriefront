export * from './agenceVoyageController.service';
import { AgenceVoyageControllerService } from './agenceVoyageController.service';
export * from './authController.service';
import { AuthControllerService } from './authController.service';
export * from './bilanController.service';
import { BilanControllerService } from './bilanController.service';
export * from './venteController.service';
import { VenteControllerService } from './venteController.service';
export const APIS = [AgenceVoyageControllerService, AuthControllerService, BilanControllerService, VenteControllerService];
