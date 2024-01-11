import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  Escrow,
  Payment,
  HasToPayFee,
  TransactionCreated,
  TransactionResolved,
} from '../generated/schema'
import {
  Payment as PaymentEvent,
  HasToPayFee as HasToPayFeeEvent,
  TransactionCreated as TransactionCreatedEvent,
  TransactionResolved as TransactionResolvedEvent,
} from '../generated/Escrow/Escrow'

export function handlePayment(event: PaymentEvent): void {
  let escrowId = event.params._transactionID.toString()
  let paymentId = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let payment = new Payment(paymentId)

  payment.escrow = escrowId
  payment.amount = event.params._amount
  payment.party = Bytes.fromHexString(event.params._party.toHex())

  payment.save()
}

export function handleHasToPayFee(event: HasToPayFeeEvent): void {
  let escrowId = event.params._transactionID.toString()
  let hasToPayFeeId = event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let hasToPayFee = new HasToPayFee(hasToPayFeeId)

  hasToPayFee.escrow = escrowId
  hasToPayFee.party = event.params._party.toString()

  hasToPayFee.save()
}

export function handleTransactionCreated(event: TransactionCreatedEvent): void {
  let escrowId = event.params._transactionID.toString();
  let escrow = Escrow.load(escrowId) || createEscrow(escrowId);

  escrow!.buyer = event.params._buyer;
  escrow!.seller = event.params._seller;
  escrow!.amount = event.params._amount;
  escrow!.asset = event.params._asset;
  escrow!.transactionUri = event.params._transactionUri;
  escrow!.deadline = event.params._deadline;
  escrow!.status = 'NoDispute';

  let transactionCreatedId = event.transaction.hash.toHex() + '-' + event.logIndex.toString();
  let transactionCreated = new TransactionCreated(transactionCreatedId);
  transactionCreated.escrow = escrowId;

  transactionCreated.save();
  escrow!.save();
}

export function handleTransactionResolved(event: TransactionResolvedEvent): void {
  let escrowId = event.params._transactionID.toString();
  let escrow = Escrow.load(escrowId) || createEscrow(escrowId);

  escrow!.status = 'TransactionResolved';

  let transactionResolvedId = event.transaction.hash.toHex() + '-' + event.logIndex.toString();
  let transactionResolved = new TransactionResolved(transactionResolvedId);
  transactionResolved.escrow = escrowId;
  transactionResolved.resolution = event.params._resolution.toString();

  transactionResolved.save();
  escrow!.save();
}

function createEscrow(id: string): Escrow {
  let escrow = new Escrow(id)
  escrow.buyer = Bytes.empty()
  escrow.seller = Bytes.empty()
  escrow.transactionUri = ''
  escrow.amount = BigInt.fromI32(0)
  escrow.asset = ''
  escrow.deadline = BigInt.fromI32(0)
  escrow.disputeID = BigInt.fromI32(0)
  escrow.buyerFee = BigInt.fromI32(0)
  escrow.sellerFee = BigInt.fromI32(0)
  escrow.lastFeePaymentTime = BigInt.fromI32(0)
  escrow.templateData = ''
  escrow.templateDataMappings = ''
  escrow.status = 'NoDispute'
  return escrow
}
