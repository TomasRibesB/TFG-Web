import { TipoProfesional } from './tipo-profesional';
import {User} from './user';


export interface UserTipoProfesional {
    id?: number;
    archivo?: string;
    directorio?: string;
    certificadora?: string;
    user?: User;
    tipoProfesional?: TipoProfesional;
}
