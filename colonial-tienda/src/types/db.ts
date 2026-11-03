export type EstadoPedido =
  | "nuevo"
  | "confirmado"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
  visible: boolean;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  precio_oferta: number | null;
  stock: number;
  categoria_id: string | null;
  imagenes: string[];
  destacado: boolean;
  visible: boolean;
  orden: number;
  creado: string;
  actualizado: string;
}

export interface Pedido {
  id: string;
  codigo: string;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_email: string | null;
  direccion: string | null;
  notas: string | null;
  items: unknown;
  total: number;
  estado: EstadoPedido;
  creado: string;
}