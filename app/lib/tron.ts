// lib/tron.ts
import axios from 'axios';

// Types
export interface TRC20Transaction {
  transaction_id: string;
  block_timestamp: number;
  token_info: {
    symbol: string;
    decimals: number;
    address: string;
  };
  from: string;
  to: string;
  value: string;            // string in Sun (1e-6 USDT)
  type: 'Transfer';
}

export interface VerifyPaymentParams {
  txid?: string;
  expectedAmount: number;   // in USDT (e.g., 10.00)
  walletAddress: string;    // base58 (T...)
  contractAddress?: string; // defaults to USDT
  maxAgeMinutes?: number;   // default 60
}

export interface PaymentVerificationResult {
  success: boolean;
  transaction?: TRC20Transaction;
  error?: string;
}

// Simple TronGrid list shape
type TronGridList<T> = { data: T[] };

// Constants
const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT TRC20
const TRONGRID_API_URL = 'https://api.trongrid.io';
const DEFAULT_MAX_AGE_MINUTES = 60;

/** Verifies a USDT (TRC20) payment */
export async function verifyPayment({
  txid,
  expectedAmount,
  walletAddress,
  contractAddress = USDT_CONTRACT_ADDRESS,
  maxAgeMinutes = DEFAULT_MAX_AGE_MINUTES,
}: VerifyPaymentParams): Promise<PaymentVerificationResult> {
  try {
    if (!process.env.TRONGRID_API_KEY) {
      throw new Error('TRONGRID_API_KEY environment variable not configured');
    }
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    const transactions = await getTRC20Transactions(walletAddress, contractAddress);

    const maxAgeMs = maxAgeMinutes * 60 * 1000;
    const now = Date.now();
    const expectedSun = Math.floor(expectedAmount * 1e6); // USDT has 6 decimals

    const match = transactions.find((tx: TRC20Transaction) => {
      if (txid && tx.transaction_id !== txid) return false;

      const isFresh = now - tx.block_timestamp <= maxAgeMs;
      if (!isFresh) return false;

      const txSun = Number.parseInt(tx.value, 10);
      // Allow tiny tolerance (1%)
      return txSun >= expectedSun * 0.99;
    });

    if (!match) {
      return {
        success: false,
        error: txid
          ? 'Specified transaction does not match requirements'
          : 'No matching transaction found',
      };
    }

    return { success: true, transaction: match };
  } catch (error) {
    console.error('Payment verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}

/** Fetch TRC20 transactions for a wallet */
async function getTRC20Transactions(
  walletAddress: string,
  contractAddress: string,
  limit = 50
): Promise<TRC20Transaction[]> {
  const url = `${TRONGRID_API_URL}/v1/accounts/${walletAddress}/transactions/trc20`;

  const res = await axios.get<TronGridList<TRC20Transaction>>(url, {
    params: {
      contract_address: contractAddress,
      limit,
      order_by: 'block_timestamp,desc',
    },
    headers: {
      'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY as string,
    },
  });

  const list = res.data?.data ?? [];
  return list.filter(
    (tx: TRC20Transaction) =>
      tx.type === 'Transfer' &&
      (tx.to || '').toLowerCase() === walletAddress.toLowerCase()
  );
}

/** Convert TRON hex address → base58 (basic helper) */
export function toBase58Address(address: string): string {
  if (address.startsWith('T')) return address;
  if (address.startsWith('41')) return 'T' + address.substring(2);
  throw new Error('Invalid TRON address format');
}

/** Convert from sun (1e-6) to USDT */
export function fromSun(value: number | string, decimals = 6): number {
  const n = typeof value === 'string' ? Number.parseInt(value, 10) : value;
  return n / Math.pow(10, decimals);
}