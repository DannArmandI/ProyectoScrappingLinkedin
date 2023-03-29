export interface Plan {
    id_plan?: number,
    nombre_plan?: string,
    numero_usuarios: number,
    numero_menciones: number,
    precio_CLP: number,
    precio_USD: number,
    cantidad_reportes: number,
    porcentaje_descuento: number,
    duracion_almacenamiento : number,
    estado?: number
}