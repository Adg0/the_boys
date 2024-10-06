/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  SVC,
  SVC_StrLog,
  SVC_Liquidated,
  SVC_Deposit,
  SVC_Withdraw,
  SVC_Repayment,
  SVC_CollateralDeposited,
  SVC_BorrowedLog,
} from "generated";

SVC.StrLog.handler(async ({ event, context }) => {
  const entity: SVC_StrLog = {
    id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
  };

  context.SVC_StrLog.set(entity);
});


SVC.Liquidated.handler(async ({ event, context }) => {
  const entity: SVC_Liquidated = {
    id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
  };

  context.SVC_Liquidated.set(entity);
});


SVC.Deposit.handler(async ({ event, context }) => {
  const entity: SVC_Deposit = {
    id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
  };

  context.SVC_Deposit.set(entity);
});


SVC.Withdraw.handler(async ({ event, context }) => {
  const entity: SVC_Withdraw = {
    id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
  };

  context.SVC_Withdraw.set(entity);
});


SVC.Repayment.handler(async ({ event, context }) => {
  const entity: SVC_Repayment = {
    id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
  };

  context.SVC_Repayment.set(entity);
});


SVC.CollateralDeposited.handler(async ({ event, context }) => {
  const entity: SVC_CollateralDeposited = {
    id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
  };

  context.SVC_CollateralDeposited.set(entity);
});


SVC.BorrowedLog.handler(async ({ event, context }) => {
  const entity: SVC_BorrowedLog = {
    id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
  };

  context.SVC_BorrowedLog.set(entity);
});

