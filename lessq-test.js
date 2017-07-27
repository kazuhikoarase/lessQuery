$(function() {

  var log = function(msg) {
    console.log(msg);
  };

  var sw = function() {
    var totalTime = 0;
    var lastTime = +new Date();
    log('start');
    return function(label) {
      var time = +new Date();
      var delta = time - lastTime;
      totalTime += delta;
      log(label + ' - ' + delta + ' - ' + totalTime);
    };
  }();

  var assertEquals = function(expected, actual) {
    if (expected !== actual) {
      throw 'expected ' + expected + ' but ' + actual;
    }
  }

  assertEquals(0, $().length);
  assertEquals(0, $(null).length);
  assertEquals(0, $({}.a).length);
  assertEquals(0, $(false).length);
  assertEquals(0, $(0).length);

  var $ul = $('<ul></ul>');
  var $1 = $('<li><input type="checkbox"/>1</li>');
  var $2 = $('<li><input type="checkbox"/>2</li>');
  var $3 = $('<li><input type="checkbox"/>3</li>');
  var $4 = $('<li><input type="checkbox"/>4</li>');
  $ul.append($3);
  $ul.prepend($2);
  $4.insertAfter($3);
  $1.insertBefore($2);
  $('BODY').append('Test').append('<br/>').append($ul);
  var t2 = +new Date();
  var arr = [$1, $2, $3, $4];
  $.each(arr, function(i, $e) {
    $e.css('color', '#ff0000');
    assertEquals('rgb(255, 0, 0)', $e.css('color') );
    $e.css({ color: '#00ff00' });
    assertEquals('rgb(0, 255, 0)', $e.css('color') );
    $e.attr('xTest', 'a');
    assertEquals('a', $e.attr('xTest') );
    $e.attr({ xTest : 'b' });
    assertEquals('b', $e.attr('xTest') );
    if (i % 2 == 0) {
      $e.children('INPUT').prop('checked', true);
      assertEquals(true, $e.children('INPUT').prop('checked') );
      $e.children('INPUT').val('y');
      assertEquals('y', $e.children('INPUT').val() );
    } else {
      $e.children('INPUT').prop({checked : true});
      assertEquals(true, $e.children('INPUT').prop('checked') );
      $e.children('INPUT').val('x');
      assertEquals('x', $e.children('INPUT').val() );
    }
  });

  $('BODY').append($('<span></span>').on('mouseover mouseout', function(event) {
    $(this).text('<"&' + event.type + '&"/>');
  }).trigger('mouseout') );
  $('BODY').append($('<span></span>').on('mouseover mouseout', function(event) {
    $(this).html('<span style="color:blue;">' + event.type + '</span>').
      children().css('pointer-events', 'none');
  }).trigger('mouseout') );

  $('BODY').append('<span>A</span>').
    append('&#160;').
    append('<span>B</span>').
    append('&#160;&#160;&lt;&gt;&#160;&#160;').
    append('<span>C</span>');

  $2.parent().append($2.parent().children().last().clone() ).
    append($2.parent().children().first().clone() );

  assertEquals(1, $2.index() );
  var $wh = $('<div></div>').css({
    margin : '5px 6px 7px 8px', padding : '9px 10px 11px 12px',
    borderStyle : 'solid',
    borderColor : '#ff00ff',
    borderWidth : '1px 2px 3px 4px',
    width : '300px', height : '100px', overflow : 'scroll'
  }).text('Width / Height Test').on('mousedown', function(event) {
    console.log('which:' + event.which + '/' + event.offsetX);
  });

  $('BODY').append($wh);

  assertEquals(342, $wh.outerWidth(true) );
  assertEquals(328, $wh.outerWidth() );
  assertEquals(322, $wh.innerWidth() );
  assertEquals(300, $wh.width() );
  assertEquals(136, $wh.outerHeight(true) );
  assertEquals(124, $wh.outerHeight() );
  assertEquals(120, $wh.innerHeight() );
  assertEquals(100, $wh.height() );

  //  getComputedStyle(document.getElementById('content'),null).
//  getPropertyValue('border-left-width')
  
  $(document.body).append($('<div></div>').css({
    backgroundColor: '#0099cc',
    width: '160px', height : '90px',
    position: 'absolute', left: '50px', top: '200px',
    opacity: '0.8'
  }).on('mousedown', function(event) {

    var doc_mousemoveHandler = function(event) {
      $e.css('left', (o.left + event.pageX - p.x) + 'px').
       css('top', (o.top + event.pageY - p.y) + 'px');
    };
    var doc_mouseupHandler = function(event) {
      $(document).off('mousemove', doc_mousemoveHandler).
        off('mouseup', doc_mouseupHandler);
    };

    $(document).on('mousemove', doc_mousemoveHandler).
      on('mouseup', doc_mouseupHandler);

    event.preventDefault();

    var $e = $(event.target);
    var o = $(event.target).offset();
    var p = { x : event.pageX, y : event.pageY };

    assertEquals('my data', $(this).data('abc').zz);
    assertEquals('my data', $.data($(this)[0], 'abc').zz);

    var backup = $(this).data('abc').zz;

    $(this).data('abc', { zz : 'MyData' })
    assertEquals('MyData', $(this).data('abc').zz);
    assertEquals('MyData', $.data($(this)[0], 'abc').zz);

    // restore
    $(this).data('abc', { zz : backup })

  }).data('abc', { zz : 'my data' }) );

  sw('end');
});
