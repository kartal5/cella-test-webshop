
describe('cellatest e2e test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173')
        cy.get('a[href="/login"]').click()
        cy.get('input[id="email"]').type('username@live.dk') // Insert a admin username here, show the one also given to teacher
        cy.get('input[id="password"]').type('your-password') // Insert a admin password here, show the one also given to teacher
        cy.get('button[type="submit"]').click() // Target actual submit button on login page
         // Go to front page
    })

    it('add to cart and purchase',() => {
        cy.visit('http://localhost:5173')

        //Add the product from home page featured catalog to cart
        cy.get('button#add-to-cart-btn').first().click() //Targets the first product on the home page

        // Check the cart
        cy.get('a[href="/cart"]').click()
        cy.get('.cart-item').should('have.length', 1) // Check if the cart has 1 item

        /* Need login to purchase, No correct login in this test

        // Go to the payment page
        cy.get('button#checkout').click() // Go to the payment page

        // Fill in the payment form
        cy.get('input[id="fullName"]').type('Cypress e2e Tester') // Fill in the address
        cy.get('input[id="address"]').type('123 Main St') // Fill in the address
        // cy.get('input[name="postalCode"]').type('12345') // Fill in the postal code
        cy.get('input[id="city"]').type('Anytown') // Fill in the city
        cy.get('input[id="country"]').type('Anywhere') // Fill in the city
        
        // Fill in payment method
        cy.get('input[id="cardNumber"]').type('1234567890123456') // Fill in the card number
        cy.get('input[id="expiryDate"]').type('12/25') // Fill in the expiration date
        cy.get('input[id="cvv"]').type('123') // Fill in the cvv

        */

    })
})