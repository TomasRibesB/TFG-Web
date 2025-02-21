import {StorageAdapter} from '../config/adapters/storage-adapter';
import { getRoutineRequest } from './entrenamiento';
import { getPlanNutricionalRequest } from './nutricion';
import { getDocumentosRequest } from './salud';
import { getClientesRequest } from './user';

export const initialFetch = async () => {
    const clientes = await getClientesRequest();

    await StorageAdapter.setItem('clientes', clientes);
    }