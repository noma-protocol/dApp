import addressData from './addresses.json';

// export async function getAddress(contractName, network) {
//     const module = await import(`./deployments/${network}/${contractName}.json`);
//     const { address } = module;
//     return address;
// }

export async function getAddress(contractName, network) {
  return addressData[network][contractName];
}

export async function getABI(contractName, network) {
    const module = await import(`./deployments/${contractName}.sol/${contractName}.json`);
    const { abi } = module;
    return abi;
}

export function fromExponential(expString) {
    const [significand, exponent] = expString.split('e');
    if (+exponent > 0) {
        const [lead, decimal] = significand.split('.');
        const newDecimal = (decimal || '').substr(0, +exponent);
        const remainder = (decimal || '').substr(+exponent);
        return lead + newDecimal + '.' + remainder;
    } else {
        const base = significand.replace('.', '');
        const zeros = Math.abs(exponent) - 1;
        return '0.' + '0'.repeat(zeros) + base;
    }
}

export function tickToPrice(tick, token0Decimals=18, token1Decimals=18){
	let price0 = (1.0001**Number(tick))/(10**(token1Decimals-token0Decimals));
	let price1 = 1 / price0;
	return [price0.toFixed(token1Decimals), price1.toFixed(token0Decimals)]
}

  
const getRevertReason = (errorString) => {
    const match = errorString.match(/revert\s+([a-zA-Z0-9\s<>=]+?)(\\n|\"|\s)/);
    return match ? match[1] : errorString;
};

export function extractRevertMessage(errorString) {
    const match = errorString.match(/revert (\d+ < \d+)/);
    if (match) {
      return match[0];
    } else {
      return getRevertReason(errorString);
    }
}

const networks = [
{
  name: "optimism",
  chainId: 10
},
{
  name: "ethereum",
  chainId: 1
},
{
  name: "ganache",
  chainId: 1337
},
{
  name: "arbitrum",
  chainId: 42161
}
]

export const chainIdToNetwork = (chainId) => {
  for (let network of networks) {
    if (network.chainId === chainId) {
      return network.name;
    }
  }
  return null;  // Return null or any other default value if chainId is not found
}

export const commify = (number) => {
  let numStr = number.toString();
  let [integerPart, decimalPart] = numStr.split(".");
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Format decimal part to have at least 4 decimal places if it exists
  decimalPart = decimalPart ? `${decimalPart}00000`.slice(0, 5) : "00000";
  return `${integerPart}.${decimalPart}`;
}
