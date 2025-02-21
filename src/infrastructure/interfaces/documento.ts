import {User} from './user';
import {TipoDocumento} from '../enums/tipoDocumentos';
import {TipoProfesional} from './tipo-profesional';

export interface Documento {
  id: number;
  tipo: TipoDocumento;
  titulo: string;
  descripcion: string;
  archivo?: string | null;
  directorio?: string | null;
  fechaSubida: Date;
  nombreProfesional?: string | null;
  emailProfesional?: string | null;
  apellidoProfesional?: string | null;
  tipoProfesional: TipoProfesional | null;
  dniProfesional?: string | null;
  profesional?: User | null;
  usuario: User;
  visibilidad: User[];
}
