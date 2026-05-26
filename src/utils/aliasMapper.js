const assetAliases = {
  BTC: "BTC",
  BITCOIN: "BTC",

  ETH: "ETH",
  ETHEREUM: "ETH",

  USDT: "USDT",
  TETHER: "USDT",
};

function normalizeAsset(asset) {
  if (!asset) return null;

  const key = asset.trim().toUpperCase();

  return assetAliases[key] || key;
}

function normalizeType(type) {
  if (!type) return null;

  const t = type.trim().toUpperCase();

  const typeMap = {
    BUY: "BUY",
    SELL: "SELL",
    TRANSFER_IN: "TRANSFER",
    TRANSFER_OUT: "TRANSFER",
    DEPOSIT: "TRANSFER",
    WITHDRAWAL: "TRANSFER",
  };

  return typeMap[t] || t;
}

module.exports = {
  normalizeAsset,
  normalizeType,
};
