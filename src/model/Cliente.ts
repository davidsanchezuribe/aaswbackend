import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
class Cliente {
  @PrimaryColumn()
    id: string;

  @Column()
    nombre: string;

  @Column()
    direccion_residencia: string;

  constructor(id: string, nombre: string, direccion_residencia: string) {
    this.id = id;
    this.nombre = nombre;
    this.direccion_residencia = direccion_residencia;
  }
}

export default Cliente;
