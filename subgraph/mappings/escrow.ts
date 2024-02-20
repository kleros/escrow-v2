import { Bytes } from "@graphprotocol/graph-ts";
import {
  Escrow,
  Payment,
  HasToPayFee,
  TransactionCreated,
  TransactionResolved,
  User,
  DisputeRequest,
  EscrowParameters,
} from "../generated/schema";
import {
  Payment as PaymentEvent,
  HasToPayFee as HasToPayFeeEvent,
  TransactionCreated as TransactionCreatedEvent,
  TransactionResolved as TransactionResolvedEvent,
  DisputeRequest as DisputeRequestEvent,
  ParameterUpdated as ParameterUpdatedEvent,
} from "../generated/Escrow/Escrow";

function createEscrow(id: string): Escrow {
  let escrow = new Escrow(id);
  escrow.buyer = Bytes.empty();
  escrow.seller = Bytes.empty();
  escrow.amount = ZERO;
  escrow.deadline = ZERO;
  escrow.buyerFee = ZERO;
  escrow.sellerFee = ZERO;
  escrow.lastFeePaymentTime = ZERO;
  escrow.templateData = "";
  escrow.templateDataMappings = "";
  escrow.status = "NoDispute";
  return escrow;
}

function createUser(id: string): User {
  let user = new User(id);
  user.totalEscrows = ZERO;
  user.totalResolvedEscrows = ZERO;
  user.totalDisputedEscrows = ZERO;
  user.totalNoDisputedEscrows = ZERO;
  user.totalWaitingBuyerEscrows = ZERO;
  user.totalWaitingSellerEscrows = ZERO;
  user.save();
  return user;
}

function getUser(id: string): User {
  let user = User.load(id);
  if (user === null) {
    user = createUser(id);
  }
  return user as User;
}

function getEscrowParameters(): EscrowParameters {
  let escrowParameters = EscrowParameters.load('singleton')
  if (escrowParameters === null) {
    escrowParameters = new EscrowParameters('singleton')
    escrowParameters.feeTimeout = ZERO
    escrowParameters.settlementTimeout = ZERO
    escrowParameters.arbitratorExtraData = Bytes.fromHexString("0x00")
    escrowParameters.save()
  }
  return escrowParameters;
}

export function handleParameterUpdated(event: ParameterUpdatedEvent): void {
  let escrowParameters = getEscrowParameters()
  escrowParameters.feeTimeout = event.params._feeTimeout
  escrowParameters.settlementTimeout = event.params._settlementTimeout
  escrowParameters.arbitratorExtraData = event.params._arbitratorExtraData
  escrowParameters.save()
}

export function handlePayment(event: PaymentEvent): void {
  let escrowId = event.params._transactionID.toString();
  let paymentId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let payment = new Payment(paymentId);

  payment.escrow = escrowId;
  payment.amount = event.params._amount;
  payment.timestamp = event.block.timestamp;
  payment.party = Bytes.fromHexString(event.params._party.toHex());

  payment.save();
}

export function handleHasToPayFee(event: HasToPayFeeEvent): void {
  let escrowId = event.params._transactionID.toString();
  let escrow = Escrow.load(escrowId);

  if (!escrow) {
    escrow = createEscrow(escrowId);
  }

  let seller = getUser(escrow.seller.toHex());
  let buyer = getUser(escrow.buyer.toHex());

  buyer.totalNoDisputedEscrows = buyer.totalNoDisputedEscrows.minus(ONE);
  seller.totalNoDisputedEscrows = seller.totalNoDisputedEscrows.minus(ONE);

  let partyValue = event.params._party.toString();
  if (partyValue == "2") {
    escrow.status = "WaitingSeller";
    seller.totalWaitingSellerEscrows = seller.totalWaitingSellerEscrows.plus(ONE);
    buyer.totalWaitingSellerEscrows = buyer.totalWaitingSellerEscrows.plus(ONE);
  } else if (partyValue == "1") {
    escrow.status = "WaitingBuyer";
    buyer.totalWaitingBuyerEscrows = buyer.totalWaitingBuyerEscrows.plus(ONE);
    seller.totalWaitingBuyerEscrows = seller.totalWaitingBuyerEscrows.plus(ONE);
  }

  seller.save();
  buyer.save();

  let hasToPayFeeId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let hasToPayFee = new HasToPayFee(hasToPayFeeId);
  hasToPayFee.escrow = escrowId;
  hasToPayFee.party = partyValue.toString();
  hasToPayFee.timestamp = event.block.timestamp;
  hasToPayFee.save();

  escrow.save();
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
  escrow!.timestamp = event.block.timestamp;
  escrow!.status = "NoDispute";

  let buyer = getUser(event.params._buyer.toHex());
  let seller = getUser(event.params._seller.toHex());

  escrow!.users = [buyer.id, seller.id];
  escrow!.save();

  buyer.totalEscrows = buyer.totalEscrows.plus(ONE);
  buyer.totalNoDisputedEscrows = buyer.totalNoDisputedEscrows.plus(ONE);
  buyer.save();
  seller.totalEscrows = seller.totalEscrows.plus(ONE);
  seller.totalNoDisputedEscrows = seller.totalNoDisputedEscrows.plus(ONE);
  seller.save();

  let transactionCreatedId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let transactionCreated = new TransactionCreated(transactionCreatedId);
  transactionCreated.escrow = escrowId;

  transactionCreated.save();
}

export function handleTransactionResolved(event: TransactionResolvedEvent): void {
  let escrowId = event.params._transactionID.toString();
  let escrow = Escrow.load(escrowId);

  if (!escrow) {
    escrow = createEscrow(escrowId);
  }

  let transactionResolvedId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let transactionResolved = new TransactionResolved(transactionResolvedId);
  transactionResolved.escrow = escrowId;
  transactionResolved.resolution = event.params._resolution;
  transactionResolved.timestamp = event.block.timestamp;
  transactionResolved.save();

  let buyerId = escrow.buyer.toHex();
  let buyer = User.load(buyerId);
  if (!buyer) {
    buyer = createUser(buyerId);
  }
  let sellerId = escrow.seller.toHex();
  let seller = User.load(sellerId);
  if (!seller) {
    seller = createUser(sellerId);
  }

  buyer.totalResolvedEscrows = buyer.totalResolvedEscrows.plus(ONE);
  seller.totalResolvedEscrows = seller.totalResolvedEscrows.plus(ONE);

  if (escrow.status == "DisputeCreated") {
    buyer.totalDisputedEscrows = buyer.totalDisputedEscrows.minus(ONE);
    seller.totalDisputedEscrows = seller.totalDisputedEscrows.minus(ONE);
  }
  if (escrow.status == "NoDispute") {
    buyer.totalNoDisputedEscrows = buyer.totalNoDisputedEscrows.minus(ONE);
    seller.totalNoDisputedEscrows = seller.totalNoDisputedEscrows.minus(ONE);
  }

  buyer.save();
  seller.save();

  escrow.status = "TransactionResolved";
  escrow.timestamp = event.block.timestamp;
  escrow.save();
}

export function handleDisputeRequest(event: DisputeRequestEvent): void {
  let transactionID = event.params._externalDisputeID.toString();
  let disputeID = event.params._arbitrableDisputeID.toString();

  let disputeRequest = new DisputeRequest(disputeID);

  let escrow = Escrow.load(transactionID);
  if (!escrow) {
    escrow = createEscrow(transactionID);
  }

  disputeRequest.escrow = escrow.id;
  disputeRequest.timestamp = event.block.timestamp;
  disputeRequest.from = Bytes.fromHexString(event.transaction.from.toHex());
  disputeRequest.save();

  let buyer = getUser(escrow.buyer.toHex());
  let seller = getUser(escrow.seller.toHex());

  buyer.totalDisputedEscrows = buyer.totalDisputedEscrows.plus(ONE);
  seller.totalDisputedEscrows = seller.totalDisputedEscrows.plus(ONE);

  if (escrow.status == "WaitingBuyer") {
    buyer.totalWaitingBuyerEscrows = buyer.totalWaitingBuyerEscrows.minus(ONE);
    seller.totalWaitingBuyerEscrows = seller.totalWaitingBuyerEscrows.minus(ONE);
  }
  if (escrow.status == "WaitingSeller") {
    seller.totalWaitingSellerEscrows = seller.totalWaitingSellerEscrows.minus(ONE);
    buyer.totalWaitingSellerEscrows = buyer.totalWaitingSellerEscrows.minus(ONE);
  }

  buyer.save();
  seller.save();
  escrow.status = "DisputeCreated";
  escrow.save();
}
