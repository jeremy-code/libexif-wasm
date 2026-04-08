import { BiMap } from "./BiMap.ts";
import type { EmbindEnum } from "../interfaces/emscripten.ts";
import type { Entry } from "../interfaces/utils.ts";

const mapEmbindEnumToBiMap = <K extends PropertyKey, V>(
  embindEnum: EmbindEnum<Record<K, V>>,
): BiMap<K, V> => {
  const biMap = (
    Object.entries(embindEnum) as Entry<EmbindEnum<Record<K, V>>>[]
  ).reduce((acc, [key, value]) => {
    if (key === "argCount" || key === "values") {
      return acc;
    }
    acc.set(key, value.value);
    return acc;
  }, new BiMap<K, V>());
  return biMap;
};

export { mapEmbindEnumToBiMap };
