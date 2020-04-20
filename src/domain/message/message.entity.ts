import {Column, Entity, PrimaryColumn} from 'typeorm';


@Entity()
export class Message {

  /**
   * Utiliza o serialized no recebimento da mensagem
   * ou monta com a seguinte logica. No caso do envio o Id é gerado.
   * fromMe_remote_idMessage
   */
  @PrimaryColumn()
  id: string;

  @Column()
  fromMe: boolean;

  @Column()
  idMessage: string;

  @Column()
  ack: number;

  @Column()
  hasMedia: boolean;

  @Column()
  body: string;

  @Column()
  msgType: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  isForwarded: boolean;

  @Column()
  broadcast: boolean;

  @Column()
  hasQuotedMsg: string;

  @Column()
  mentionedIds: string;

  @Column()
  mediaObjectName: string;

  @Column()
  timestamp: string;

}