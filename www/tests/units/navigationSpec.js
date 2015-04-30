/**
 * Created by chenglian on 15/4/11.
 */
describe("Navigation : ", function() {
    // load the service's module
    beforeEach(module('iPrice'));

    // instantiate service
    var rootScope;
    var state;

    beforeEach(function () {
        //inject $rootScope
        inject(function ($rootScope, $state) {
            //create a new child scope and call it root scope
            rootScope = $rootScope.$new();
            //instead don't create a child scope and keep a reference to the actual rootScope
            //rootScope = $rootScope;
            state = $state;
        })
    });

    it("on app start shoud launch ad page", function() {
        state.transitionTo('ads');
        expect(state.$current).toBe('ads');
    });
});

