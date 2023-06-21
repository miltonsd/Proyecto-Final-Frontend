export interface AdminDataDialog<T, TData> {
  editar: boolean // Indica si el dialog será para editar un elemento existente o para crear
  elemento?: T // El tipo del elemento que se pasa al dialog de Update (Ej. reserva a editar)
  listaElementos?: TData[] // El conjunto de elementos que se usan para validar (Ej. reservas)
}
