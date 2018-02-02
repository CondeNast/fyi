import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | list fyis');

test('should show fyis list as the homepage', function(assert){
  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/fyis', 'should redirect automatically');
  });

});

