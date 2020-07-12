import IKeyMap, { EnumKeyBinds } from "../interfaces/keymap";
import getRandomArrayItem from "../helpers/getRandomArrayItem";

// I could be cruel and add more, but that already feels a lot to keep track of
const ALLOWED_KEYBINDS = 'abcdefghijklmnopqrstuvwxyz';

export default (keyReleased: EnumKeyBinds, currentConfig: IKeyMap) => {
  const currentKeys = [currentConfig.up, currentConfig.left, currentConfig.right]
  const keysAllowedArray = ALLOWED_KEYBINDS.split('').filter(key => currentKeys.includes(key))
  const newKey = getRandomArrayItem(keysAllowedArray);
  const newConfig = { ...currentConfig, [EnumKeyBinds[keyReleased]]: newKey }
  return newConfig
}
