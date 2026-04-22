import { PageInfo } from "../../../shared/models/page.info.model";
import {EscuelaConductorResponse} from '../../../shared/models/escuela-conductor-response-model';

export interface Link {
  href: string;
}

export interface Links {
  self?: Link;
  update?: Link;
  delete?: Link;
  [rel: string]: Link | undefined;
}
export interface EmbeddedEscuelas {
  escuelaConductorResponseDtoList: EscuelaConductorResponse[];
}

export interface PagedEscuelasResponse {
  _embedded?: EmbeddedEscuelas;
  _links?: Links;
  page: PageInfo;
}
