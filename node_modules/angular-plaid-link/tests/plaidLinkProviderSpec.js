describe('plaidLink', function() {
    var plaidLink;

    beforeEach(module("angular-plaid-link"));
    beforeEach(inject(function(_plaidLink_) {
        plaidLink = _plaidLink_;
    }));
    beforeEach(inject());

    it('should set configDefault', function() {
        console.log('1 plaidLink: ', plaidLink);
        plaidLink.create({clientName: 'Test App'});
        console.log('2 plaidLink: ', plaidLink);
    });
});
