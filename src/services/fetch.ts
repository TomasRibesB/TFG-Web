import {StorageAdapter} from '../config/adapters/storage-adapter';
import { getRoutineRequest } from './entrenamiento';
import { getPlanNutricionalRequest } from './nutricion';
import { getDocumentosRequest } from './salud';
import { getProfesionalesRequest } from './user';

export const initialFetch = async () => {
    const rutinas = await getRoutineRequest();
    const planNutricional = await getPlanNutricionalRequest();
    const documentos = await getDocumentosRequest();
    const profesionales = await getProfesionalesRequest();

    await StorageAdapter.setItem('rutinas', rutinas);
    await StorageAdapter.setItem('planNutricional', planNutricional);
    await StorageAdapter.setItem('documentos', documentos);
    await StorageAdapter.setItem('profesionales', profesionales);
    }