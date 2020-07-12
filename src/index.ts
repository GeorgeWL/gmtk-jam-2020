// Hello World
if (module.hot) {
  module.hot.accept()
}
console.log('JAVASCRIPT')
const testElement: HTMLElement | null = document.getElementById('test')
if (testElement) {
  testElement.innerText = 'Testing'
  setTimeout(() => {
    testElement.innerText = 'Testing Timeout'
  }, 2000);
}
