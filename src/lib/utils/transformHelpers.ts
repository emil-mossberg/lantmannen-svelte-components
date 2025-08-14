import magentoSvelteBridge from "@lib/stores/MagentoSvelteBridge.svelte";

export const transformPrefSalesQty = (val: string | undefined)  => {
  const num = Number(val);
  return Number.isNaN(num) || num === 0 ? 1 : num;
}

export const isBulkPackaging = (packagingType: string | null, fallbackType?: string | null) => {
  const effectiveType = packagingType || fallbackType || '';
  return magentoSvelteBridge.tonnagePackageType.includes(effectiveType);
}
