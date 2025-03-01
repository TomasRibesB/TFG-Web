import {api} from '../config/apis/api';

export const getTurnosRequest = async () => {
    const {data} = await api.get(`/turnos`);
    return data;
    };