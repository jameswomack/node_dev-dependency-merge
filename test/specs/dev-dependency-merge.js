describe('module', function(){
  var path = require('path');
  var merge = require(path.join(process.cwd(), 'dev-dependency-merge'));
  var src = path.join(process.cwd(), 'test/mocks/package_src.json');
  var dest = path.join(process.cwd(), 'test/mocks/package_dest.json');
  before(function(done){
    merge.remove(dest, done);
  });
  afterEach(function(done){
    merge.remove(dest, done);
  });
  describe('start',function(){
    it('should merge devDependencies', function(done){
      merge([src,dest],function(){
        var srcJSON = require(src);
        var destJSON = require(dest);
        destJSON.devDependencies.should.eql(srcJSON.devDependencies);
        done();
      });
    });
    it('should throw if no callback is passed', function(){
      expect(function(){merge(['','']);}).to.throw(Error);
    });
  });
  describe('remove',function(){
    it('should remove devDependencies', function(done){
      merge([src,dest],function(){
        merge.remove(dest, function(){
          var destJSON = require(dest);
          expect(destJSON.devDependencies).to.be.undefined;
          done();
        });
      });
    });
    it('should throw if no callback is passed', function(){
      expect(function(){merge.remove('');}).to.throw(Error);
    });
  });
});
