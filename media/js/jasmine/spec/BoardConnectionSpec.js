describe("Board Connection", function(){

    var fakeWs = {};
    var boardConnection;

    beforeEach(function () {
        fakeWs.send = jasmine.createSpy("ws send");
        boardConnection = new BoardConnection(fakeWs);
    });

    it("should send move message through ws", function(){
        boardConnection.subscribe(222)
        boardConnection.movePostIt(111, 10, 20);
        expect(fakeWs.send).toHaveBeenCalledWith('{"type":"move","args":{"channel_id":222,"postit_id":111,"x":10,"y":20}}');
    });

    it("should send register message through ws", function(){
        boardConnection.subscribe(222);
        expect(fakeWs.send).toHaveBeenCalledWith('{"type":"register","args":{"channel_id":222}}');
    });
});