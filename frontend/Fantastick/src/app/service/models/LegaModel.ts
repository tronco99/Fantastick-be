export interface LegaModel {
  _id: string;
  CNOME: string;
  CTIPO: string;
  CCATEGORIA: string;
  CVISIBILITA: string;
  CNOMEVALUTA: string;
  NBUDGET: number;
  CLOGO: string;
  DDATAINIZIO: string; // Usa `Date` se intendi manipolare la data
  DDATAFINE: string; // Usa `Date` se intendi manipolare la data
  LIDUSER: String[]; 
  LIDUSERADMIN: String[]; 
  NMAXUSER: number;
}