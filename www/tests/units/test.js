/**
 * Created by Pluto on 4/10/2015.
 */
describe("rootScope", function() {
    // load the service's module
    beforeEach(module('iPrice'));

    // instantiate service
    var rootScope;

    beforeEach(function () {
        //inject $rootScope
        inject(function ($rootScope) {
            //create a new child scope and call it root scope
            rootScope = $rootScope.$new();
            //instead don't create a child scope and keep a reference to the actual rootScope
            //rootScope = $rootScope;
        })
    });

    it("should contain config object", function() {
        expect(rootScope.config).not.toBeNull();
    });
});
