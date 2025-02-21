import {api} from '../config/apis/api';

export const getTurnosRequest = async () => {
    const {data} = await api.get(`/turnos`);
    console.log(JSON.stringify(data, null, 2));
    return data;
    };