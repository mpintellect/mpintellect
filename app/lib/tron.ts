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
  value: string;
  type: 'Transfer';
}

export interface VerifyPaymentParams {
  txid?: string;
  expectedAmount: number;
  walletAddress: string;
  contractAddress?: string;
  maxAgeMinutes?: number;
}

export interface PaymentVerificationResult {
  success: boolean;
  transaction?: TRC20Transaction;
  error?: string;
}

// Constants
const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT TRC20 contract
const TRONGRID_API_URL = 'https://api.trongrid.io';
const DEFAULT_MAX_AGE_MINUTES = 60; // 1 hour

/**
 * Verifies a USDT (TRC20) payment
 */
export async function verifyPayment({
  txid,
  expectedAmount,
  walletAddress,
  contractAddress = USDT_CONTRACT_ADDRESS,
  maxAgeMinutes = DEFAULT_MAX_AGE_MINUTES
}: VerifyPaymentParams): Promise<PaymentVerificationResult> {
  try {
    // Validate inputs
    if (!process.env.TRONGRID_API_KEY) {
      throw new Error('TRONGRID_API_KEY environment variable not configured');
    }

    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    // Get transactions for the wallet
    const transactions = await getTRC20Transactions(walletAddress, contractAddress);

    // Find matching transaction
    const maxAgeMs = maxAgeMinutes * 60 * 1000;
    const now = Date.now();
    const expectedAmountInSun = Math.floor(expectedAmount * 10**6); // USDT has 6 decimals

    const matchingTx = transactions.find(tx => {
      // Check if specific transaction ID was requested
      if (txid && tx.transaction_id !== txid) return false;

      // Check transaction age
      const txAge = now - tx.block_timestamp;
      if (txAge > maxAgeMs) return false;

      // Check amount (with 1% tolerance to account for exchange rate fluctuations)
      const txAmount = parseInt(tx.value);
      const minAmount = expectedAmountInSun * 0.99;
      return txAmount >= minAmount;
    });

    if (!matchingTx) {
      return {
        success: false,
        error: txid 
          ? 'Specified transaction does not match requirements'
          : 'No matching transaction found'
      };
    }

    return {
      success: true,
      transaction: matchingTx
    };

  } catch (error) {
    console.error('Payment verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed'
    };
  }
}

/**
 * Fetches TRC20 transactions for a wallet
 */
async function getTRC20Transactions(
  walletAddress: string,
  contractAddress: string,
  limit = 50
): Promise<TRC20Transaction[]> {
  const url = `${TRONGRID_API_URL}/v1/accounts/${walletAddress}/transactions/trc20`;
  
  const response = await axios.get(url, {
    params: {
      contract_address: contractAddress,
      limit,
      order_by: 'block_timestamp,desc'
    },
    headers: {
      'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY!
    }
  });

  if (!response.data?.data) {
    throw new Error('Invalid response from TRON API');
  }

  return response.data.data
    .filter((tx: any) => tx.type === 'Transfer' && tx.to === walletAddress);
}

/**
 * Converts a TRON address to its base58 format
 */
export function toBase58Address(address: string): string {
  if (address.startsWith('T')) {
    return address;
  }
  if (address.startsWith('41')) {
    return 'T' + address.substring(2);
  }
  throw new Error('Invalid TRON address format');
}

/**
 * Converts from sun units (smallest USDT unit) to standard units
 */
export function fromSun(value: number | string, decimals = 6): number {
  const numericValue = typeof value === 'string' ? parseInt(value) : value;
  return numericValue / Math.pow(10, decimals);
}