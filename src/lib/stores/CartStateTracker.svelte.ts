import singletonFactory from './SingletonFactory'

class CartStateTracker {
  public inProgress = $state<{value: boolean}>({value: false})

  constructor() {
    window.addEventListener('magento:cartUpdated', () => {
      this.stopCartInProgress()
    })
  }

  public startCartInProgress() {
    this.inProgress.value = true
  }

  public stopCartInProgress() {
    this.inProgress.value = false
  }
}

export default singletonFactory(() => new CartStateTracker())()
