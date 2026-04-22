import {Links} from '../../features/escuelas/models/page-hateoas.model';

export interface EscuelaConductorResponse {
  id: number;
  nombreEstablecimiento: string;
  ruc: string;
  estado: string; // 0: Sin autorización, 1: Con autorización
  detalleDireccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  _links?: Links;
}
