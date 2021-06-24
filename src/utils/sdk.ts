// https://www.npmjs.com/package/@starcoin/starcoin
import { providers } from '@starcoin/starcoin';

const network = localStorage.getItem('network');
const nodeUrl = `https://${network}-seed.starcoin.org`;
const provider = new providers.JsonRpcProvider(nodeUrl);

export async function getTxnData(txnHash: string) {
  try {
    const result = await provider.getTransaction(txnHash);
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressData(hash: string) {
  try {
    const result = await provider.getResource(hash, '0x1::Account::Account');
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getBalancesData(hash: string) {
  try {
    const result = await provider.getBalances(hash);
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getAddressSTCBalance(hash: string) {
  try {
    const result = await provider.getResource(hash, '0x1::Account::Balance<0x1::STC::STC>');
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getEpochData() {
  try {
    const result = await provider.getResource('0x1', '0x1::Epoch::Epoch');
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getPollData(hash: string, type_args_1: string) {
  try {
    const result = await provider.getResource(hash, `0x1::Dao::Proposal<0x1::STC::STC,${type_args_1}>`);
    return result;
  } catch (error: any) {
    return false;
  }
}


export async function getPollAccountVotes(hash: string) {
  try {
    const result = await provider.getResource(hash, '0x1::Dao::Vote<0x1::STC::STC>');
    return result;
  } catch (error: any) {
    return false;
  }
}

export async function getTreasuryBalance(hash: string) {
  try {
    const result = await provider.call({
      function_id: '0x1::Treasury::balance',
      type_args: ['0x1::STC::STC'],
      args: [],
    });
    return result;
  } catch (error: any) {
    return false;
  }
}