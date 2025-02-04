export * from './authController.service';
import { AuthControllerService } from './authController.service';
export * from './bilanController.service';
import { BilanControllerService } from './bilanController.service';
export * from './personController.service';
import { PersonControllerService } from './personController.service';
export * from './venteController.service';
import { VenteControllerService } from './venteController.service';
export const APIS = [AuthControllerService, BilanControllerService, PersonControllerService, VenteControllerService];
