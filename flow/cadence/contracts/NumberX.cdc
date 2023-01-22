 pub contract NumberX {

    pub var number: Int

    pub fun changeNumber(newNumber: Int) {
        self.number = newNumber
    }

    init() {
        self.number = 0
    }
}