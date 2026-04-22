import {EscuelaConductorResponse} from '../../../shared/models/escuela-conductor-response-model';

export interface PublicPage {
  content: EscuelaConductorResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
