export interface Region {
  id_region: number;
  nombre: string;
  pais: string;
}

export interface Station {
  id_estacion: number;
  nombre: string;
  ciudad: string;
  latitud: number;
  longitud: number;
  id_region: number;
}

export interface Measurement {
  id_medicion: number;
  fecha: string;
  valor_concentracion: number;
  indice_calidad: string;
  valor_calidad: number;
  contaminante: string;
  estacion: string;
}

export interface WeatherCondition {
  fecha: string;
  temperatura: number;
  humedad: number;
  velocidad_viento: number;
  estacion: string;
}

export interface Alert {
  id_alerta: number;
  nivel_alerta: string;
  mensaje: string;
  recomendaciones: string;
  fecha: string;
  estacion: string;
}