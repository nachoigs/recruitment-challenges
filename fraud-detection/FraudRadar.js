const fs = require('fs')

// I used the relatively recent additions of classes in Javascript to do the refactor. It's possible to use functions in the same way.

// Class that checks a file with possible fraudulent orders and return an array with the fraudulent orderIds.
class Checker {

  constructor() {
    this.normalizer = new Normalizer()
    this.checker = new FraudChecker()
  }

  // Method that checks if a file with orders have fraudulent orders.
  check(filePath) {
    // READ FRAUD LINES
    let orders = this.getOrders(filePath)
    let ordersnormalized = []
    let fraudResults = []
    for (let order of orders) {
      ordersnormalized.push(this.normalizer.normalize(order))
    }
    return this.checker.checkFraud(ordersnormalized)
  }

  // Get the orders from a file and store and return an array with them
  getOrders(filePath) {
    let orders = []

    let fileContent = fs.readFileSync(filePath, 'utf8')
    let lines = fileContent.split('\n')
    for (let line of lines) {
      let items = line.split(',')
      let order = {
        orderId: Number(items[0]),
        dealId: Number(items[1]),
        email: items[2].toLowerCase(),
        street: items[3].toLowerCase(),
        city: items[4].toLowerCase(),
        state: items[5].toLowerCase(),
        zipCode: items[6],
        creditCard: items[7]
      }
      orders.push(order)
    }
    return orders
  }
}


// Class to normalize every order. Could make it static (the methods), but I prefer to instanciate it.
class Normalizer {
  constructor() {}

  normalize(order) {
    order.email = this.normalizeEmail(order.email)
    order.street = this.normalizeStreet(order.street)
    order.state = this.normalizeState(order.state)

    return order;
  }

  normalizeEmail(email) {
    let aux = email.split('@')
    let atIndex = aux[0].indexOf('+')
    aux[0] = atIndex < 0 ? aux[0].replace('.', '') : aux[0].replace('.', '').substring(0, atIndex - 1)
    return aux.join('@')
  }

  normalizeStreet(street) {
    return street.replace('st.', 'street').replace('rd.', 'road')
  }
  // There was a typo here in the original file (order.street, should be order.state)
  normalizeState(state) {
    return state.replace('il', 'illinois').replace('ca', 'california').replace('ny', 'new york')
  }
}

// Class to check a possible fraud in some orders and return the fraudulent order
class FraudChecker {
  constructor() {}

  checkFraud(orders) {
    let fraudResults = []
    for (let i = 0; i < orders.length; i++) {
      for (let j = i + 1; j < orders.length; j++) {
        if (this.compareFraud(orders[i], orders[j])) {
          fraudResults.push({
            isFraudulent: true,
            orderId: orders[j].orderId
          })
        }
      }
    }
    return fraudResults
  }


  // Compare two orders and say if it's fraudulent (true in boolean)
  compareFraud(firstorder, secondorder) {

    if (firstorder.dealId === secondorder.dealId
      && firstorder.email === secondorder.email
      && firstorder.creditCard !== secondorder.creditCard) {
      return true
    }

    if (firstorder.dealId === secondorder.dealId
      && firstorder.state === secondorder.state
      && firstorder.zipCode === secondorder.zipCode
      && firstorder.street === secondorder.street
      && firstorder.city === secondorder.city
      && firstorder.creditCard !== secondorder.creditCard) {
      return true
    }
    return false
  }

}

module.exports.Checker = Checker

