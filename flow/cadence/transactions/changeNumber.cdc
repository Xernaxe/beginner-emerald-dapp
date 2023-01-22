import NumberX from "../contracts/NumberX.cdc"

transaction(myNewNumber: Int) {

  prepare(signer: AuthAccount) {}

  execute {
    NumberX.changeNumber(newNumber: myNewNumber)
  }
}