describe('Node-RED Dashboard 2.0 - Buttons', () => {
    beforeEach(() => {
        cy.deployFixture('dashboard-buttons')
        cy.visit('/dashboard/page1')
    })

    it('can be clicked and outputs the correct payload & topic are emitted', () => {
        // Emitting strings
        cy.clickAndWait(cy.get('button').contains('Button 1 (str)'))
        cy.checkOutput('msg.payload', 'button 1 clicked')
        cy.checkOutput('msg.topic', 'button-str-topic')

        // Emitting JSON
        cy.clickAndWait(cy.get('button').contains('Button 1 (json)'))
        cy.checkOutput('msg.payload.hello', 'world')
        cy.checkOutput('msg.topic', 'button-json-topic')
    })

    it('can retrieve global variables when clicked', () => {
        // set global. var via helper API
        cy.setGlobalVar('test', 'global-var')
        cy.checkOutput('test', 'global-var')

        // Emitting global var
        cy.clickAndWait(cy.get('button').contains('Button 2 (global)'))
        cy.checkOutput('msg.payload', 'global-var')
    })

    it('will prevent emulation of a click when receiving a message, if configured that way', () => {
        // Emitting global var
        cy.clickAndWait(cy.get('button').contains('Button 3 (trigger)'))
        cy.checkOutput('msg.payload', 'no-emulate', 'not.eq')
    })

    it('will allow emulation of a click when receiving a message, if configured that way', () => {
        // Emitting global var
        cy.clickAndWait(cy.get('button').contains('Button 4 (trigger)'))
        cy.checkOutput('msg.payload', 'emulate')
    })
})
