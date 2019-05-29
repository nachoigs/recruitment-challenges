const fs = require('fs')

// I used the relatively recent additions of classes in Javascript to do the refactor. It's possible to use functions in the same way.

class Checker{
  orders = []
  fraudResults = []
  fileContent = fs.readFileSync(filePath, 'utf8')
  lines = fileContent.split('\n')
  normalizer = new Normalizer()

  constructor(filePath){
    this.filePath = filePath
  }

  Check (filePath) {
    // READ FRAUD LINES
    let orders = []
    let fraudResults = []
  
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
  }
}


// Class normalizer to normalize every order. Could make it static (the methods), but I prefer to instanciate it.
class Normalizer{
  constructor(){

  }

  normalize(order){

  }

  normalize_email(email){

  }

  normalize_street(street){

  }

  normalize_state(state){

  }
}

function Normalize()

  // NORMALIZE
  for (let order of orders) {
    // Normalize email
    let aux = order.email.split('@')
    let atIndex = aux[0].indexOf('+')
    aux[0] = atIndex < 0 ? aux[0].replace('.', '') : aux[0].replace('.', '').substring(0, atIndex - 1)
    order.email = aux.join('@')

    // Normalize street
    order.street = order.street.replace('st.', 'street').replace('rd.', 'road')

    // Normalize state
    order.state = order.street.replace('il', 'illinois').replace('ca', 'california').replace('ny', 'new york')
  }

  // CHECK FRAUD
  for (let i = 0; i < orders.length; i++) {
    let current = orders[i]
    let isFraudulent = false

    for (let j = i + 1; j < orders.length; j++) {
      isFraudulent = false
      if (current.dealId === orders[j].dealId
        && current.email === orders[j].email
        && current.creditCard !== orders[j].creditCard) {
          isFraudulent = true
        }
      
      if (current.dealId === orders[j].dealId
        && current.state === orders[j].state
        && current.zipCode === orders[j].zipCode
        && current.street === orders[j].street
        && current.city === orders[j].city
        && current.creditCard !== orders[j].creditCard) {
          isFraudulent = true
        }
      
      if (isFraudulent) {
        fraudResults.push({
          isFraudulent: true,
          orderId: orders[j].orderId
        })
      }
    }
  }

  return fraudResults
}

module.exports = { Check }
