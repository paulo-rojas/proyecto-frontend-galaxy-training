export interface Link {
  href: string;
}

export interface Links {
  self?: Link;
  update?: Link;
  delete?: Link;
  [rel: string]: Link | undefined;
}

export interface PageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface EscuelaConductorRequestDto {
  nombreEstablecimiento: string;
  ruc: string;
  estado: string;
  detalleDireccion: string;
  distritoId: number;
}

export interface EscuelaConductorResponseDto {
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


export interface EmbeddedEscuelas {
  escuelaConductorResponseDtoList: EscuelaConductorResponseDto[];
}

export interface PagedEscuelasResponse {
  _embedded?: EmbeddedEscuelas;
  _links?: Links;
  page: PageInfo;
}
