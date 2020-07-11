export default (array: any[]) => {
  const len = array === null ? 0 : array.length
  return len ? array[Math.floor(Math.random() * len)] : array
}
