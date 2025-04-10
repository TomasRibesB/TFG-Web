import { TipoProfesional } from './tipo-profesional';
import {User} from './user';


export interface UserTipoProfesional {
    id?: number;
    archivo?: string;
    directorio?: string;
    isCertified?: boolean;
    user?: User;
    tipoProfesional?: TipoProfesional;
}
