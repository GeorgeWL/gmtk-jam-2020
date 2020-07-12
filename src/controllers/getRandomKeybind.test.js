// import IKeyMap, { EnumKeyBinds } from "../interfaces/keymap";
// import getRandomArrayItem from "../helpers/getRandomArrayItem";

import getRandomKeybind from "./getRandomKeybind";
import { EnumKeyBinds } from "../interfaces/keymap";

// // I could be cruel and add more, but that already feels a lot to keep track of
// const ALLOWED_KEYBINDS = 'abcdefghijklmnopqrstuvwxyz';

// export default (keyReleased: EnumKeyBinds, currentConfig: IKeyMap) => {
//   // check what currentConfig is and store keys in array/set,
//   const currentKeys = [currentConfig.up, currentConfig.left, currentConfig.right]
//   // split allowed keybinds to array, remove those those in currentKeys
//   const keysAllowedArray = ALLOWED_KEYBINDS.split('').filter(key => currentKeys.includes(key))
//   // get a random key from the allowed array
//   const newKey = getRandomArrayItem(keysAllowedArray);
//   // return new config
//   const newConfig = { ...currentConfig, [EnumKeyBinds[keyReleased]]: newKey }
//   return newConfig
// }
describe('When supplied with valid keyReleased and currentConfig, returns new config', () => {
  it('should return new config every time', () => {
    [...Array(1000).keys()].forEach(() => {
      expect(getRandomKeybind(EnumKeyBinds.up, { up: 'w', left: 'a', right: 'd' })).not.toEqual({ up: 'w', left: 'a', right: 'd' })
      expect(getRandomKeybind(EnumKeyBinds.up, { up: 'w', left: 'a', right: 'd' }).up).not.toEqual('w')
    })
  });
  it('should not modify any other config options', () => {
    expect(getRandomKeybind(EnumKeyBinds.up, { up: 'w', left: 'a', right: 'd' }).right).toEqual('d')
    expect(getRandomKeybind(EnumKeyBinds.up, { up: 'w', left: 'a', right: 'd' }).left).toEqual('a')
  })
});
