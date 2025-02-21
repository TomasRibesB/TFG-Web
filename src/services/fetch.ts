import {StorageAdapter} from '../config/adapters/storage-adapter';
import { getTicketsRequest } from './tickets';
import { getClientesRequest, getRecordatoriosRequest } from './user';
import { getTurnosRequest } from './turnos';

export const initialFetch = async () => {
    const clientes = await getClientesRequest();
    const tickets = await getTicketsRequest();
    const turnos = await getTurnosRequest();
    const recordatorios = await getRecordatoriosRequest();

    await StorageAdapter.setItem('clientes', clientes);
    await StorageAdapter.setItem('tickets', tickets);
    await StorageAdapter.setItem('turnos', turnos);
    await StorageAdapter.setItem('recordatorios', recordatorios);
    }