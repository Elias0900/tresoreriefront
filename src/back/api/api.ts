export * from './agenceVoyagecontroller.service';
import { AgenceVoyagecontrollerService } from './agenceVoyagecontroller.service';
export * from './authController.service';
import { AuthControllerService } from './authController.service';
export * from './bilanController.service';
import { BilanControllerService } from './bilanController.service';
export * from './venteController.service';
import { VenteControllerService } from './venteController.service';
export const APIS = [AgenceVoyagecontrollerService, AuthControllerService, BilanControllerService, VenteControllerService];
