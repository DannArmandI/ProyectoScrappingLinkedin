import { DateFormatter } from "@amcharts/amcharts4/core";

export interface ClientesTipo2 {
    id_cliente?: number,
    rut_cliente: string,
    dni: string,
    razon_social: string,
    fecha_inicio_contrato?:Date,
    fecha_fin_contrato?: Date,
    correo_electronico: string,
    estado?: number,
    created_at?: DateFormatter,
    update_at?: Date,
    id_rol?: number,
    id_plan?: number
}
