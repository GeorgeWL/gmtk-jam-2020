import IKeyMap, { EnumKeyBinds } from "../interfaces/keymap";
import getRandomArrayItem from "../helpers/getRandomArrayItem";

// I could be cruel and add more, but that already feels a lot to keep track of
const ALLOWED_KEYBINDS = 'abcdefghijklmnopqrstuvwxyz';

export default (keyReleased: EnumKeyBinds, currentConfig: IKeyMap) => {
  // check what currentConfig is and store keys in array/set,
  const currentKeys = [currentConfig.up, currentConfig.left, currentConfig.right]
  // split allowed keybinds to array, remove those those in currentKeys
  const keysAllowedArray = ALLOWED_KEYBINDS.split('').filter(key => currentKeys.includes(key))
  // get a random key from the allowed array
  const newKey = getRandomArrayItem(keysAllowedArray);
  // return new config
  const newConfig = { ...currentConfig, [EnumKeyBinds[keyReleased]]: newKey }
  return newConfig
}
