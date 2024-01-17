import { Bytes } from '@graphprotocol/graph-ts'
import {
  Escrow,
  Payment,
  HasToPayFee,
  TransactionCreated,
  TransactionResolved,
  User,
  DisputeRequest,
} from '../generated/schema'
import {
  Payment as PaymentEvent,
  HasToPayFee as HasToPayFeeEvent,
  TransactionCreated as TransactionCreatedEvent,
  TransactionResolved as TransactionResolvedEvent,
  DisputeRequest as DisputeRequestEvent,
} from '../generated/Escrow/Escrow'
import { ZERO, ONE } from './utils'

function createEscrow(id: string): Escrow {
  let escrow = new Escrow(id)
  escrow.buyer = Bytes.empty()
  escrow.seller = Bytes.empty()
  escrow.amount = ZERO
  escrow.deadline = ZERO
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

export function handlePayment(event: PaymentEvent): void {
  let escrowId = event.params._transactionID.toString()
  let paymentId =
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let payment = new Payment(paymentId)

  payment.escrow = escrowId
  payment.amount = event.params._amount
  payment.timestamp = event.block.timestamp
  payment.party = Bytes.fromHexString(event.params._party.toHex())

  payment.save()
}

export function handleHasToPayFee(event: HasToPayFeeEvent): void {
  let escrowId = event.params._transactionID.toString()

  let hasToPayFeeId =
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let hasToPayFee = new HasToPayFee(hasToPayFeeId)

  hasToPayFee.escrow = escrowId

  let partyValue = event.params._party
  hasToPayFee.party = partyValue.toString()
  hasToPayFee.timestamp = event.block.timestamp

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
  escrow!.timestamp = event.block.timestamp
  escrow!.status = 'NoDispute'

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
  let escrow = Escrow.load(escrowId)

  if (!escrow) {
    escrow = createEscrow(escrowId)
  }

  escrow.status = 'TransactionResolved'
  escrow.timestamp = event.block.timestamp
  escrow.save()

  let transactionResolvedId =
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  let transactionResolved = new TransactionResolved(transactionResolvedId)
  transactionResolved.escrow = escrowId
  transactionResolved.resolution = event.params._resolution
  transactionResolved.timestamp = event.block.timestamp
  transactionResolved.save()

  let buyerId = escrow.buyer.toHex()
  let buyer = User.load(buyerId)
  if (!buyer) {
    buyer = createUser(buyerId)
  }

  buyer.totalResolvedEscrows = buyer.totalResolvedEscrows.plus(ONE)
  buyer.save()

  let sellerId = escrow.seller.toHex()
  let seller = User.load(sellerId)
  if (!seller) {
    seller = createUser(sellerId)
  }

  seller.totalResolvedEscrows = seller.totalResolvedEscrows.plus(ONE)
  seller.save()
}

export function handleDisputeRequest(event: DisputeRequestEvent): void {
  let transactionID = event.params._externalDisputeID.toString()
  let disputeID = event.params._arbitrableDisputeID.toString()

  let disputeRequest = new DisputeRequest(disputeID)

  let escrow = Escrow.load(transactionID)
  if (!escrow) {
    escrow = createEscrow(transactionID)
  }

  disputeRequest.escrow = escrow.id
  disputeRequest.timestamp = event.block.timestamp
  disputeRequest.from = Bytes.fromHexString(event.transaction.from.toHex())
  disputeRequest.save()
}
