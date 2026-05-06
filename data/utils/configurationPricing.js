import cylinderModels from "../cylinderModels.js";
import {
  mapOptionToUpchargeKey,
  mapTypToModelKey,
} from "./optionMapping.js";

export function formatEuro(price) {
  return Number(price || 0).toFixed(2).replace(".", ",");
}

export function getBaseCylinderPrice(modelName) {
  const modelConfig = cylinderModels[modelName];
  const baseSize = modelConfig?.Doppelzylinder?.sizes?.find(
    (size) => Number(size.outside) === 30 && Number(size.inside) === 30
  );

  return baseSize?.price || 0;
}

export function getTotalKeysFromRows(rows) {
  if (!rows?.[0]) return 0;
  return rows[0].reduce((sum, keyItem) => {
    return sum + (Number(keyItem.keyquantity) || 0);
  }, 0);
}

export function getPositionDataFromRows(rows) {
  return (rows || []).map((row, rowIndex) => ({
    POS: rowIndex + 1,
    Bezeichnung: row[0]?.doorDesignation || "",
    Anzahl: row[0]?.doorquantity || 1,
    Typ: row[0]?.type || "",
    SizeA: row[0]?.outside || "",
    SizeI: row[0]?.inside || "",
    Option: (row[0]?.optionsSelected || []).join(", "),
  }));
}

export function calculatePriceForRows(modelName, rows) {
  const modelConfig = cylinderModels[modelName];
  if (!modelConfig || modelName === "Kein bestimmtes Modell") return 0;

  let totalPrice = 0;

  getPositionDataFromRows(rows).forEach((item) => {
    const typeKey = mapTypToModelKey(item.Typ);
    const typeConfig = modelConfig[typeKey];
    if (!typeConfig) return;

    const sizeMatch = typeConfig.sizes?.find(
      (size) =>
        Number(size.outside) === Number(item.SizeA) &&
        Number(size.inside) === Number(item.SizeI)
    );
    if (!sizeMatch) return;

    let priceForDoor = sizeMatch.price || 0;
    const upcharges = typeConfig.optionUpcharges || modelConfig.optionUpcharges || {};
    const selectedOptions = (item.Option || "")
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);

    selectedOptions.forEach((option) => {
      const mappedKey = mapOptionToUpchargeKey(option);
      if (mappedKey && upcharges[mappedKey]) {
        priceForDoor += upcharges[mappedKey];
      }
    });

    totalPrice += priceForDoor * (Number(item.Anzahl) || 1);
  });

  totalPrice += (modelConfig.keyPrice || 0) * getTotalKeysFromRows(rows);
  return totalPrice;
}

export function generateConfigurationTextFromRows(rows, totalKeys = getTotalKeysFromRows(rows)) {
  const lines = ["<br>"];

  getPositionDataFromRows(rows).forEach((pos) => {
    const name =
      pos.Bezeichnung && pos.Bezeichnung.trim() !== ""
        ? pos.Bezeichnung
        : `Tür ${pos.POS}`;
    const sizes = `${pos.SizeA} / ${pos.SizeI}`;
    lines.push(
      `-<b> ${name}</b> (Typ: ${pos.Typ || "Unbekannter Typ"}, Größe: ${sizes}, Anzahl: ${pos.Anzahl || 1}, Optionen: ${pos.Option || ""})<br>`
    );
  });

  lines.push("<br>");
  (rows?.[0] || []).forEach((keyItem, keyIndex) => {
    const keyName =
      keyItem.keyname && keyItem.keyname.trim() !== ""
        ? keyItem.keyname
        : `Schlüssel ${keyIndex + 1}`;
    const positions = (rows || [])
      .filter((row) => row[keyIndex]?.checked)
      .map((row, rowIndex) => {
        const doorName = row[0]?.doorDesignation?.trim();
        return doorName || `Tür ${rowIndex + 1}`;
      })
      .join(", ");

    lines.push(`-<b> ${keyName}</b> schließt: ${positions}<br>`);
  });

  lines.push(`<br> <b>Gesamtschlüssel:</b> ${totalKeys}`);
  return lines.join("\n");
}

