import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  Escrow,
  Payment,
  HasToPayFee,
  TransactionCreated,
  TransactionResolved,
  User,
  EscrowParameters,
} from '../generated/schema'
import {
  Payment as PaymentEvent,
  HasToPayFee as HasToPayFeeEvent,
  TransactionCreated as TransactionCreatedEvent,
  TransactionResolved as TransactionResolvedEvent,
  FeeTimeoutChanged,
} from '../generated/Escrow/Escrow'
import { ZERO, ONE } from './utils'

function createEscrow(id: string): Escrow {
  let escrow = new Escrow(id)
  escrow.buyer = Bytes.empty()
  escrow.seller = Bytes.empty()
  escrow.amount = ZERO
  escrow.deadline = ZERO
  escrow.disputeID = ZERO
  escrow.buyerFee = ZERO
  escrow.sellerFee = ZERO
  escrow.lastFeePaymentTime = ZERO
  escrow.templateData = ''
  escrow.templateDataMappings = ''
  escrow.status = 'NoDispute'
  return escrow
}

function createUser(id: string): User {
  let user = new User(id)
  user.totalEscrows = ZERO
  user.totalResolvedEscrows = ZERO
  user.save()
  return user
}

function getUser(id: string): User {
  let user = User.load(id)
  if (user === null) {
    user = createUser(id)
  }
  return user as User
}

function getEscrowParameters(): EscrowParameters {
  let escrowParameters = EscrowParameters.load('singleton')
  if (escrowParameters === null) {
    escrowParameters = new EscrowParameters('singleton')
    escrowParameters.feeTimeout = ZERO
    escrowParameters.save()
  }
  return escrowParameters;
}

export function handleFeeTimeoutChanged(event: FeeTimeoutChanged): void {
  let escrowParameters = getEscrowParameters()
  escrowParameters.feeTimeout = event.params._feeTimeout
  escrowParameters.save()
}

export function handlePayment(event: PaymentEvent): void {
  let escrowId = event.params._transactionID.toString()
  let paymentId =
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let payment = new Payment(paymentId)

  payment.escrow = escrowId
  payment.amount = event.params._amount
  payment.party = Bytes.fromHexString(event.params._party.toHex())

  payment.save()
}

export function handleHasToPayFee(event: HasToPayFeeEvent): void {
  let escrowId = event.params._transactionID.toString()
  let hasToPayFeeId =
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let hasToPayFee = new HasToPayFee(hasToPayFeeId)

  hasToPayFee.escrow = escrowId
  hasToPayFee.party = event.params._party.toString()

  hasToPayFee.save()
}

export function handleTransactionCreated(event: TransactionCreatedEvent): void {
  let escrowId = event.params._transactionID.toString()
  let escrow = Escrow.load(escrowId) || createEscrow(escrowId)

  escrow!.buyer = event.params._buyer
  escrow!.seller = event.params._seller
  escrow!.amount = event.params._amount
  escrow!.asset = event.params._asset
  escrow!.transactionUri = event.params._transactionUri
  escrow!.deadline = event.params._deadline
  escrow!.status = 'NoDispute'
  escrow!.feeTimeout = getEscrowParameters().feeTimeout;

  let buyer = getUser(event.params._buyer.toHex())
  let seller = getUser(event.params._seller.toHex())

  escrow!.users = [buyer.id, seller.id]
  escrow!.save()

  buyer.totalEscrows = buyer.totalEscrows.plus(ONE)
  seller.totalEscrows = seller.totalEscrows.plus(ONE)
  buyer.save()
  seller.save()

  let transactionCreatedId =
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let transactionCreated = new TransactionCreated(transactionCreatedId)
  transactionCreated.escrow = escrowId

  transactionCreated.save()
}

export function handleTransactionResolved(
  event: TransactionResolvedEvent
): void {
  let escrowId = event.params._transactionID.toString()
  let escrow = Escrow.load(escrowId) || createEscrow(escrowId)

  escrow!.status = 'TransactionResolved'

  let transactionResolvedId =
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let transactionResolved = new TransactionResolved(transactionResolvedId)
  transactionResolved.escrow = escrowId
  transactionResolved.resolution = event.params._resolution.toString()

  transactionResolved.save()
  escrow!.save()

  if (escrow !== null) {
    let buyer = getUser(escrow.buyer.toHex())
    let seller = getUser(escrow.seller.toHex())

    buyer.totalResolvedEscrows = buyer.totalResolvedEscrows.plus(ONE)
    seller.totalResolvedEscrows = seller.totalResolvedEscrows.plus(ONE)
    buyer.save()
    seller.save()
  }
}
